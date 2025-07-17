import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from './LoadingSpinner';

function AdminPanel({ content, auth, onBackToSite }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    await auth.login(email, password);
    setIsLoading(false);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    await auth.createAccount(email, password);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await auth.logout();
    setEmail('');
    setPassword('');
  };

  const handleToggleEditMode = () => {
    // If currently NOT in edit mode, enable it and go to site for editing
    if (!content.editMode) {
      content.toggleEditMode();
      onBackToSite(); // Go to site to edit content
    } else {
      // If currently in edit mode, disable it and stay in admin
      content.toggleEditMode();
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      content.importContent(file);
    }
  };

  const handleExport = () => {
    content.exportContent();
  };

  const handleSave = () => {
    content.saveContent();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  if (auth.loading || content.loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel - AquaFresh CMS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-header">
            <h1>AquaFresh Admin Panel</h1>
            <p>Firebase-powered Content Management System</p>
          </div>

          {/* Login Section */}
          {!auth.isAuthenticated && (
            <div className="admin-controls">
              <h3>Admin Authentication</h3>
              <div className="firebase-info">
                <p><strong>Firebase Security:</strong> Secure authentication and real-time database</p>
              </div>
              <form onSubmit={handleLogin} className="admin-form">
                <div className="admin-form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter admin email"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="control-buttons">
                  <button 
                    type="submit" 
                    className="admin-btn primary"
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <button 
                    type="button" 
                    className="admin-btn secondary"
                    onClick={handleCreateAccount}
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? 'Creating...' : 'Create Account'}
                  </button>
                  <button 
                    type="button" 
                    className="admin-btn tertiary"
                    onClick={onBackToSite}
                  >
                    ← Back to Site
                  </button>
                </div>
              </form>
              {auth.error && (
                <div className="status-info" style={{ background: '#fee2e2', borderColor: '#fecaca', marginTop: '1rem' }}>
                  <p style={{ color: '#dc2626' }}>Error: {auth.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Admin Dashboard */}
          {auth.isAuthenticated && (
            <>
              <div className="admin-controls">
                <h3>Content Management</h3>
                <div className="firebase-info">
                  <p><strong>Firebase Connected:</strong> All changes sync to Firestore database in real-time</p>
                </div>
                <div className="control-buttons">
                  <button 
                    className={`admin-btn ${content.editMode ? 'secondary' : 'primary'}`}
                    onClick={handleToggleEditMode}
                  >
                    {content.editMode ? 'Exit Edit Mode' : 'Enable Edit Mode'}
                  </button>
                  <button 
                    className="admin-btn secondary"
                    onClick={handleSave}
                    disabled={!content.hasUnsavedChanges}
                  >
                    Save All Changes
                  </button>
                  <button 
                    className="admin-btn tertiary"
                    onClick={handleExport}
                  >
                    Export Data
                  </button>
                  <button 
                    className="admin-btn tertiary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Import Data
                  </button>
                  <button 
                    className="admin-btn secondary"
                    onClick={onBackToSite}
                  >
                    View Site
                  </button>
                  <button 
                    className="admin-btn danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportFile}
                  style={{ display: 'none' }}
                />
                
                <div className="status-info">
                  <p>
                    {content.editMode 
                      ? 'Edit mode enabled! Switch to site view and click on any text to edit it.'
                      : 'Ready to edit content. Enable edit mode to start making changes.'
                    }
                    {content.hasUnsavedChanges && ' (You have unsaved changes)'}
                  </p>
                </div>
              </div>

              <div className="admin-controls">
                <h3>User Information</h3>
                <div className="status-info">
                  <p>Logged in as: <strong>{auth.user?.email}</strong></p>
                  <p>Session started: <strong>{new Date().toLocaleTimeString()}</strong></p>
                                      <p>Content items: <strong>{Object.keys(content.content).length}</strong></p>
                </div>
              </div>

              <div className="admin-controls">
                <h3>Content Preview</h3>
                <div className="status-info">
                  <p>📝 Current content keys:</p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '0.5rem', 
                    marginTop: '1rem' 
                  }}>
                    {Object.keys(content.content).map(key => (
                      <div key={key} style={{ 
                        background: '#f8fafc', 
                        padding: '0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        color: '#374151'
                      }}>
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-controls">
                <h3>Advanced Options</h3>
                <div className="control-buttons">
                  <button 
                    className="admin-btn danger"
                    onClick={content.resetToDefaults}
                  >
                    🔄 Reset to Defaults
                  </button>
                  <button 
                    className="admin-btn secondary"
                    onClick={content.loadContent}
                  >
                    🔃 Reload Content
                  </button>
                </div>
                <div className="status-info">
                  <p><strong>Warning:</strong> Reset to defaults will permanently erase all customizations</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminPanel; 