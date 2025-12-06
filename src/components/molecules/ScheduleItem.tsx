
import React from 'react';
import { ItineraryItem } from '@/types/itinerary';
import { CategoryBadge } from '../atoms/CategoryBadge';

interface ScheduleItemProps {
  item: ItineraryItem;
  showAmount?: boolean;
  showMemo?: boolean;
}

export const ScheduleItem: React.FC<ScheduleItemProps> = ({ 
  item, 
  showAmount = true, 
  showMemo = true 
}) => {
  return (
    <div className="flex gap-2 mb-2 text-sm">
      <div className="w-12 flex-shrink-0 font-medium">{item.time}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <CategoryBadge category={item.category} />
          <span className="font-medium">{item.title}</span>
          {showAmount && item.amount && (
            <span className="text-gray-600 text-xs ml-auto">¥{item.amount.toLocaleString()}</span>
          )}
        </div>
        {showMemo && item.memo && (
          <p className="text-xs text-gray-600 ml-0">{item.memo}</p>
        )}
      </div>
    </div>
  );
};