'use client'; // ItineraryDraftEditor内でuseState/useEffectが使われるため、クライアントコンポーネントとして実行します
// test
import React from 'react';
// 旅のしおり編集コンポーネントをインポート
import { ItineraryDraftEditor } from '@/components/organisms/ItineraryDraftEditor';
const highlights = [
  "URL / 画像 / 印刷の 3 形態で旅程を共有",
  "Supabase + Chakra UI + Next.js (App Router)",
  "Week1 では MVP（作成→編集→共有）を最優先",
];

import { PlanTripHero } from "@/components/organisms/PlanTripHero";
export default function Home() {

  const itineraryId = 'your-itinerary-id';

  return (
    <main className="flex min-h-screen flex-col justify-center bg-[#05060a] px-6 py-16 text-slate-100 sm:px-10">
          <div>
      <h1>旅のしおり</h1>
      <PrintNavigationButton itineraryId={itineraryId} />
    </div>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
        
        {/* ★★★ ここにItineraryDraftEditorが追加されています ★★★ */}
        <ItineraryDraftEditor />

        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-200">
            PlanTrip
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
            旅のしおりをリアルタイム編集
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            タイムラインへの入力・並び替え・費用管理を 1 画面に集約。幹事も参加者も迷わず使える編集体験を提供します。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {heroHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <TimelineEditor />
      </div>
    </main>
  );
}

// ブランチテストのための更新