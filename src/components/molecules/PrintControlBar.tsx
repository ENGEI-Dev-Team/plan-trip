
'use client';

import React from 'react';
import { PrintButton } from '../atoms/PrintButton';
import { HelpIcon } from '../atoms/HelpIcon';

interface PrintControlBarProps {
  onPrint: () => void;
  onHelp: () => void;
  onDownloadPdf: () => void;
}

export const PrintControlBar: React.FC<PrintControlBarProps> = ({ 
  onPrint, 
  onHelp,
  onDownloadPdf 
}) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border-b print:hidden">
      <PrintButton onClick={onPrint} />
      <button
        onClick={onDownloadPdf}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        PDFダウンロード
      </button>
      <HelpIcon onClick={onHelp} className="ml-auto" />
    </div>
  );
};