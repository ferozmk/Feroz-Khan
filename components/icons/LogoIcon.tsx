import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 160 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="FerozAI Logo"
  >
    <defs>
      <linearGradient id="fa-grad-logo" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#4338CA" />
      </linearGradient>
    </defs>
    <path
      fillRule="evenodd"
      d="M10 100V0H78.4V19.2H29.2V40.4H72.6V59.6H29.2V100H10Z M120 0L90 100H150L120 0Z M110 100L120 80L130 100Z"
      fill="url(#fa-grad-logo)"
    />
  </svg>
);
