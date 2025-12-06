import { SortMode } from "@/types/timeline";

interface SortModeToggleProps {
  value: SortMode;
  onChange: (mode: SortMode) => void;
}

const modes: { value: SortMode; label: string; description: string }[] = [
  { value: "time", label: "時間順ソート", description: "時刻を基準に自動整列" },
  { value: "manual", label: "手動並び替え", description: "上下ボタンで順番を制御" },
];

export default function SortModeToggle({ value, onChange }: SortModeToggleProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        並び順モード
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {modes.map((mode) => {
          const active = value === mode.value;
          return (
            <button
              type="button"
              key={mode.value}
              onClick={() => onChange(mode.value)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                active
                  ? "border-pink-300/60 bg-pink-500/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
              }`}
            >
              <p className="text-base font-semibold">{mode.label}</p>
              <p className="text-sm text-slate-400">{mode.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
