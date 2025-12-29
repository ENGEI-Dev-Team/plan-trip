'use client';

import React from 'react';
import { DailySchedule } from '@/types/itinerary';
import { DayBadge } from '../atoms/DayBadge';
import { TimelineEntry } from '../molecules/TimelineEntry';

interface PreviewDaySectionProps {
  schedule: DailySchedule;
  dayNumber: number;
  subtitle?: string;
  itemImages?: Record<string, string>; // itemId -> imageUrl のマップ
  showAmount?: boolean;
}

export const PreviewDaySection: React.FC<PreviewDaySectionProps> = ({ 
  schedule,
  dayNumber,
  subtitle = '',
  itemImages = {},
  showAmount = true
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <section className="mb-12">
      {/* 日付ヘッダー */}
      <div className="flex items-center gap-3.5 mb-4">
        <DayBadge day={dayNumber} />
        <div>
          <h2 className="text-xl font-semibold mb-0 border-b-2 border-sky-500/30 inline-block pb-1">
            {formatDate(schedule.date)}
          </h2>
          {subtitle && (
            <div className="text-gray-400 text-sm mt-1">{subtitle}</div>
          )}
        </div>
      </div>
      
      {/* タイムライン */}
      <div className="relative pl-8 border-l-2 border-dotted border-gray-300 ml-3.5">
        {schedule.items.map((item) => (
          <TimelineEntry 
            key={item.id}
            item={item}
            imageUrl={itemImages[item.id]}
            showAmount={showAmount}
          />
        ))}
      </div>
    </section>
  );
};
