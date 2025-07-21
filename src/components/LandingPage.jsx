import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSwimmer, FaHardHat, FaPhone, FaClock, FaShieldAlt, FaTruck, FaTint, FaWater, FaBars, FaTimes } from 'react-icons/fa';
import EditableElement from './EditableElement';
import EditModeIndicator from './EditModeIndicator';
import AquaFreshLogo from './AquaFreshLogo';

function LandingPage({ content, auth, isAdminRoute }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll effect for navigation
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.nav')) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Setup intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Animate counters
          if (entry.target.classList.contains('stat-number')) {
            const finalValue = parseInt(entry.target.textContent);
            if (finalValue && !isNaN(finalValue)) {
              animateCounter(entry.target, finalValue);
            }
          }
        }
      });
    }, observerOptions);

    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
    });

    // Observe stat numbers for counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      observer.observe(stat);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation function
  const animateCounter = (element, finalValue) => {
    let currentValue = 0;
    const increment = finalValue / 50; // Animation steps
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        currentValue = finalValue;
        clearInterval(timer);
      }
      // Only add '+' for numbers between 100-999 (not for years like 1998)
      element.textContent = Math.round(currentValue) + (finalValue >= 100 && finalValue < 1000 ? '+' : '');
    }, 30);
  };

  useEffect(() => {
    // Parallax effect for floating elements
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      document.querySelectorAll('.floating-element').forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.01}deg)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scrolling for navigation links
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu when nav item is clicked
    const target = document.querySelector(targetId);
    if (target) {
      // Calculate offset to account for fixed navigation height
      const navHeight = 80; // Approximate height of fixed nav
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu, current state:', mobileMenuOpen);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const serviceAreas = [
    'Parkland County',
    'Stony Plain', 
    'Spruce Grove',
    'West Edmonton',
    'Leduc County',
    'Sturgeon County',
    'Lac Ste Anne County',
    'Westlock County'
  ];

  return (
    <>
      {/* Edit Mode Indicator */}
      {content.editMode && (
        <EditModeIndicator 
          onExit={content.toggleEditMode}
          onAdmin={handleAdminAccess}
        />
      )}

      {/* Navigation */}
      <nav className="nav" id="nav" role="navigation" aria-label="Main navigation">
        <div className="nav-content">
          <AquaFreshLogo 
            className="logo-container" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          
          {/* Desktop Navigation */}
          <ul className="nav-links">
            <li><a href="#home" onClick={(e) => handleNavClick(e, '#home')} aria-label="Go to homepage">Home</a></li>
            <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')} aria-label="View our services">Services</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')} aria-label="Learn about us">About</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} aria-label="Contact us">Contact</a></li>
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <ul className="mobile-nav-links">
            <li><a href="#home" onClick={(e) => handleNavClick(e, '#home')} aria-label="Go to homepage">Home</a></li>
            <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')} aria-label="View our services">Services</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')} aria-label="Learn about us">About</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} aria-label="Contact us">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home" role="banner">
        <div className="hero-container">
          <div className="hero-content">
            <EditableElement
              tag="h1"
              contentKey="heroTitle"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
            
            <EditableElement
              tag="p"
              contentKey="heroDescription"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />

            {/* Hero Features */}
            <div className="hero-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <FaClock />
                </div>
                <div className="feature-content">
                  <h4>Same Day Service</h4>
                  <p>Quick response times</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaShieldAlt />
                </div>
                <div className="feature-content">
                  <h4>Licensed & Insured</h4>
                  <p>Professional service</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaTruck />
                </div>
                <div className="feature-content">
                  <h4>Modern Fleet</h4>
                  <p>Clean delivery trucks</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <FaWater className="trust-icon" />
                <span>Potable Water Certified</span>
              </div>
              <div className="trust-badge">
                <FaPhone className="trust-icon" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="visual-card">
              <div className="service-stats">
                <div className="stat-item">
                  <EditableElement
                    tag="div"
                    className="stat-number"
                    contentKey="stat1Number"
                    content={content.content}
                    editMode={content.editMode}
                    onUpdate={content.updateContent}
                  />
                  <EditableElement
                    tag="div"
                    className="stat-label"
                    contentKey="stat1Label"
                    content={content.content}
                    editMode={content.editMode}
                    onUpdate={content.updateContent}
                  />
                </div>
                <div className="stat-item">
                  <EditableElement
                    tag="div"
                    className="stat-number"
                    contentKey="stat2Number"
                    content={content.content}
                    editMode={content.editMode}
                    onUpdate={content.updateContent}
                  />
                  <EditableElement
                    tag="div"
                    className="stat-label"
                    contentKey="stat2Label"
                    content={content.content}
                    editMode={content.editMode}
                    onUpdate={content.updateContent}
                  />
                </div>
                <div className="stat-item">
                  <EditableElement
                    tag="div"
                    className="stat-number"
                    contentKey="stat3Number"
                    content={content.content}
                    editMode={content.editMode}
                    onUpdate={content.updateContent}
                  />
                  <EditableElement
                    tag="div"
                    className="stat-label"
                    contentKey="stat3Label"
                    content={content.content}
                    editMode={content.editMode}
                    onUpdate={content.updateContent}
                  />
                </div>
              </div>
              <div className="hero-call-now">
                <EditableElement
                  tag="h4"
                  contentKey="ctaTitle"
                  content={content.content}
                  editMode={content.editMode}
                  onUpdate={content.updateContent}
                />
                <a href="tel:7809148384" className="btn btn-primary hero-cta-btn" aria-label="Call now for immediate water delivery service">
                  <span className="btn-text-mobile">
                    <EditableElement
                      tag="span"
                      contentKey="callButtonMobile"
                      content={content.content}
                      editMode={content.editMode}
                      onUpdate={content.updateContent}
                    />
                  </span>
                  <span className="btn-text-desktop">
                    <EditableElement
                      tag="span"
                      contentKey="callButtonDesktop"
                      content={content.content}
                      editMode={content.editMode}
                      onUpdate={content.updateContent}
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services" role="main">
        <div className="section-header">
          <EditableElement
            tag="h2"
            contentKey="servicesTitle"
            content={content.content}
            editMode={content.editMode}
            onUpdate={content.updateContent}
          />
          <EditableElement
            tag="p"
            contentKey="servicesDescription"
            content={content.content}
            editMode={content.editMode}
            onUpdate={content.updateContent}
          />
        </div>
        
        <div className="services-grid">
          <article className="service-card">
            <div className="service-icon" aria-hidden="true">
              <FaHome />
            </div>
            <EditableElement
              tag="h3"
              contentKey="service0Title"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
            <EditableElement
              tag="p"
              contentKey="service0Description"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
          </article>
          
          <article className="service-card">
            <div className="service-icon" aria-hidden="true">
              <FaSwimmer />
            </div>
            <EditableElement
              tag="h3"
              contentKey="service1Title"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
            <EditableElement
              tag="p"
              contentKey="service1Description"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
          </article>
          
          <article className="service-card">
            <div className="service-icon" aria-hidden="true">
              <FaHardHat />
            </div>
            <EditableElement
              tag="h3"
              contentKey="service2Title"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
            <EditableElement
              tag="p"
              contentKey="service2Description"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
          </article>
        </div>
      </section>

      {/* About Section */}
      <section className="section-alt" id="about" role="main">
        <div className="about-content">
          <div className="about-main-content">
            <div className="about-header">
              <EditableElement
                tag="h2"
                contentKey="aboutTitle"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
              <EditableElement
                tag="p"
                contentKey="aboutDescription"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
            </div>
            
            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">
                  <FaShieldAlt />
                </div>
                <div className="about-feature-text">
                  <h4>Quality Assurance</h4>
                  <p>Premium water tested for purity and safety</p>
                </div>
              </div>
              
              <div className="about-feature">
                <div className="about-feature-icon">
                  <FaTruck />
                </div>
                <div className="about-feature-text">
                  <h4>Reliable Delivery</h4>
                  <p>On-time delivery you can count on</p>
                </div>
              </div>
              
              <div className="about-feature">
                <div className="about-feature-icon">
                  <FaClock />
                </div>
                <div className="about-feature-text">
                  <h4>24/7 Service</h4>
                  <p>Available when you need us most</p>
                </div>
              </div>
            </div>

            <div className="service-areas-compact">
              <h3 className="service-areas-title">Service Areas</h3>
              <div className="service-areas">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="area-tag">{area}</div>
                ))}
              </div>
              
              <div className="about-cta">
                <a href="tel:7809148384" className="btn btn-primary" aria-label="Call now for water delivery">
                  <FaPhone />
                  <EditableElement
                    tag="span"
                    contentKey="primaryButtonText"
                    content={content.content}
                    editMode={content.editMode}
                    onUpdate={content.updateContent}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section" id="contact" role="contentinfo">
        <div className="contact-content">
          <div className="section-header">
            <EditableElement
              tag="h2"
              contentKey="contactTitle"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
            <EditableElement
              tag="p"
              contentKey="contactDescription"
              content={content.content}
              editMode={content.editMode}
              onUpdate={content.updateContent}
            />
          </div>
          
          <div className="contact-info">
            <div className="contact-item" itemScope itemType="https://schema.org/ContactPoint">
              <EditableElement
                tag="h4"
                contentKey="contact0Title"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
              <EditableElement
                tag="p"
                contentKey="contact0Content"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
            </div>
            
            <div className="contact-item" itemScope itemType="https://schema.org/ContactPoint">
              <EditableElement
                tag="h4"
                contentKey="contact1Title"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
              <EditableElement
                tag="p"
                contentKey="contact1Content"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
            </div>
            
            <div className="contact-item" itemScope itemType="https://schema.org/Place">
              <EditableElement
                tag="h4"
                contentKey="contact2Title"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
              <EditableElement
                tag="p"
                contentKey="contact2Content"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
            </div>
            
            <div className="contact-item" itemScope itemType="https://schema.org/ContactPoint">
              <EditableElement
                tag="h4"
                contentKey="contact3Title"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
              <EditableElement
                tag="p"
                contentKey="contact3Content"
                content={content.content}
                editMode={content.editMode}
                onUpdate={content.updateContent}
              />
            </div>
          </div>
          
          <div className="contact-cta">
            <a href="tel:7809148384" className="btn btn-primary" aria-label="Call now for immediate water delivery service">
              <span className="btn-text-mobile">
                <EditableElement
                  tag="span"
                  contentKey="callButtonMobile"
                  content={content.content}
                  editMode={content.editMode}
                  onUpdate={content.updateContent}
                />
              </span>
              <span className="btn-text-desktop">
                <EditableElement
                  tag="span"
                  contentKey="callButtonDesktop"
                  content={content.content}
                  editMode={content.editMode}
                  onUpdate={content.updateContent}
                />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <address itemScope itemType="https://schema.org/Organization">
          <p>
            &copy; 2024 <span itemProp="name">AquaFresh Potable Water</span>. Licensed and insured bulk water hauling and cistern filling services.{' '}
            <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              Serving <span itemProp="addressLocality">Parkland County</span>, <span itemProp="addressRegion">Alberta</span> and surrounding areas.
            </span>
            {' '}Professional water delivery, cistern filling, construction water supply, pool filling, and landscaping water services.
          </p>
        </address>
      </footer>
    </>
  );
}

export default LandingPage; 