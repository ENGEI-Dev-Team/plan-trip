'use client';

import React from 'react';

interface DayBadgeProps {
  day: number;
}

export const DayBadge: React.FC<DayBadgeProps> = ({ day }) => {
  return (
    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 grid place-items-center bg-gray-100 font-bold text-gray-800">
      Day {day}
    </div>
  );
};