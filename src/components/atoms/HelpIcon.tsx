
'use client';

import React from 'react';

interface HelpIconProps {
  onClick: () => void;
  className?: string;
}

export const HelpIcon: React.FC<HelpIconProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors ${className}`}
      aria-label="印刷ガイドを開く"
    >
      <span className="text-sm font-bold text-gray-700">?</span>
    </button>
  );
};