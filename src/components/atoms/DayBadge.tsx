'use client';

import React from 'react';

interface DayBadgeProps {
  day: number;
}

export const DayBadge: React.FC<DayBadgeProps> = ({ day }) => {
  return (
    <div className="badge">
      Day {day}
    </div>
  );
};