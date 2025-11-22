import TimelineEditor from "@/components/timeline/TimelineEditor";

const heroHighlights = [
  "時間順ソートと手動並び替えをワンタップ切替",
  "カテゴリ別・1人あたり費用を即時計算",
  "localStorage で続きから編集OK",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12 text-slate-100 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-pink-200">
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
