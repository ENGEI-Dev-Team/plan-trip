

import React from 'react';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full font-bold border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors ${className}`}
      aria-label="編集に戻る"
    >
      ← 編集に戻る
    </button>
  );
};