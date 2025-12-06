
import { TrifoldPrintLayout } from '@/components/templates/TrifoldPrintLayout';
import { ItineraryData } from '@/types/itinerary';

// サンプルデータ（実際のデータ取得に置き換えてください）
const getSampleData = (): ItineraryData => ({
  basicInfo: {
    title: '京都・大阪 2泊3日の旅',
    prefecture: '京都府・大阪府',
    startDate: '2025-12-01',
    endDate: '2025-12-03',
  },
  schedules: [
    {
      date: '2025-12-01',
      items: [
        {
          id: '1',
          time: '09:00',
          category: '移動',
          title: '東京駅から新幹線で京都へ',
          memo: 'のぞみ123号',
          amount: 13320,
        },
        {
          id: '2',
          time: '11:30',
          category: '観光',
          title: '清水寺',
          memo: '紅葉シーズン',
          amount: 400,
        },
        {
          id: '3',
          time: '13:00',
          category: '食事',
          title: '京料理ランチ',
          amount: 3000,
        },
        {
          id: '4',
          time: '15:00',
          category: '観光',
          title: '金閣寺',
          amount: 500,
        },
        {
          id: '5',
          time: '18:00',
          category: '宿',
          title: 'ホテルチェックイン',
          memo: '京都駅前ホテル',
          amount: 8000,
        },
      ],
    },
    {
      date: '2025-12-02',
      items: [
        {
          id: '6',
          time: '09:00',
          category: '観光',
          title: '伏見稲荷大社',
          amount: 0,
        },
        {
          id: '7',
          time: '12:00',
          category: '食事',
          title: 'ラーメン',
          amount: 1200,
        },
        {
          id: '8',
          time: '14:00',
          category: '移動',
          title: '大阪へ移動',
          amount: 560,
        },
        {
          id: '9',
          time: '16:00',
          category: '買い物',
          title: '心斎橋ショッピング',
          amount: 5000,
        },
        {
          id: '10',
          time: '19:00',
          category: '食事',
          title: 'たこ焼き・お好み焼き',
          amount: 2500,
        },
      ],
    },
    {
      date: '2025-12-03',
      items: [
        {
          id: '11',
          time: '10:00',
          category: '観光',
          title: '大阪城',
          amount: 600,
        },
        {
          id: '12',
          time: '12:30',
          category: '食事',
          title: '串カツランチ',
          amount: 2000,
        },
        {
          id: '13',
          time: '15:00',
          category: '移動',
          title: '新大阪から新幹線で帰路',
          amount: 13320,
        },
      ],
    },
  ],
});

interface PrintPageProps {
  params: {
    id: string;
  };
}

export default async function PrintPage({ params }: PrintPageProps) {
  // 実際の実装では、APIやデータベースからデータを取得
  // const data = await fetchItineraryData(params.id);
  
  const data = getSampleData();

  return (
    <main className="min-h-screen bg-gray-100">
      <TrifoldPrintLayout data={data} />
    </main>
  );
}

// メタデータ設定
export async function generateMetadata({ params }: PrintPageProps) {
  return {
    title: '旅のしおり印刷',
    description: '旅のしおりを三つ折り形式で印刷',
  };
}