import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from './hooks/useAuth';
import { useContent } from './hooks/useContent';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import EditableElement from './components/EditableElement';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const auth = useAuth();
  const content = useContent();
  
  const secretKey = 'cms-admin-2024'; // Change this to your secret key

  // Check for admin route access
  useEffect(() => {
    checkAdminRoute();
  }, [location]);

  const checkAdminRoute = () => {
    // Check multiple ways to access admin:
    // 1. URL hash: yoursite.com#cms-admin-2024
    // 2. URL parameter: yoursite.com?admin=cms-admin-2024
    
    const urlHash = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    if (urlHash === secretKey || adminParam === secretKey) {
      setIsAdminRoute(true);
      navigate('/admin', { replace: true });
      
      // Clean up URL to remove secret key (for security)
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (location.pathname === '/admin') {
      setIsAdminRoute(true);
    } else {
      setIsAdminRoute(false);
    }
  };

  const handleBackToSite = () => {
    setIsAdminRoute(false);
    navigate('/', { replace: true });
  };

  // Loading state
  if (auth.loading || content.loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Professional Bulk Water Hauling Services | AquaFresh Potable Water</title>
        <meta name="description" content="Reliable bulk water hauling and cistern filling services for residential, commercial, and construction needs. Serving Parkland County, Stony Plain, Spruce Grove, West Edmonton and surrounding areas." />
        <meta name="keywords" content="bulk water hauling, cistern filling, potable water delivery, construction water supply, residential water delivery, commercial water hauling, Parkland County, Stony Plain, Spruce Grove, West Edmonton" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AquaFresh Potable Water" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aquafreshpotablewater.com/" />
        <meta property="og:title" content="Professional Bulk Water Hauling Services | AquaFresh Potable Water" />
        <meta property="og:description" content="Reliable bulk water hauling and cistern filling services for residential, commercial, and construction needs. Serving Parkland County and surrounding areas." />
        <meta property="og:image" content="https://www.aquafreshpotablewater.com/images/water-truck-og.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Bulk Water Hauling Services | AquaFresh Potable Water" />
        <meta name="twitter:description" content="Reliable bulk water hauling and cistern filling services for residential, commercial, and construction needs." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.aquafreshpotablewater.com/" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "AquaFresh Potable Water",
            "description": "Professional bulk water hauling and cistern filling services for residential, commercial, and construction needs.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Parkland County",
              "addressRegion": "Alberta",
              "addressCountry": "CA"
            },
            "url": "https://www.aquafreshpotablewater.com",
            "telephone": "+1-780-914-8384",
            "email": "info@aquafreshpotablewater.com",
            "openingHoursSpecification": [{
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "07:00",
              "closes": "19:00"
            }],
            "serviceArea": ["Parkland County", "Stony Plain", "Spruce Grove", "West Edmonton", "Leduc County", "Sturgeon County", "Lac Ste Anne County", "Westlock County"],
            "priceRange": "$",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Water Hauling Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Residential and Commercial Cisterns",
                    "description": "Dependable potable water delivery for residential and commercial cisterns, filling from the nearest city and town water stations."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Pools, Hot tubs, and Skating rinks",
                    "description": "Quick delivery service for pools, hot tubs, and skating rinks so you can start your summer and winter fun without the wait."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Landscaping and Construction",
                    "description": "Reliable and timely bulk water delivery for landscaping and construction purposes."
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="bg-animation"></div>
      
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              content={content} 
              auth={auth}
              isAdminRoute={isAdminRoute}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminPanel 
              content={content} 
              auth={auth}
              onBackToSite={handleBackToSite}
            />
          } 
        />
      </Routes>
    </>
  );
}

export default App; 