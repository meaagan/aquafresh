import React from 'react';
import logoImg from '../images/Remove background project.png';

function AquaFreshLogo({ className, onClick }) {
  return (
    <div className={`aquafresh-logo ${className || ''}`} onClick={onClick}>
      <img 
        src={logoImg} 
        alt="AquaFresh Potable Water Logo" 
        className="logo-img"
      />
    </div>
  );
}

export default AquaFreshLogo; 