import React from "react";
import { DailySchedule } from "@/types/itinerary";
import { PrintHeader } from "../molecules/PrintHeader";
import { ScheduleItem } from "../molecules/ScheduleItem";

interface PrintSchedulePageProps {
  schedule: DailySchedule;
  showAmount?: boolean;
  showMemo?: boolean;
}

export const PrintSchedulePage: React.FC<PrintSchedulePageProps> = ({
  schedule,
  showAmount = true,
  showMemo = true,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getMonth() + 1}月${date.getDate()}日(${days[date.getDay()]})`;
  };

  return (
    <div className="h-full p-6">
      <PrintHeader title={formatDate(schedule.date)} />
      <div className="space-y-1">
        {schedule.items.map((item) => (
          <ScheduleItem
            key={item.id}
            item={item}
            showAmount={showAmount}
            showMemo={showMemo}
          />
        ))}
      </div>
    </div>
  );
};
