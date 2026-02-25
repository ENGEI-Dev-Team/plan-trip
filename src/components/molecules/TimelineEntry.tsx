"use client";

import React from "react";
import { ItineraryItem } from "@/types/itinerary";

interface TimelineEntryProps {
  item: ItineraryItem;
  imageUrl?: string;
  showAmount?: boolean;
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({
  item,
  imageUrl,
  showAmount = true,
}) => {
  return (
    <div className="entry">
      <div className="entry-card">
        <div className="entry-time">⏰ {item.time}</div>
        <h3>{item.title}</h3>
        {item.memo && <p>{item.memo}</p>}
        {imageUrl && <img src={imageUrl} alt={item.title} />}
        {showAmount && item.amount && (
          <div className="cost">予算: ¥{item.amount.toLocaleString()}</div>
        )}
      </div>
    </div>
  );
};
