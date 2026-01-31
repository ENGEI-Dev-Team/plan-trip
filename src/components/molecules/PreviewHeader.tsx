'use client';

import React from 'react';
import { BackButton } from '../atoms/BackButton';
import { PrintButton } from '../atoms/PrintButton';

interface PreviewHeaderProps {
  onBack?: () => void;
  onPrint?: () => void;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({ 
  onBack,
  onPrint 
}) => {
  return (
    <div className="topbar">
      <BackButton onClick={onBack} />
      <PrintButton onClick={onPrint || (() => {})} />
    </div>
  );
};