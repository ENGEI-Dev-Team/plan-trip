"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SortMode,
  TimelineCategory,
  TimelineItem,
} from "@/types/timeline";
import SortModeToggle from "./SortModeToggle";
import TimelineItemRow from "./TimelineItemRow";
import TimelineSummary from "./TimelineSummary";

const TIMELINE_STORAGE_KEY = "tripbook.timeline-items.v1";
const PEOPLE_STORAGE_KEY = "tripbook.people-count.v1";

const CATEGORY_META: Record<
  TimelineCategory,
  { label: string; badgeClass: string; accentClass: string }
> = {
  move: {
    label: "移動",
    badgeClass: "text-sky-200",
    accentClass: "text-sky-200",
  },
  meal: {
    label: "食事",
    badgeClass: "text-amber-200",
    accentClass: "text-amber-200",
  },
  sight: {
    label: "観光",
    badgeClass: "text-emerald-200",
    accentClass: "text-emerald-200",
  },
  stay: {
    label: "宿",
    badgeClass: "text-violet-200",
    accentClass: "text-violet-200",
  },
  activity: {
    label: "体験",
    badgeClass: "text-rose-200",
    accentClass: "text-rose-200",
  },
  shopping: {
    label: "買い物",
    badgeClass: "text-indigo-200",
    accentClass: "text-indigo-200",
  },
  other: {
    label: "その他",
    badgeClass: "text-slate-200",
    accentClass: "text-slate-200",
  },
};

const CATEGORY_OPTIONS = (
  Object.keys(CATEGORY_META) as TimelineCategory[]
).map((key) => ({
  value: key,
  label: CATEGORY_META[key].label,
  badgeClass: CATEGORY_META[key].badgeClass,
}));

const SUMMARY_CATEGORY_META = Object.fromEntries(
  (Object.entries(CATEGORY_META) as [
    TimelineCategory,
    (typeof CATEGORY_META)[TimelineCategory],
  ][]).map(([key, meta]) => [
    key,
    { label: meta.label, accentClass: meta.accentClass },
  ]),
) as Record<TimelineCategory, { label: string; accentClass: string }>;

const DEFAULT_ITEMS: TimelineItem[] = [
  {
    id: "sample-1",
    time: "09:00",
    category: "move",
    title: "羽田空港を出発",
    memo: "モノレールで浜松町へ",
    amount: 0,
    orderIndex: 0,
  },
  {
    id: "sample-2",
    time: "12:00",
    category: "meal",
    title: "築地でランチ",
    memo: "海鮮丼を予約済み",
    amount: 2500,
    orderIndex: 1,
  },
  {
    id: "sample-3",
    time: "15:30",
    category: "sight",
    title: "浅草寺と周辺散策",
    memo: "仲見世通りで各自買い物",
    amount: 0,
    orderIndex: 2,
  },
];

const createEmptyItem = (orderIndex: number): TimelineItem => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  time: "",
  category: "other",
  title: "",
  memo: "",
  amount: 0,
  orderIndex,
});

const loadInitialItems = (): TimelineItem[] => {
  if (typeof window === "undefined") return DEFAULT_ITEMS;
  try {
    const stored = window.localStorage.getItem(TIMELINE_STORAGE_KEY);
    if (!stored) return DEFAULT_ITEMS;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return DEFAULT_ITEMS;
    return parsed as TimelineItem[];
  } catch {
    return DEFAULT_ITEMS;
  }
};

const loadInitialPeopleCount = (): number => {
  if (typeof window === "undefined") return 2;
  try {
    const saved = window.localStorage.getItem(PEOPLE_STORAGE_KEY);
    if (!saved) return 2;
    const parsed = Number(saved);
    if (Number.isNaN(parsed) || parsed <= 0) return 2;
    return parsed;
  } catch {
    return 2;
  }
};

const timeToMinutes = (value: string) => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const [hours, mins] = value.split(":").map(Number);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(mins) ||
    hours < 0 ||
    mins < 0
  ) {
    return Number.MAX_SAFE_INTEGER;
  }
  return hours * 60 + mins;
};

