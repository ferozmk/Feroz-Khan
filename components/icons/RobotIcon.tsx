import React from 'react';

export const RobotIcon: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    className={className}
    aria-label="FerozAI Robot Mascot"
  >
    <defs>
      <linearGradient id="robot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "rgb(129, 140, 248)", stopOpacity: 1 }} /> 
        <stop offset="100%" style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 1 }} />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    <g transform="translate(100, 100)">
      {/* Body */}
      <path 
        d="M -50 -30 a 10 10 0 0 1 10 -10 h 80 a 10 10 0 0 1 10 10 v 60 a 10 10 0 0 1 -10 10 h -80 a 10 10 0 0 1 -10 -10 z" 
        fill="url(#robot-gradient)" 
        stroke="rgba(255,255,255,0.3)" 
        strokeWidth="2"
      />

      {/* Head */}
      <circle cx="0" cy="-65" r="35" fill="url(#robot-gradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      
      {/* Eye */}
      <circle cx="0" cy="-65" r="15" fill="#f1f5f9" />
      <circle cx="0" cy="-65" r="8" fill="#4338ca" filter="url(#glow)" />
      <circle cx="2" cy="-68" r="3" fill="white" opacity="0.8"/>
      
      {/* Antenna */}
      <line x1="0" y1="-100" x2="0" y2="-115" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-120" r="5" fill="#a5b4fc" filter="url(#glow)" />

      {/* Neck */}
      <rect x="-10" y="-30" width="20" height="10" fill="#64748b" />
      
      {/* Arms */}
      <rect x="-70" y="-10" width="20" height="50" rx="10" fill="#94a3b8" />
      <rect x="50" y="-10" width="20" height="50" rx="10" fill="#94a3b8" />

      {/* Legs */}
      <rect x="-35" y="40" width="25" height="40" rx="12.5" fill="#94a3b8" />
      <rect x="10" y="40" width="25" height="40" rx="12.5" fill="#94a3b8" />
    </g>
  </svg>
);
