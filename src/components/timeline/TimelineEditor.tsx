"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { TimelineCategory, TimelineItem } from "@/types/timeline";
import type { ItineraryPublishArgs } from "@/types/publish";
import TimelineDayTabs from "./TimelineDayTabs";
import TimelineItemRow from "./TimelineItemRow";
import BudgetSummaryCard from "./BudgetSummaryCard";
import PublishShareActions from "./PublishShareActions";
import { UsefulToolsCard } from "@/components/molecules/UsefulToolsCard";
import { SaveStatusToast } from "@/components/molecules/SaveStatusToast";

const PRIMARY = "#0ea5e9";
const TIMELINE_STORAGE_KEY_PREFIX = "tripbook.timeline-items.v1";
const PEOPLE_STORAGE_KEY_PREFIX = "tripbook.people-count.v1";
const PUBLISH_ARGS_KEY_PREFIX = "tripbook.publish-args.v1";

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

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_META) as TimelineCategory[]).map(
  (key) => ({
    value: key,
    label: CATEGORY_META[key].label,
    badgeClass: CATEGORY_META[key].badgeClass,
  }),
);

const SUMMARY_CATEGORY_META = Object.fromEntries(
  (
    Object.entries(CATEGORY_META) as [
      TimelineCategory,
      (typeof CATEGORY_META)[TimelineCategory],
    ][]
  ).map(([key, meta]) => [
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
    photoUrl: "",
  },
  {
    id: "sample-2",
    time: "12:00",
    category: "meal",
    title: "築地でランチ",
    memo: "海鮮丼を予約済み",
    amount: 2500,
    orderIndex: 1,
    photoUrl: "",
  },
  {
    id: "sample-3",
    time: "15:30",
    category: "sight",
    title: "浅草寺と周辺散策",
    memo: "仲見世通りで各自買い物",
    amount: 0,
    orderIndex: 2,
    photoUrl: "",
  },
];

const loadItemsFromStorage = (storageKey: string): TimelineItem[] => {
  if (typeof window === "undefined") return DEFAULT_ITEMS;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return DEFAULT_ITEMS;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return DEFAULT_ITEMS;

    // 必要なら正規化（photoUrlがundefinedでも""にする等）
    return (parsed as TimelineItem[]).map((it, index) => ({
      ...it,
      orderIndex: typeof it.orderIndex === "number" ? it.orderIndex : index,
      amount: typeof it.amount === "number" ? it.amount : 0,
      photoUrl: it.photoUrl ?? "",
    }));
  } catch {
    return DEFAULT_ITEMS;
  }
};

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
  photoUrl: "",
});

const timeToMinutes = (value: string) => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const [hours, mins] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(mins) || hours < 0 || mins < 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  return hours * 60 + mins;
};

const parseDateYMDToUTC = (value: string): number | null => {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  const utc = Date.UTC(year, month - 1, day);
  return Number.isNaN(utc) ? null : utc;
};

const calcTripDays = (startDate: string, endDate: string): number | null => {
  const startUtc = parseDateYMDToUTC(startDate);
  const endUtc = parseDateYMDToUTC(endDate || startDate);
  if (startUtc === null || endUtc === null) return null;
  const diffDays = Math.floor((endUtc - startUtc) / 86_400_000);
  const days = diffDays + 1;
  return days > 0 ? days : 1;
};

const loadInitialPeople = (storageKey: string): number => {
  if (typeof window === "undefined") return 2;
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return 2;
    const parsed = Number(saved);
    return !Number.isNaN(parsed) && parsed > 0 ? parsed : 2;
  } catch {
    return 2;
  }
};

