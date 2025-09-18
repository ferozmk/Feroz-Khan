import React from 'react';

export const CommunityIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 019 12.125v-2.25c0-.414.336-.75.75-.75h3.75c.414 0 .75.336.75.75v2.25c0 1.256-.44 2.41-1.232 3.321M12 12a3.375 3.375 0 01-3.375 3.375M12 12a3.375 3.375 0 013.375 3.375m-3.375-3.375a3.375 3.375 0 01-3.375-3.375M12 12a3.375 3.375 0 013.375-3.375M3.375 19.5a3.375 3.375 0 016.75 0" />
  </svg>
);
