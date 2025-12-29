'use client';

import React from 'react';
import { ItineraryData } from '@/types/itinerary';
import { PreviewCoverSection } from '../organisms/PreviewCoverSection';
import { PreviewDaySection } from '../organisms/PreviewDaySection';
import { PreviewReceipt } from '../organisms/PreviewReceipt';
import { PrintButton } from '../atoms/PrintButton';
import { BackButton } from '../atoms/BackButton';

interface ItineraryPreviewLayoutProps {
  itineraryData: ItineraryData;
  memberCount?: number;
  coverImageUrl?: string;
  itemImages?: Record<string, string>; // itemId -> imageUrl のマップ
  showAmount?: boolean;
  onBack?: () => void;
}

export const ItineraryPreviewLayout: React.FC<ItineraryPreviewLayoutProps> = ({ 
  itineraryData,
  memberCount = 1,
  coverImageUrl,
  itemImages = {},
  showAmount = true,
  onBack
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-amber-50/30">
      {/* トップバー */}
      <div className="sticky top-0 z-10 flex justify-between items-center px-4 py-3 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <BackButton onClick={onBack} />
        <PrintButton onClick={handlePrint} />
      </div>
      
      {/* メインコンテンツ */}
      <article className="max-w-4xl mx-auto mb-16 bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* カバーセクション */}
        <PreviewCoverSection 
          basicInfo={itineraryData.basicInfo}
          imageUrl={coverImageUrl}
          memberCount={memberCount}
        />
        
        {/* コンテンツエリア */}
        <div className="px-6 py-7">
          {/* セクションタイトル */}
          <div className="text-center text-gray-400 tracking-widest text-xs uppercase border-b border-gray-200 pb-3 mb-7 mx-auto w-64">
            Travel Journal
          </div>
          
          {/* 日程セクション */}
          {itineraryData.schedules.map((schedule, index) => (
            <PreviewDaySection 
              key={schedule.date}
              schedule={schedule}
              dayNumber={index + 1}
              itemImages={itemImages}
              showAmount={showAmount}
            />
          ))}
          
          {/* レシート（費用まとめ） */}
          <PreviewReceipt 
            itineraryData={itineraryData}
            memberCount={memberCount}
          />
        </div>
      </article>
      
      {/* フッター */}
      <footer className="text-center text-gray-400 my-6 text-sm">
        Created with TRIP-PLAN
      </footer>
    </div>
  );
};
