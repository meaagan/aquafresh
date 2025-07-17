import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

// Default content structure
const defaultContent = {
  logo: 'AquaFresh',
  heroTitle: 'Professional Bulk Water Delivery',
  heroDescription: 'Reliable, clean, and efficient water delivery services for cisterns, pools, construction, and landscaping needs. Licensed and insured water transport company serving Parkland County, Stony Plain, Spruce Grove, West Edmonton and surrounding areas.',
  servicesTitle: 'OUR SERVICES',
  servicesDescription: 'Comprehensive bulk water delivery solutions tailored to meet your specific needs with guaranteed quality, reliability, and competitive pricing throughout Alberta.',
  service0Title: 'Residential and Commercial Cisterns',
  service0Description: 'For residential and commercial cisterns, we provide dependable potable water delivery. Filling from the nearest city and town water stations.',
  service1Title: 'Pools, Hot tubs, and Skating rinks',
  service1Description: 'We provide quick delivery so you don\'t have to waste any time and can start your summer and winter fun off without the wait.',
  service2Title: 'Landscaping and Construction',
  service2Description: 'Whether it\'s for landscaping or construction purposes, count on us for reliable and timely bulk water delivery.',
  aboutTitle: 'ABOUT US',
  aboutDescription: 'Aqua Fresh Potable Water is dedicated to providing exceptional bulk water delivery services to fill your cisterns and other needs. Our team is committed to ensuring that your water hauling needs are met with the highest quality and reliability. We take pride in being a trusted source for potable water hauling.',
  contactTitle: 'Get Your Water Delivered Today',
  contactDescription: 'Contact AquaFresh for immediate bulk water hauling service or to discuss your water delivery needs. We provide free quotes, flexible scheduling, and serve the entire region.',
  contact0Title: 'Phone Service',
  contact0Content: 'Call or Text<br><strong><a href="tel:7809148384">780-914-8384</a></strong>',
  contact1Title: 'Email Quote',
  contact1Content: 'Get a quote online<br><strong><a href="mailto:info@aquafreshpotablewater.com">info@aquafreshpotablewater.com</a></strong>',
  contact2Title: 'Service Area',
  contact2Content: 'Alberta coverage<br><strong>Multiple Counties</strong>',
  contact3Title: 'Join Our Team',
  contact3Content: 'We\'re always looking for experienced drivers to join our team<br><strong><a href="tel:7809148384">Call or text Dez at 780-914-8384</a></strong>'
};

export function useContent() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load content from Firebase
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      console.log('🔄 Starting Firebase content load...');
      setLoading(true);
      setError(null);
      
      const docRef = doc(db, 'cms', 'content');
      console.log('📄 Document reference created:', docRef.path);
      
      const docSnap = await getDoc(docRef);
      console.log('📥 Document snapshot received:', { exists: docSnap.exists() });
      
      if (docSnap.exists()) {
        const firebaseContent = docSnap.data();
        console.log('✅ Firebase content loaded:', Object.keys(firebaseContent));
        setContent({ ...defaultContent, ...firebaseContent });
        // Content loads silently for regular users
      } else {
        console.log('⚠️ No content document found in Firebase, using defaults');
        console.log('🔧 Creating initial document with default content...');
        setContent(defaultContent);
        // Try to create the document with default content
        await setDoc(docRef, defaultContent);
        console.log('✅ Default content saved to Firebase');
        // Default content creation is silent for users
      }
    } catch (error) {
      console.error('❌ Error loading content from Firebase:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
      // Firebase errors are logged but not shown to regular users
      // Admin panel will show errors if needed
      // Fallback to default content
      setContent(defaultContent);
    } finally {
      setLoading(false);
      console.log('🏁 Firebase content load completed');
    }
  };

  const saveContent = async () => {
    try {
      setError(null);
      
      const docRef = doc(db, 'cms', 'content');
      await setDoc(docRef, content, { merge: true });
      
      setHasUnsavedChanges(false);
      toast.success('Content saved to Firebase! ✅');
      console.log('Content saved to Firebase');
      return true;
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setError(error.message);
      toast.error('Error saving to Firebase! ❌');
      return false;
    }
  };

  const updateContent = (key, value) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
    
    // Auto-save after 2 seconds of inactivity
    clearTimeout(window.contentSaveTimeout);
    window.contentSaveTimeout = setTimeout(() => {
      saveContent();
    }, 2000);
  };

  const toggleEditMode = () => {
    if (editMode && hasUnsavedChanges) {
      saveContent();
    }
    setEditMode(!editMode);
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aquafresh_content_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
          toast.success('Content exported successfully');
  };

  const importContent = async (file) => {
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      
      setContent({ ...defaultContent, ...imported });
      setHasUnsavedChanges(true);
      
      const success = await saveContent();
      if (success) {
        toast.success('Content imported successfully! ✅');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error importing file! ❌');
    }
  };

  const resetToDefaults = async () => {
    if (window.confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      setContent(defaultContent);
      setHasUnsavedChanges(true);
      await saveContent();
      toast.success('Content reset to defaults! 🔄');
    }
  };

  return {
    content,
    loading,
    error,
    editMode,
    hasUnsavedChanges,
    updateContent,
    saveContent,
    loadContent,
    toggleEditMode,
    exportContent,
    importContent,
    resetToDefaults
  };
} 