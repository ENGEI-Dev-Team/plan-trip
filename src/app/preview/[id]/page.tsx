'use client';

import { ItineraryData } from '@/types/itinerary';
import { useRouter } from 'next/navigation';
import { ItineraryPreviewLayout } from '@/components/templates/ItineraryPreviewLayout';

// サンプルデータ
const sampleData: ItineraryData = {
  basicInfo: {
    title: '京都紅葉めぐり',
    prefecture: '京都府',
    startDate: '2023-11-20',
    endDate: '2023-11-21',
  },
  schedules: [
    {
      date: '2023-11-20',
      items: [
        {
          id: '1',
          time: '10:00',
          category: '移動',
          title: '京都駅到着',
          memo: '東京から新幹線で到着。コインロッカーで荷物を預ける。',
          amount: 14000,
        },
        // ...
      ],
    },
  ],
};

// 画像マップ（任意）
const images = {
  '2': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
  '3': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
};

export default function PreviewPage() {

  const router = useRouter();
  
  return (
    <ItineraryPreviewLayout 
      itineraryData={sampleData}
      memberCount={2}
      itemImages={images}
      onBack={() => router.back()}
    />
  );
}