export default function TimelineEditor() {
  const params = useParams();
  const itineraryId = params.id as string;
  const router = useRouter();
  const timelineStorageKey = `${TIMELINE_STORAGE_KEY_PREFIX}.${itineraryId}`;
  const peopleStorageKey = `${PEOPLE_STORAGE_KEY_PREFIX}.${itineraryId}`;
  const publishArgsKey = `${PUBLISH_ARGS_KEY_PREFIX}.${itineraryId}`;
  const [isDesktop, showLine] = useMediaQuery(
    ["(min-width: 961px)", "(min-width: 880px)"],
    { fallback: [false, false] },
  );

  const [items, setItems] = useState<TimelineItem[]>(() =>
    loadItemsFromStorage(timelineStorageKey),
  );
  const [peopleCount, setPeopleCount] = useState<number>(() =>
    loadInitialPeople(peopleStorageKey),
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [shareLinkId, setShareLinkId] = useState<string | null>(null);
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [noticeType, setNoticeType] = useState<"success" | "error">("success");
  const [activeDay, setActiveDay] = useState(0);
  const [tripDates, setTripDates] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const dayTabs = useMemo(() => {
    const days = calcTripDays(tripDates.startDate, tripDates.endDate);
    const count = days ?? 1;
    return Array.from({ length: count }, (_, idx) => `${idx + 1}日目`);
  }, [tripDates.endDate, tripDates.startDate]);
  const didHydrateRef = useRef(false);

  // ✅ 初回hydration完了フラグのみ設定（setState削除）
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(timelineStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          (parsed as TimelineItem[]).map((it) => ({
            ...it,
            photoUrl: it.photoUrl ?? "",
          }));
        }
      }
    } catch {}

    try {
      const saved = window.localStorage.getItem(peopleStorageKey);
      if (saved) {
        const parsed = Number(saved);
        if (!Number.isNaN(parsed) && parsed > 0) setPeopleCount(parsed);
      }
    } catch {}

    try {
      const storedArgsRaw = window.localStorage.getItem(publishArgsKey);
      if (storedArgsRaw) {
        const storedArgs = JSON.parse(storedArgsRaw) as Partial<
          ItineraryPublishArgs
        >;
        setTripDates({
          startDate:
            typeof storedArgs.start_date === "string"
              ? storedArgs.start_date
              : "",
          endDate:
            typeof storedArgs.end_date === "string" ? storedArgs.end_date : "",
        });
      }
    } catch {}

    didHydrateRef.current = true;
  }, [timelineStorageKey, peopleStorageKey, publishArgsKey]);

  useEffect(() => {
    if (dayTabs.length === 0) return;
    if (activeDay >= dayTabs.length) {
      setActiveDay(dayTabs.length - 1);
    }
  }, [activeDay, dayTabs.length]);

  // ✅ itemsの変更を保存
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!didHydrateRef.current) return; // 初回読み込み前に保存しない
    window.localStorage.setItem(timelineStorageKey, JSON.stringify(items));
  }, [items, timelineStorageKey]);

  // ✅ peopleCountの変更を保存
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!didHydrateRef.current) return;
    window.localStorage.setItem(peopleStorageKey, String(peopleCount));
  }, [peopleCount, peopleStorageKey]);

  const handlePublishShare = useCallback(async () => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      const storedArgsRaw = window.localStorage.getItem(publishArgsKey);
      const storedArgs = storedArgsRaw
        ? (JSON.parse(storedArgsRaw) as Partial<ItineraryPublishArgs>)
        : null;
      const mergedArgs: ItineraryPublishArgs = {
        itinerary_id: itineraryId,
        title: storedArgs?.title ?? "",
        pref_code: storedArgs?.pref_code ?? "",
        start_date: storedArgs?.start_date ?? "",
        end_date: storedArgs?.end_date ?? "",
        people_count: storedArgs?.people_count ?? peopleCount,
        items,
      };
      console.log("[publish] merged defaultValues + items", mergedArgs);
      window.localStorage.setItem(publishArgsKey, JSON.stringify(mergedArgs));

      const response = await fetch(`/api/itineraries/${itineraryId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedArgs),
      });
      console.log("[publish] response status", response.status);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log("[publish] response error payload", data);
        throw new Error(data?.error ?? "共有リンク作成に失敗しました");
      }
      const data = await response.json();
      console.log("[publish] response success payload", data);
      setShareLinkId(data.id ?? null);
      setNoticeType("success");
      setShowSaveNotice(true);
      if (data.id) {
        window.setTimeout(() => router.push(`/preview/${data.id}`), 2800);
      }
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "共有リンク作成に失敗しました",
      );
      setNoticeType("error");
      setShowSaveNotice(true);
    } finally {
      setIsPublishing(false);
    }
  }, [items, itineraryId, peopleCount, publishArgsKey]);

  useEffect(() => {
    const handleTestSave = () => {
      void handlePublishShare();
    };
    window.addEventListener("tripbook:test-save", handleTestSave);
    return () =>
      window.removeEventListener("tripbook:test-save", handleTestSave);
  }, [handlePublishShare]);

  useEffect(() => {
    if (!showSaveNotice) return;
    const timer = window.setTimeout(() => {
      setShowSaveNotice(false);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [showSaveNotice]);

  const sortedItems = useMemo(() => {
    const cloned = [...items];
    return cloned.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }, [items]);

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
    const perPerson = peopleCount > 0 ? total / peopleCount : total;
    return {
      categoryTotals: totals,
      totalAmount: total,
      perPersonAmount: perPerson,
    };
  }, [items, peopleCount]);

  const updateItem = (id: string, patch: Partial<TimelineItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const addItem = () => {
    setItems((prev) => {
      const nextIndex =
        prev.length > 0 ? Math.max(...prev.map((it) => it.orderIndex)) + 1 : 0;
      return [...prev, createEmptyItem(nextIndex)];
    });
  };

  const isEmpty = sortedItems.length === 0;

  return (
    <>
      <SaveStatusToast visible={showSaveNotice} type={noticeType} />
      <Box
        h="100%"
        display="grid"
        gridTemplateColumns={isDesktop ? "1fr 320px" : "1fr"}
        minH={0}
      >
        {/* Left */}
        <Flex
          direction="column"
          minH={0}
          bg="#fdfdfc"
          borderRight={isDesktop ? "1px solid #f1f1f0" : "none"}
        >
          <TimelineDayTabs
            labels={dayTabs}
            activeDay={activeDay}
            onChange={setActiveDay}
          />

          {/* scroll body (left only) */}
          <Box
            flex={1}
            minH={0}
            overflowY="auto"
            px={{ base: 4, md: 5 }}
            py={{ base: 5, md: 6 }}
            pb={!isDesktop ? "140px" : "24px"}
            position="relative"
          >
            {showLine && (
              <Box
                position="absolute"
                left="58px"
                top="10px"
                bottom="10px"
                w="2px"
                bg="#e5e7eb"
              />
            )}

            {isEmpty ? (
              <Box
                bg="white"
                border="1px dashed #d1d5db"
                borderRadius="xl"
                p={6}
                textAlign="center"
                color="#6b7280"
                fontSize="sm"
              >
                まだタイムライン項目がありません。まずは「＋」から追加してみましょう。
              </Box>
            ) : (
              <Stack gap={5}>
                {sortedItems.map((item) => (
                  <TimelineItemRow
                    key={item.id}
                    item={item}
                    categoryOptions={CATEGORY_OPTIONS}
                    onChange={updateItem}
                    onDelete={deleteItem}
                  />
                ))}
              </Stack>
            )}

            <Box mt={4}>
              <Button variant="outline" borderStyle="dashed" onClick={addItem}>
                + 項目を追加
              </Button>
            </Box>

            {/* モバイル時は左下にも予算サマリー */}
            {!isDesktop && (
              <Box mt={4}>
                <BudgetSummaryCard
                  categoryTotals={categoryTotals}
                  totalAmount={totalAmount}
                  perPersonAmount={perPersonAmount}
                  peopleCount={peopleCount}
                  onPeopleChange={setPeopleCount}
                  categoryMeta={SUMMARY_CATEGORY_META}
                />
              </Box>
            )}

            <Text mt={6} fontSize="xs" color="#6b7280">
              入力内容はブラウザのローカル（localStorage）に保存されます。
            </Text>
          </Box>
        </Flex>

        {/* Right sidebar：デスクトップのみ */}
        {isDesktop && (
          <Box bg="white" p={4} overflow="auto" minH={0}>
            <Stack gap={4}>
              {/* 予算サマリー */}
              <BudgetSummaryCard
                categoryTotals={categoryTotals}
                totalAmount={totalAmount}
                perPersonAmount={perPersonAmount}
                peopleCount={peopleCount}
                onPeopleChange={setPeopleCount}
                categoryMeta={SUMMARY_CATEGORY_META}
              />

            </Stack>
          </Box>
        )}
      </Box>

      {/* Dock：モバイルのみ */}
      {!isDesktop && (
        <Flex
          position="fixed"
          left={0}
          right={0}
          bottom={0}
          zIndex={20}
          bg="rgba(255,255,255,0.96)"
          backdropFilter="blur(10px)"
          borderTop="1px solid #e5e7eb"
          px={{ base: 4, md: 5 }}
          py={3}
          align="center"
          justify="space-between"
          boxShadow="0 -10px 30px rgba(0,0,0,0.08)"
        >
          <Button
            variant="ghost"
            color="#6b7280"
            fontWeight="800"
            onClick={() => router.push(`/print/${itineraryId}`)}
            display="inline-flex"
            flexDirection="column"
            gap={1}
          >
            👁️ <Text fontSize="xs">保存・見る</Text>
          </Button>

          <Box
            role="button"
            tabIndex={0}
            aria-label="予定を追加"
            onClick={addItem}
            w="72px"
            h="72px"
            borderRadius="full"
            border="6px solid #fff"
            bg={PRIMARY}
            color="white"
            fontSize="28px"
            display="grid"
            placeItems="center"
            boxShadow="0 14px 34px rgba(14,165,233,0.3)"
            cursor="pointer"
          >
            +
          </Box>

          <Button
            variant="ghost"
            color="#6b7280"
            fontWeight="800"
            onClick={() => router.push(`/share/${itineraryId}`)}
            display="inline-flex"
            flexDirection="column"
            gap={1}
          >
            🛠️ <Text fontSize="xs">便利機能</Text>
          </Button>
        </Flex>
      )}
    </>
  );
}
