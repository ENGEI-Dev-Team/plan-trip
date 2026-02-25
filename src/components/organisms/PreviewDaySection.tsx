"use client";

import React from "react";
import { DailySchedule } from "@/types/itinerary";
import { DayBadge } from "../atoms/DayBadge";
import { TimelineEntry } from "../molecules/TimelineEntry";

interface PreviewDaySectionProps {
  schedule: DailySchedule;
  dayNumber: number;
  subtitle?: string;
  itemImages?: Record<string, string>;
  showAmount?: boolean;
}

export const PreviewDaySection: React.FC<PreviewDaySectionProps> = ({
  schedule,
  dayNumber,
  subtitle = "",
  itemImages = {},
  showAmount = true,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <section className="day">
      <div className="day-head">
        <DayBadge day={dayNumber} />
        <div>
          <h2>{formatDate(schedule.date)}</h2>
          {subtitle && (
            <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div className="timeline">
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
