import { TimelineCategory } from "@/types/timeline";
import PeopleCounter from "./PeopleCounter";

interface CategoryMeta {
  label: string;
  accentClass: string;
}

interface TimelineSummaryProps {
  categoryTotals: Record<TimelineCategory, number>;
  totalAmount: number;
  perPersonAmount: number;
  peopleCount: number;
  onPeopleChange: (value: number) => void;
  categoryMeta: Record<TimelineCategory, CategoryMeta>;
}

const formatCurrency = (value: number) =>
  `¥${value.toLocaleString("ja-JP", { maximumFractionDigits: 0 })}`;

export default function TimelineSummary({
  categoryTotals,
  totalAmount,
  perPersonAmount,
  peopleCount,
  onPeopleChange,
  categoryMeta,
}: TimelineSummaryProps) {
  return (
    <aside className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          費用サマリー
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Budget</h2>
        <p className="text-sm text-slate-400">
          カテゴリ別の合計と 1 人あたりの目安をリアルタイムに確認できます。
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-slate-400">人数</p>
        <PeopleCounter value={peopleCount} onChange={onPeopleChange} />
      </div>

      <div className="space-y-2">
        {(Object.keys(categoryMeta) as TimelineCategory[]).map((category) => (
          <div
            key={category}
            className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-white"
          >
            <span className={categoryMeta[category].accentClass}>
              {categoryMeta[category].label}
            </span>
            <span className="font-semibold">
              {formatCurrency(categoryTotals[category] ?? 0)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-2xl border border-pink-300/60 bg-pink-500/10 px-4 py-3 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-200">Total</p>
        <p className="text-3xl font-semibold">{formatCurrency(totalAmount)}</p>
        <p className="text-sm text-pink-100">
          1 人あたり{" "}
          <span className="font-semibold">
            {formatCurrency(Math.round(perPersonAmount))}
          </span>
        </p>
      </div>
    </aside>
  );
}
