import React from 'react';

function EditModeIndicator({ onExit, onAdmin }) {
  return (
    <div className="edit-mode-indicator">
      <div className="edit-mode-indicator-content">
        <span className="edit-mode-text">EDIT MODE ACTIVE</span>
        <button 
          onClick={onToggleEditMode}
          className="edit-mode-btn"
        >
          Exit
        </button>
        <button 
          onClick={onReturnToAdmin}
          className="edit-mode-btn"
        >
          Admin
        </button>
      </div>
    </div>
  );
}

export default EditModeIndicator; 