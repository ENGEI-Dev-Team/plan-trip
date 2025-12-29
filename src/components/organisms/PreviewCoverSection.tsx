'use client';

import React from 'react';
import { ItineraryBasicInfo } from '@/types/itinerary';

interface PreviewCoverSectionProps {
  basicInfo: ItineraryBasicInfo;
  imageUrl?: string;
  memberCount?: number;
}

export const PreviewCoverSection: React.FC<PreviewCoverSectionProps> = ({ 
  basicInfo,
  imageUrl = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  memberCount = 1
}) => {
  const formatDateRange = () => {
    const start = new Date(basicInfo.startDate);
    const end = new Date(basicInfo.endDate);
    return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')} - ${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="relative h-64 bg-gray-200">
      <img 
        src={imageUrl} 
        alt={basicInfo.title}
        className="w-full h-full object-cover"
        style={{ filter: 'saturate(1.05)' }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)'
        }}
      />
      <div className="absolute bottom-6 left-6 text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.35)' }}>
        <span className="inline-block px-2.5 py-1.5 rounded-full bg-white/20 border border-white/35 font-bold text-sm mb-1.5">
          {basicInfo.prefecture}
        </span>
        <h1 className="my-1.5 text-4xl font-bold tracking-wide">{basicInfo.title}</h1>
        <div className="text-sm">{formatDateRange()} / {memberCount}名</div>
      </div>
    </div>
  );
};
