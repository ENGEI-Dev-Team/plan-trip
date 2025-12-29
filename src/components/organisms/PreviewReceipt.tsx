'use client';

import React from 'react';
import { ItineraryData } from '@/types/itinerary';

interface PreviewReceiptProps {
  itineraryData: ItineraryData;
  memberCount: number;
}

export const PreviewReceipt: React.FC<PreviewReceiptProps> = ({ 
  itineraryData,
  memberCount 
}) => {
  // 合計金額を計算
  const totalAmount = itineraryData.schedules.reduce((sum, schedule) => {
    return sum + schedule.items.reduce((itemSum, item) => {
      return itemSum + (item.amount || 0);
    }, 0);
  }, 0);

  // 日数を計算
  const days = itineraryData.schedules.length;

  // 1人あたりの金額を計算
  const perPerson = memberCount > 0 ? Math.round(totalAmount / memberCount) : 0;

  return (
    <section className="mt-12 mx-auto max-w-md bg-white border border-gray-200 rounded-xl p-4 shadow-lg relative overflow-hidden">
      {/* ジグザグ装飾（上） */}
      <div 
        className="absolute left-0 right-0 top-0 h-1.5 opacity-50"
        style={{
          background: 'linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
          backgroundSize: '14px 14px'
        }}
      />
      
      {/* ジグザグ装飾（下） */}
      <div 
        className="absolute left-0 right-0 bottom-0 h-1.5 opacity-50 rotate-180"
        style={{
          background: 'linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
          backgroundSize: '14px 14px'
        }}
      />
      
      <h3 className="mt-2.5 mb-1.5 text-center font-semibold">Travel Expenses</h3>
      <p className="text-center text-gray-400 text-xs mb-2">旅の精算書</p>
      
      {/* 詳細行 */}
      <div className="flex justify-between my-2.5 text-gray-600 text-sm">
        <span>メンバー数</span>
        <strong className="text-gray-900">{memberCount} 名</strong>
      </div>
      
      <div className="flex justify-between my-2.5 text-gray-600 text-sm">
        <span>日数</span>
        <strong className="text-gray-900">{days} 日間</strong>
      </div>
      
      <div className="flex justify-between my-2.5 text-gray-600 text-sm">
        <span>合計金額</span>
        <strong className="text-gray-900">¥{totalAmount.toLocaleString()}</strong>
      </div>
      
      {/* 1人あたり金額 */}
      <div className="text-right mt-3">
        <div className="text-2xl font-extrabold text-sky-500">¥{perPerson.toLocaleString()}</div>
        <div className="text-lg font-bold">1人あたり</div>
      </div>
    </section>
  );
};