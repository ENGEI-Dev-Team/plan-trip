import { SortMode, TimelineCategory, TimelineItem } from "@/types/timeline";

interface CategoryOption {
  value: TimelineCategory;
  label: string;
  badgeClass: string;
}

interface TimelineItemRowProps {
  item: TimelineItem;
  sortMode: SortMode;
  categoryOptions: CategoryOption[];
  isFirst: boolean;
  isLast: boolean;
  onChange: (id: string, patch: Partial<TimelineItem>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

const formatAmount = (value: number) =>
  value.toLocaleString("ja-JP", { maximumFractionDigits: 0 });

export default function TimelineItemRow({
  item,
  sortMode,
  categoryOptions,
  isFirst,
  isLast,
  onChange,
  onDelete,
  onMove,
}: TimelineItemRowProps) {
  const currentCategory = categoryOptions.find(
    (option) => option.value === item.category,
  );

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex flex-col text-sm text-slate-300 lg:w-32">
          時間
          <input
            type="time"
            value={item.time}
            onChange={(event) =>
              onChange(item.id, { time: event.currentTarget.value })
            }
            className="mt-1 rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-2 text-base text-white outline-none focus:border-pink-300/60"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-300 lg:w-48">
          カテゴリ
          <div className="mt-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 px-3">
            <span
              className={`text-xs font-semibold ${currentCategory?.badgeClass ?? ""}`}
            >
              {currentCategory?.label ?? "カテゴリ"}
            </span>
            <select
              value={item.category}
              onChange={(event) =>
                onChange(item.id, {
                  category: event.currentTarget.value as TimelineCategory,
                })
              }
              className="flex-1 bg-transparent py-2 text-base text-white outline-none"
            >
              {categoryOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-slate-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex flex-1 flex-col text-sm text-slate-300">
          タイトル
          <input
            type="text"
            value={item.title}
            placeholder="スポット / 行き先など"
            onChange={(event) =>
              onChange(item.id, { title: event.currentTarget.value })
            }
            className="mt-1 rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-2 text-base text-white outline-none focus:border-pink-300/60"
          />
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <label className="flex flex-col text-sm text-slate-300 lg:col-span-2">
          メモ
          <textarea
            rows={2}
            value={item.memo}
            placeholder="補足・移動手段・リンクなど"
            onChange={(event) =>
              onChange(item.id, { memo: event.currentTarget.value })
            }
            className="mt-1 rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-2 text-base text-white outline-none focus:border-pink-300/60"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-300">
          金額
          <div className="mt-1 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/50 px-3 py-2 text-white">
            <span className="text-slate-400">¥</span>
            <input
              type="number"
              min={0}
              value={Number.isNaN(item.amount) ? "" : item.amount}
              onChange={(event) =>
                onChange(item.id, {
                  amount: Number(event.currentTarget.value || 0),
                })
              }
              className="flex-1 bg-transparent text-right text-lg outline-none"
            />
          </div>
          {item.amount > 0 && (
            <span className="mt-1 text-xs text-slate-400">
              ¥{formatAmount(item.amount)}
            </span>
          )}
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <span>ID: {item.id.slice(0, 6)}</span>
          {sortMode === "manual" && (
            <>
              <button
                type="button"
                onClick={() => onMove(item.id, "up")}
                disabled={isFirst}
                className="rounded-full border border-white/10 px-3 py-1 text-base text-white transition disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMove(item.id, "down")}
                disabled={isLast}
                className="rounded-full border border-white/10 px-3 py-1 text-base text-white transition disabled:opacity-40"
              >
                ↓
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="rounded-full border border-red-400/50 px-4 py-1 text-sm font-semibold text-red-200 transition hover:border-red-400 hover:text-white"
        >
          削除
        </button>
      </div>
    </div>
  );
}
