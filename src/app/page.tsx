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
  return (
    <main className="flex min-h-screen flex-col justify-center bg-[#05060a] px-6 py-16 text-slate-100 sm:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
        
        {/* ★★★ ここにItineraryDraftEditorが追加されています ★★★ */}
        <ItineraryDraftEditor />

        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-200">
            PlanTrip
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            旅行しおりアプリの MVP
          </h1>
          <p className="text-lg text-slate-300">
            幹事が迷わずスケジュールをまとめて、同行者がスマホ / PC /
            紙で同じ情報を見られる体験をゴールに据えています。
          </p>
        </header>

        <section className="grid gap-8 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm font-semibold text-pink-200">Focus</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              今スプリントでやること
            </h2>
            <ul className="mt-4 space-y-2 text-slate-200">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-base">
                  <span className="mt-1 h-2 w-2 rounded-full bg-pink-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-white/10 bg-black/10 p-6">
            <p className="text-sm font-semibold text-sky-200">Next Up</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              次フェーズの検討項目
            </h2>
            <ul className="mt-4 space-y-2 text-slate-200">
              {upcoming.map((item) => (
                <li key={item} className="flex items-start gap-2 text-base">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <footer className="flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>ブランチ: develop / feature-* ブランチで作業中</span>
          <span>CI: GitHub Actions で pnpm lint & vitest を実行</span>
        </footer>
      </div>
    </main>
  );
}

// ブランチテストのための更新