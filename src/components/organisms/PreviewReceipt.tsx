"use client";

import React from "react";
import { ItineraryData } from "@/types/itinerary";

interface PreviewReceiptProps {
  itineraryData: ItineraryData;
  memberCount: number;
}

export const PreviewReceipt: React.FC<PreviewReceiptProps> = ({
  itineraryData,
  memberCount,
}) => {
  const totalAmount = itineraryData.schedules.reduce((sum, schedule) => {
    return (
      sum +
      schedule.items.reduce((itemSum, item) => {
        return itemSum + (item.amount || 0);
      }, 0)
    );
  }, 0);

  const days = itineraryData.schedules.length;
  const perPerson = memberCount > 0 ? Math.round(totalAmount / memberCount) : 0;

  return (
    <section className="receipt" aria-label="費用まとめ">
      <div className="zigzag top" aria-hidden="true"></div>
      <div className="zigzag bottom" aria-hidden="true"></div>
      <h3>Travel Expenses</h3>
      <p>旅の精算書</p>
      <div className="row">
        <span>メンバー数</span>
        <strong>{memberCount} 名</strong>
      </div>
      <div className="row">
        <span>日数</span>
        <strong>{days} 日間</strong>
      </div>
      <div className="row">
        <span>合計金額</span>
        <strong>¥{totalAmount.toLocaleString()}</strong>
      </div>
      <div className="total">
        <span className="per">¥{perPerson.toLocaleString()}</span>
        <span className="all">1人あたり</span>
      </div>
    </section>
  );
};
