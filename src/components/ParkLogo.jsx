import React from 'react';

export const ParkLogo = ({ size = 32, rounded = true, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    <rect width="100" height="100" rx={rounded ? "16" : "0"} fill="#0A3963" />
    <rect x="25" y="25" width="45" height="45" rx={rounded ? "8" : "0"} fill="#FFFFFF" />
    <rect x="55" y="55" width="30" height="30" rx={rounded ? "6" : "0"} fill="#8CC63F" />
  </svg>
);

// ==========================================
// COMPONENTE DE ICONOS SVG VECTORIALES MONOCROMÁTICOS (REEMPLAZO ESTÉTICO DE EMOJIS)
// ==========================================;
