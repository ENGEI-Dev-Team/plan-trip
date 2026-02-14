import React from "react";
import { ItineraryData } from "@/types/itinerary";
import { PrintHeader } from "../molecules/PrintHeader";

interface PrintSummaryPageProps {
  data: ItineraryData;
}

export const PrintSummaryPage: React.FC<PrintSummaryPageProps> = ({ data }) => {
  const totalAmount = data.schedules
    .flatMap((schedule) => schedule.items)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const categoryTotals = data.schedules
    .flatMap((schedule) => schedule.items)
    .reduce(
      (acc, item) => {
        if (item.amount) {
          acc[item.category] = (acc[item.category] || 0) + item.amount;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

  return (
    <div className="h-full p-6">
      <PrintHeader title="予算サマリー" />
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">合計金額</div>
          <div className="text-2xl font-bold text-blue-800">
            ¥{totalAmount.toLocaleString()}
          </div>
        </div>
        <div className="space-y-2">
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div key={category} className="flex justify-between text-sm">
              <span className="text-gray-700">{category}</span>
              <span className="font-medium">¥{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
