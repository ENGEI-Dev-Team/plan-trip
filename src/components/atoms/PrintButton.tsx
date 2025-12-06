'use client';

import React from 'react';

interface PrintButtonProps {
  onClick: () => void;
  className?: string;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
    >
      印刷する
    </button>
  );
};