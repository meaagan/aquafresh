import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSwimmer, FaHardHat, FaPhone, FaClock, FaShieldAlt, FaTruck, FaTint, FaWater } from 'react-icons/fa';
import EditableElement from './EditableElement';
import EditModeIndicator from './EditModeIndicator';

function LandingPage({ content, auth, isAdminRoute }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll effect for navigation
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    return () => observer.disconnect();
  }, []);

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
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
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
          <div className="logo-container" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="logo-icon">
              <FaWater className="logo-water-icon" />
            </div>
            <div className="logo-text">
              <span className="logo-main">AquaFresh</span>
              <span className="logo-sub">Potable Water</span>
            </div>
          </div>
          <ul className="nav-links">
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
            
            <div className="hero-features">
              <div className="feature-item">
                <FaClock className="feature-icon" />
                <div>
                  <h4>24/7 Service</h4>
                  <p>Available when you need us</p>
                </div>
              </div>
              <div className="feature-item">
                <FaTruck className="feature-icon" />
                <div>
                  <h4>Fast Delivery</h4>
                  <p>Quick and reliable service</p>
                </div>
              </div>
            </div>
            
            <div className="hero-cta">
              <div className="phone-section">
                <FaPhone className="phone-icon" />
                <div>
                  <span className="phone-label">Call Now</span>
                  <a href="tel:7809148384" className="phone-number">780-914-8384</a>
                </div>
              </div>
              <div className="cta-buttons">
                <a href="tel:7809148384" className="btn btn-primary" aria-label="Call now for water delivery">
                  Get Quote Now
                </a>
                <a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="btn btn-secondary" aria-label="Learn about our water hauling services">
                  Our Services
                </a>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="visual-card">
              <div className="service-stats">
                <div className="stat-item">
                  <div className="stat-number">1998</div>
                  <div className="stat-label">Year Established</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Counties Served</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">Family</div>
                  <div className="stat-label">Owned & Operated</div>
                </div>
              </div>
              <div className="service-areas-preview">
                <h4>Service Areas</h4>
                <div className="area-tags">
                  <span className="area-tag">Parkland County</span>
                  <span className="area-tag">Stony Plain</span>
                  <span className="area-tag">Spruce Grove</span>
                  <span className="area-tag">West Edmonton</span>
                  <span className="area-tag">Leduc County</span>
                  <span className="area-tag">+ 3 more</span>
                </div>
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
          <div className="section-header">
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
          
          <h3 className="service-areas-title">Service Areas</h3>
          <div className="service-areas">
            {serviceAreas.map((area, index) => (
              <div key={index} className="area-tag">{area}</div>
            ))}
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
              Call Now: 780-914-8384
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