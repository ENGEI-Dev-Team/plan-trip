
'use client';

import { useCallback } from 'react';

export const usePrint = () => {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadPdf = useCallback(() => {
    // 現在はブラウザの印刷→PDF保存機能を使用
    // 将来的にはjsPDFやpdf-libなどのライブラリで実装可能
    window.print();
  }, []);

  return {
    handlePrint,
    handleDownloadPdf,
  };
};

// 将来的なPDF生成の実装例（オプショナル）
// 以下をコメント解除して使用する場合は、必要なパッケージをインストールしてください
// npm install jspdf html2canvas
/*
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePrint = () => {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadPdf = useCallback(async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  }, []);

  return {
    handlePrint,
    handleDownloadPdf,
  };
};
*/