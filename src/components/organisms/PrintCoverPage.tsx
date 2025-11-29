
import React from 'react';
import { ItineraryBasicInfo } from '@/types/itinerary';

interface PrintCoverPageProps {
  basicInfo: ItineraryBasicInfo;
}

export const PrintCoverPage: React.FC<PrintCoverPageProps> = ({ basicInfo }) => {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()}日 - ${endDate.getMonth() + 1}月${endDate.getDate()}日`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {basicInfo.title}
      </h1>
      <div className="text-center space-y-2">
        <p className="text-lg text-gray-700">{basicInfo.prefecture}</p>
        <p className="text-sm text-gray-600">
          {formatDateRange(basicInfo.startDate, basicInfo.endDate)}
        </p>
      </div>
    </div>
  );
};