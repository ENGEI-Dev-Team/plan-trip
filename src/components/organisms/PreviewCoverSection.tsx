"use client";

import React from "react";
import { ItineraryBasicInfo } from "@/types/itinerary";

interface PreviewCoverSectionProps {
  basicInfo: ItineraryBasicInfo;
  imageUrl?: string;
  memberCount?: number;
}

export const PreviewCoverSection: React.FC<PreviewCoverSectionProps> = ({
  basicInfo,
  imageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  memberCount = 1,
}) => {
  const formatDateRange = () => {
    const start = new Date(basicInfo.startDate);
    const end = new Date(basicInfo.endDate);
    return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")} - ${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="cover">
      <img src={imageUrl} alt={basicInfo.title} />
      <div className="cover-text">
        <span className="chip">{basicInfo.prefecture}</span>
        <h1>{basicInfo.title}</h1>
        <div>
          {formatDateRange()} / {memberCount}名
        </div>
      </div>
    </div>
  );
};
