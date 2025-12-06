// src/components/templates/TrifoldPrintLayout.tsx
'use client';

import React, { useState } from 'react';
import { ItineraryData } from '@/types/itinerary';
import { PrintControlBar } from '@/components/molecules/PrintControlBar';
import { PrintCoverPage } from '@/components/organisms/PrintCoverPage';
import { PrintSchedulePage } from '@/components/organisms/PrintSchedulePage';
import { PrintSummaryPage } from '@/components/organisms/PrintSummaryPage';
import { PrintHelpModal } from '@/components/organisms/PrintHelpModal';

interface TrifoldPrintLayoutProps {
  data: ItineraryData;
}

export const TrifoldPrintLayout: React.FC<TrifoldPrintLayoutProps> = ({ data }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    // PDF生成ライブラリを後で統合可能
    // 今はブラウザの印刷→PDFを使用する想定
    window.print();
  };

  // スケジュールを2つのグループに分割（中面1と中面2用）
  const firstDaySchedules = data.schedules.slice(0, 1);
  const remainingSchedules = data.schedules.slice(1);

  return (
    <>
      <PrintControlBar 
        onPrint={handlePrint}
        onHelp={() => setIsHelpModalOpen(true)}
        onDownloadPdf={handleDownloadPdf}
      />

      <div className="print-container">
        {/* 表面（Front side） */}
        <div className="print-page">
          <div className="trifold-grid">
            {/* 右側：外表紙 */}
            <div className="trifold-panel trifold-panel-right">
              <PrintCoverPage basicInfo={data.basicInfo} />
            </div>

            {/* 中央：中面1（1日目のスケジュール） */}
            <div className="trifold-panel trifold-panel-center">
              {firstDaySchedules.length > 0 && (
                <PrintSchedulePage schedule={firstDaySchedules[0]} />
              )}
            </div>

            {/* 左側：中面2（2日目以降のスケジュール） */}
            <div className="trifold-panel trifold-panel-left">
              {remainingSchedules.length > 0 && (
                <div className="space-y-4">
                  {remainingSchedules.map((schedule, index) => (
                    <div key={index} className={index > 0 ? 'mt-6' : ''}>
                      <PrintSchedulePage schedule={schedule} showMemo={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 裏面（Back side） */}
        <div className="print-page">
          <div className="trifold-grid">
            {/* 左側：中面3（メモ欄） */}
            <div className="trifold-panel trifold-panel-left">
              <div className="h-full p-6">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b-2 border-gray-300">
                  メモ
                </h2>
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-2" />
                  ))}
                </div>
              </div>
            </div>

            {/* 中央：中面4（予算サマリー） */}
            <div className="trifold-panel trifold-panel-center">
              <PrintSummaryPage data={data} />
            </div>

            {/* 右側：裏表紙 */}
            <div className="trifold-panel trifold-panel-right">
              <div className="flex items-center justify-center h-full p-6 bg-gray-50">
                <div className="text-center text-sm text-gray-600">
                  <p>素敵な旅を！</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PrintHelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <style jsx global>{`
        /* 画面表示用（プレビュー） */
        @media screen {
          .print-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .print-page {
            width: 100%;
            margin: 20px auto;
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .trifold-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: 100%;
            min-height: 400px;
            gap: 0;
          }

          .trifold-panel {
            min-height: 400px;
            overflow: hidden;
            border-right: 1px dashed #ccc;
          }

          .trifold-panel:last-child {
            border-right: none;
          }
        }

        /* 印刷用スタイル */
        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .print-container {
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .print-page {
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
            page-break-after: always;
            page-break-inside: avoid;
            break-after: page;
            break-inside: avoid;
            position: relative;
            overflow: hidden;
          }

          .print-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          .trifold-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
            gap: 0;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .trifold-panel {
            height: 210mm;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
            border-right: none;
          }

          .trifold-panel:last-child {
            border-right: none;
          }

          /* 画面表示用の要素を非表示 */
          .print\\:hidden {
            display: none !important;
          }
        }

        @page {
          size: A4 landscape;
          margin: 0;
        }
      `}</style>
    </>
  );
};