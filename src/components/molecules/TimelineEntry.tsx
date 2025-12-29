'use client';

import React from 'react';
import { ItineraryItem } from '@/types/itinerary';
import { CategoryBadge } from '../atoms/CategoryBadge';

interface TimelineEntryProps {
  item: ItineraryItem;
  imageUrl?: string;
  showAmount?: boolean;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ 
  item, 
  imageUrl,
  showAmount = true 
}) => {
  return (
    <div className="relative mb-5 pl-4">
      {/* タイムラインのドット */}
      <div className="absolute -left-8 top-2.5 w-3.5 h-3.5 bg-white border-4 border-gray-300 rounded-full" />
      
      {/* エントリーカード */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 shadow-sm">
        {/* 時刻表示 */}
        <div className="inline-flex items-center gap-1.5 font-bold text-sky-500 text-sm mb-1">
          <span>⏰</span>
          <span>{item.time}</span>
        </div>
        
        {/* タイトルとカテゴリ */}
        <div className="flex items-center gap-2 mb-1.5">
          <CategoryBadge category={item.category} />
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
        </div>
        
        {/* メモ */}
        {item.memo && (
          <p className="text-sm text-gray-600 leading-relaxed mb-2">{item.memo}</p>
        )}
        
        {/* 画像 */}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={item.title}
            className="mt-2.5 rounded-lg max-h-56 w-full object-cover"
          />
        )}
        
        {/* 費用 */}
        {showAmount && item.amount && (
          <div className="mt-2 pt-2 border-t border-dashed border-gray-300 text-right text-gray-600 text-sm">
            予算: ¥{item.amount.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};