export default function TimelineEditor() {
  const [items, setItems] = useState<TimelineItem[]>(loadInitialItems);
  const [sortMode, setSortMode] = useState<SortMode>("time");
  const [peopleCount, setPeopleCount] =
    useState<number>(loadInitialPeopleCount);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PEOPLE_STORAGE_KEY, String(peopleCount));
  }, [peopleCount]);

  const sortedItems = useMemo(() => {
    const cloned = [...items];
    if (sortMode === "time") {
      return cloned.sort(
        (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time),
      );
    }
    return cloned.sort((a, b) => a.orderIndex - b.orderIndex);
  }, [items, sortMode]);

  const { categoryTotals, totalAmount, perPersonAmount } = useMemo(() => {
    const totals: Record<TimelineCategory, number> = {
      move: 0,
      meal: 0,
      sight: 0,
      stay: 0,
      activity: 0,
      shopping: 0,
      other: 0,
    };
    let total = 0;
    for (const item of items) {
      totals[item.category] += item.amount || 0;
      total += item.amount || 0;
    }
    const perPerson =
      peopleCount > 0 ? total / peopleCount : total;
    return { categoryTotals: totals, totalAmount: total, perPersonAmount: perPerson };
  }, [items, peopleCount]);

  const updateItem = (id: string, patch: Partial<TimelineItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = () => {
    setItems((prev) => {
      const nextIndex =
        prev.length > 0
          ? Math.max(...prev.map((item) => item.orderIndex)) + 1
          : 0;
      return [...prev, createEmptyItem(nextIndex)];
    });
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    if (sortMode !== "manual") return;
    setItems((prev) => {
      const ordered = [...prev].sort((a, b) => a.orderIndex - b.orderIndex);
      const currentIndex = ordered.findIndex((item) => item.id === id);
      if (currentIndex === -1) return prev;
      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= ordered.length) return prev;
      const current = ordered[currentIndex];
      const target = ordered[targetIndex];
      return prev.map((item) => {
        if (item.id === current.id) {
          return { ...item, orderIndex: target.orderIndex };
        }
        if (item.id === target.id) {
          return { ...item, orderIndex: current.orderIndex };
        }
        return item;
      });
    });
  };

  const isEmpty = sortedItems.length === 0;

  return (
    <section className="space-y-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-200">
          Timeline
        </p>
        <h2 className="text-3xl font-semibold text-white">旅のタイムライン編集</h2>
        <p className="text-sm text-slate-400">
          時刻の自動整列と手動並び替えを切り替えつつ、カテゴリ別の費用も同時に管理できます。入力内容は localStorage に保存されるので続きから編集可能です。
        </p>
      </header>
      <SortModeToggle value={sortMode} onChange={setSortMode} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {isEmpty ? (
            <div className="rounded-3xl border border-dashed border-white/20 p-6 text-center text-sm text-slate-400">
              まだタイムライン項目がありません。まずは「+ 項目を追加」を押してみましょう。
            </div>
          ) : (
            sortedItems.map((item, index) => (
              <TimelineItemRow
                key={item.id}
                item={item}
                sortMode={sortMode}
                categoryOptions={CATEGORY_OPTIONS}
                isFirst={index === 0}
                isLast={index === sortedItems.length - 1}
                onChange={updateItem}
                onDelete={deleteItem}
                onMove={moveItem}
              />
            ))
          )}

          <button
            type="button"
            onClick={addItem}
            className="w-full rounded-3xl border border-dashed border-white/30 py-4 text-center text-sm font-semibold text-slate-200 transition hover:border-pink-300 hover:text-white"
          >
            + 項目を追加
          </button>
        </div>

        <TimelineSummary
          categoryTotals={categoryTotals}
          totalAmount={totalAmount}
          perPersonAmount={perPersonAmount}
          peopleCount={peopleCount}
          onPeopleChange={setPeopleCount}
          categoryMeta={SUMMARY_CATEGORY_META}
        />
      </div>
    </section>
  );
}
