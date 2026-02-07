"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { SortMode, TimelineCategory, TimelineItem } from "@/types/timeline";
import SortModeToggle from "./SortModeToggle";
import TimelineItemRow from "./TimelineItemRow";
import TimelineSummary from "./TimelineSummary";
import { TripAlbumCard } from "@/components/molecules/TripAlbumCard";
import { UsefulToolsCard } from "@/components/molecules/UsefulToolsCard";
import { useIsClient } from "@/hooks/useIsClient";

const PRIMARY = "#0ea5e9";
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

const loadItemsFromStorage = (): TimelineItem[] => {
  if (typeof window === "undefined") return DEFAULT_ITEMS;

  try {
    const stored = window.localStorage.getItem(TIMELINE_STORAGE_KEY);
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

export default function TimelineEditor() {
  const params = useParams();
  const itineraryId = params.id as string;
  const router = useRouter();
  const [isDesktop, showLine] = useMediaQuery(
    ["(min-width: 961px)", "(min-width: 880px)"],
    { fallback: [false, false] },
  );

  // ✅ useStateの初期化関数でlocalStorageから読み込み（useEffect内でのsetStateを回避）
  const [items, setItems] = useState<TimelineItem[]>(() => loadItemsFromStorage());
  
  const [peopleCount, setPeopleCount] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    try {
      const saved = window.localStorage.getItem(PEOPLE_STORAGE_KEY);
      if (!saved) return 2;
      const parsed = Number(saved);
      return !Number.isNaN(parsed) && parsed > 0 ? parsed : 2;
    } catch {
      return 2;
    }
  });

  const [albumPhotos, setAlbumPhotos] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("time");
  const [activeDay, setActiveDay] = useState(0);
  const dayTabs = [{ label: "1日目" }, { label: "2日目" }, { label: "3日目" }];
  const didHydrateRef = useRef(false);

  // ✅ 初回hydration完了フラグのみ設定（setState削除）
  useEffect(() => {
    didHydrateRef.current = true;
  }, []);

  // ✅ itemsの変更を保存
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!didHydrateRef.current) return; // 初回読み込み前に保存しない
    window.localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // ✅ peopleCountの変更を保存
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!didHydrateRef.current) return;
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

  const moveItem = (id: string, direction: "up" | "down") => {
    if (sortMode !== "manual") return;
    setItems((prev) => {
      const ordered = [...prev].sort((a, b) => a.orderIndex - b.orderIndex);
      const currentIndex = ordered.findIndex((it) => it.id === id);
      if (currentIndex === -1) return prev;

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= ordered.length) return prev;

      const current = ordered[currentIndex];
      const target = ordered[targetIndex];

      return prev.map((it) => {
        if (it.id === current.id)
          return { ...it, orderIndex: target.orderIndex };
        if (it.id === target.id)
          return { ...it, orderIndex: current.orderIndex };
        return it;
      });
    });
  };

  const isEmpty = sortedItems.length === 0;

  return (
    <>
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
          {/* Day tabs */}
          <HStack
            px={4}
            py={3}
            gap={2}
            overflowX="auto"
            bg="rgba(250,250,249,0.85)"
            borderBottom="1px solid #f1f1f0"
          >
            {dayTabs.map((t, idx) => {
              const active = idx === activeDay;
              return (
                <Button
                  key={t.label}
                  size="sm"
                  borderRadius="full"
                  border="1px solid"
                  borderColor={active ? "transparent" : "#e5e7eb"}
                  bg={active ? PRIMARY : "white"}
                  color={active ? "white" : "#6b7280"}
                  boxShadow={
                    active ? "0 10px 24px rgba(14,165,233,0.26)" : "none"
                  }
                  onClick={() => setActiveDay(idx)}
                  flexShrink={0}
                >
                  {t.label}
                </Button>
              );
            })}
          </HStack>

          {/* tools */}
          <Box
            px={4}
            py={2}
            borderBottom="1px solid #f1f1f0"
            bg="rgba(255,255,255,0.6)"
          >
            <SortModeToggle value={sortMode} onChange={setSortMode} />
          </Box>

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
                {sortedItems.map((item, index) => (
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
                <Box
                  bg="white"
                  border="1px solid #f1f1f0"
                  borderRadius="14px"
                  p={4}
                  boxShadow="0 8px 20px rgba(0,0,0,0.04)"
                >
                  <Text fontWeight="700" fontSize="sm" mb={2} color="#111827">
                    予算サマリー
                  </Text>
                  <TimelineSummary
                    categoryTotals={categoryTotals}
                    totalAmount={totalAmount}
                    perPersonAmount={perPersonAmount}
                    peopleCount={peopleCount}
                    onPeopleChange={setPeopleCount}
                    categoryMeta={SUMMARY_CATEGORY_META}
                  />
                </Box>
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
              <Box
                border="1px solid #f1f1f0"
                borderRadius="14px"
                p={4}
                boxShadow="0 8px 20px rgba(0,0,0,0.04)"
              >
                <Text fontWeight="700" fontSize="sm" mb={2} color="#111827">
                  予算サマリー
                </Text>
                <TimelineSummary
                  categoryTotals={categoryTotals}
                  totalAmount={totalAmount}
                  perPersonAmount={perPersonAmount}
                  peopleCount={peopleCount}
                  onPeopleChange={setPeopleCount}
                  categoryMeta={SUMMARY_CATEGORY_META}
                />
              </Box>

              <TripAlbumCard
                photos={albumPhotos}
                onAdd={(url) => setAlbumPhotos((prev) => [url, ...prev])}
                onRemove={(index) =>
                  setAlbumPhotos((prev) => prev.filter((_, i) => i !== index))
                }
                onPhotoClick={(url, index) => {
                  console.log("clicked:", url);
                  alert(`clicked: ${index + 1}\n${url}`);
                }}
              />

              {/* 便利ツール */}
              <UsefulToolsCard />
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


// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Box,
//   Button,
//   Flex,
//   HStack,
//   Stack,
//   Text,
//   useMediaQuery,
// } from "@chakra-ui/react";
// import { useParams, useRouter } from "next/navigation";
// import { SortMode, TimelineCategory, TimelineItem } from "@/types/timeline";
// import SortModeToggle from "./SortModeToggle";
// import TimelineItemRow from "./TimelineItemRow";
// import TimelineSummary from "./TimelineSummary";
// import { TripAlbumCard } from "@/components/molecules/TripAlbumCard";
// import { UsefulToolsCard } from "@/components/molecules/UsefulToolsCard";
// import dynamic from 'next/dynamic';
// import { useIsClient } from "@/hooks/useIsClient";

// const PRIMARY = "#0ea5e9";
// const TIMELINE_STORAGE_KEY = "tripbook.timeline-items.v1";
// const PEOPLE_STORAGE_KEY = "tripbook.people-count.v1";

// const CATEGORY_META: Record<
//   TimelineCategory,
//   { label: string; badgeClass: string; accentClass: string }
// > = {
//   move: {
//     label: "移動",
//     badgeClass: "text-sky-200",
//     accentClass: "text-sky-200",
//   },
//   meal: {
//     label: "食事",
//     badgeClass: "text-amber-200",
//     accentClass: "text-amber-200",
//   },
//   sight: {
//     label: "観光",
//     badgeClass: "text-emerald-200",
//     accentClass: "text-emerald-200",
//   },
//   stay: {
//     label: "宿",
//     badgeClass: "text-violet-200",
//     accentClass: "text-violet-200",
//   },
//   activity: {
//     label: "体験",
//     badgeClass: "text-rose-200",
//     accentClass: "text-rose-200",
//   },
//   shopping: {
//     label: "買い物",
//     badgeClass: "text-indigo-200",
//     accentClass: "text-indigo-200",
//   },
//   other: {
//     label: "その他",
//     badgeClass: "text-slate-200",
//     accentClass: "text-slate-200",
//   },
// };

// const CATEGORY_OPTIONS = (Object.keys(CATEGORY_META) as TimelineCategory[]).map(
//   (key) => ({
//     value: key,
//     label: CATEGORY_META[key].label,
//     badgeClass: CATEGORY_META[key].badgeClass,
//   }),
// );

// const SUMMARY_CATEGORY_META = Object.fromEntries(
//   (
//     Object.entries(CATEGORY_META) as [
//       TimelineCategory,
//       (typeof CATEGORY_META)[TimelineCategory],
//     ][]
//   ).map(([key, meta]) => [
//     key,
//     { label: meta.label, accentClass: meta.accentClass },
//   ]),
// ) as Record<TimelineCategory, { label: string; accentClass: string }>;

// const DEFAULT_ITEMS: TimelineItem[] = [
//   {
//     id: "sample-1",
//     time: "09:00",
//     category: "move",
//     title: "羽田空港を出発",
//     memo: "モノレールで浜松町へ",
//     amount: 0,
//     orderIndex: 0,
//     photoUrl: "",
//   },
//   {
//     id: "sample-2",
//     time: "12:00",
//     category: "meal",
//     title: "築地でランチ",
//     memo: "海鮮丼を予約済み",
//     amount: 2500,
//     orderIndex: 1,
//     photoUrl: "",
//   },
//   {
//     id: "sample-3",
//     time: "15:30",
//     category: "sight",
//     title: "浅草寺と周辺散策",
//     memo: "仲見世通りで各自買い物",
//     amount: 0,
//     orderIndex: 2,
//     photoUrl: "",
//   },
// ];

// const loadItemsFromStorage = (): TimelineItem[] => {
//   if (typeof window === "undefined") return DEFAULT_ITEMS;

//   try {
//     const stored = window.localStorage.getItem(TIMELINE_STORAGE_KEY);
//     if (!stored) return DEFAULT_ITEMS;

//     const parsed = JSON.parse(stored);
//     if (!Array.isArray(parsed)) return DEFAULT_ITEMS;

//     // 必要なら正規化（photoUrlがundefinedでも""にする等）
//     const normalized = (parsed as TimelineItem[]).map((it, index) => ({
//       ...it,
//       orderIndex: typeof it.orderIndex === "number" ? it.orderIndex : index,
//       amount: typeof it.amount === "number" ? it.amount : 0,
//       photoUrl: it.photoUrl ?? "",
//     }));

//     return normalized;
//   } catch {
//     return DEFAULT_ITEMS;
//   }
// };

// const createEmptyItem = (orderIndex: number): TimelineItem => ({
//   id:
//     typeof crypto !== "undefined" && "randomUUID" in crypto
//       ? crypto.randomUUID()
//       : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
//   time: "",
//   category: "other",
//   title: "",
//   memo: "",
//   amount: 0,
//   orderIndex,
//   photoUrl: "",
// });

// const timeToMinutes = (value: string) => {
//   if (!value) return Number.MAX_SAFE_INTEGER;
//   const [hours, mins] = value.split(":").map(Number);
//   if (Number.isNaN(hours) || Number.isNaN(mins) || hours < 0 || mins < 0) {
//     return Number.MAX_SAFE_INTEGER;
//   }
//   return hours * 60 + mins;
// };

// const loadInitialItems = (): TimelineItem[] => {
//   if (typeof window === "undefined") return DEFAULT_ITEMS;
//   try {
//     const stored = window.localStorage.getItem(TIMELINE_STORAGE_KEY);
//     if (!stored) return DEFAULT_ITEMS;
//     const parsed = JSON.parse(stored);
//     return Array.isArray(parsed) ? (parsed as TimelineItem[]) : DEFAULT_ITEMS;
//   } catch {
//     return DEFAULT_ITEMS;
//   }
// };

// const loadInitialPeople = (): number => {
//   if (typeof window === "undefined") return 2;
//   try {
//     const saved = window.localStorage.getItem(PEOPLE_STORAGE_KEY);
//     if (!saved) return 2;
//     const parsed = Number(saved);
//     return !Number.isNaN(parsed) && parsed > 0 ? parsed : 2;
//   } catch {
//     return 2;
//   }
// };

// export default function TimelineEditor() {
//   const params = useParams();
//   const itineraryId = params.id as string;
//   const router = useRouter();
//   const isClient = useIsClient();
//   const [isDesktop, showLine] = useMediaQuery(
//     ["(min-width: 961px)", "(min-width: 880px)"],
//     { fallback: [false, false] },
//   );

//   const [items, setItems] = useState<TimelineItem[]>(loadItemsFromStorage);
//   const [peopleCount, setPeopleCount] = useState<number>(2);
//   const [albumPhotos, setAlbumPhotos] = useState<string[]>([]);
//   const [sortMode, setSortMode] = useState<SortMode>("time");
//   const [activeDay, setActiveDay] = useState(0);
//   const dayTabs = [{ label: "1日目" }, { label: "2日目" }, { label: "3日目" }];
//   const didHydrateRef = useRef(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     try {
//       const stored = window.localStorage.getItem(TIMELINE_STORAGE_KEY);
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) {
//           const normalized = (parsed as TimelineItem[]).map((it) => ({
//             ...it,
//             photoUrl: it.photoUrl ?? "",
//           }));
//         }
//       }
//     } catch {}

//     try {
//       const saved = window.localStorage.getItem(PEOPLE_STORAGE_KEY);
//       if (saved) {
//         const parsed = Number(saved);
//         if (!Number.isNaN(parsed) && parsed > 0) setPeopleCount(parsed);
//       }
//     } catch {}

//     didHydrateRef.current = true;
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!didHydrateRef.current) return; // 初回読み込み前に保存しない
//     window.localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(items));
//   }, [items]);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (!didHydrateRef.current) return;
//     window.localStorage.setItem(PEOPLE_STORAGE_KEY, String(peopleCount));
//   }, [peopleCount]);

//   const sortedItems = useMemo(() => {
//     const cloned = [...items];
//     if (sortMode === "time") {
//       return cloned.sort(
//         (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time),
//       );
//     }
//     return cloned.sort((a, b) => a.orderIndex - b.orderIndex);
//   }, [items, sortMode]);

//   const { categoryTotals, totalAmount, perPersonAmount } = useMemo(() => {
//     const totals: Record<TimelineCategory, number> = {
//       move: 0,
//       meal: 0,
//       sight: 0,
//       stay: 0,
//       activity: 0,
//       shopping: 0,
//       other: 0,
//     };
//     let total = 0;
//     for (const item of items) {
//       totals[item.category] += item.amount || 0;
//       total += item.amount || 0;
//     }
//     const perPerson = peopleCount > 0 ? total / peopleCount : total;
//     return {
//       categoryTotals: totals,
//       totalAmount: total,
//       perPersonAmount: perPerson,
//     };
//   }, [items, peopleCount]);

//   const updateItem = (id: string, patch: Partial<TimelineItem>) => {
//     setItems((prev) =>
//       prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
//     );
//   };

//   const deleteItem = (id: string) => {
//     setItems((prev) => prev.filter((it) => it.id !== id));
//   };

//   const addItem = () => {
//     setItems((prev) => {
//       const nextIndex =
//         prev.length > 0 ? Math.max(...prev.map((it) => it.orderIndex)) + 1 : 0;
//       return [...prev, createEmptyItem(nextIndex)];
//     });
//   };

//   const moveItem = (id: string, direction: "up" | "down") => {
//     if (sortMode !== "manual") return;
//     setItems((prev) => {
//       const ordered = [...prev].sort((a, b) => a.orderIndex - b.orderIndex);
//       const currentIndex = ordered.findIndex((it) => it.id === id);
//       if (currentIndex === -1) return prev;

//       const targetIndex =
//         direction === "up" ? currentIndex - 1 : currentIndex + 1;
//       if (targetIndex < 0 || targetIndex >= ordered.length) return prev;

//       const current = ordered[currentIndex];
//       const target = ordered[targetIndex];

//       return prev.map((it) => {
//         if (it.id === current.id)
//           return { ...it, orderIndex: target.orderIndex };
//         if (it.id === target.id)
//           return { ...it, orderIndex: current.orderIndex };
//         return it;
//       });
//     });
//   };

//   const isEmpty = sortedItems.length === 0;

//   return (
//     <>
//       <Box
//         h="100%"
//         display="grid"
//         gridTemplateColumns={isDesktop ? "1fr 320px" : "1fr"}
//         minH={0}
//       >
//         {/* Left */}
//         <Flex
//           direction="column"
//           minH={0}
//           bg="#fdfdfc"
//           borderRight={isDesktop ? "1px solid #f1f1f0" : "none"}
//         >
//           {/* Day tabs */}
//           <HStack
//             px={4}
//             py={3}
//             gap={2} // ✅ v3はspacingではなくgap
//             overflowX="auto"
//             bg="rgba(250,250,249,0.85)"
//             borderBottom="1px solid #f1f1f0"
//           >
//             {dayTabs.map((t, idx) => {
//               const active = idx === activeDay;
//               return (
//                 <Button
//                   key={t.label}
//                   size="sm"
//                   borderRadius="full"
//                   border="1px solid"
//                   borderColor={active ? "transparent" : "#e5e7eb"}
//                   bg={active ? PRIMARY : "white"}
//                   color={active ? "white" : "#6b7280"}
//                   boxShadow={
//                     active ? "0 10px 24px rgba(14,165,233,0.26)" : "none"
//                   }
//                   onClick={() => setActiveDay(idx)}
//                   flexShrink={0}
//                 >
//                   {t.label}
//                 </Button>
//               );
//             })}
//           </HStack>

//           {/* tools */}
//           <Box
//             px={4}
//             py={2}
//             borderBottom="1px solid #f1f1f0"
//             bg="rgba(255,255,255,0.6)"
//           >
//             <SortModeToggle value={sortMode} onChange={setSortMode} />
//           </Box>

//           {/* scroll body (left only) */}
//           <Box
//             flex={1}
//             minH={0}
//             overflowY="auto"
//             px={{ base: 4, md: 5 }}
//             py={{ base: 5, md: 6 }}
//             pb={!isDesktop ? "140px" : "24px"}
//             position="relative"
//           >
//             {/* ✅ sxを使わず、必要なときだけ縦ラインBoxを描画 */}
//             {showLine && (
//               <Box
//                 position="absolute"
//                 left="58px"
//                 top="10px"
//                 bottom="10px"
//                 w="2px"
//                 bg="#e5e7eb"
//               />
//             )}

//             {isEmpty ? (
//               <Box
//                 bg="white"
//                 border="1px dashed #d1d5db"
//                 borderRadius="xl"
//                 p={6}
//                 textAlign="center"
//                 color="#6b7280"
//                 fontSize="sm"
//               >
//                 まだタイムライン項目がありません。まずは「＋」から追加してみましょう。
//               </Box>
//             ) : (
//               <Stack gap={5}>
//                 {sortedItems.map((item, index) => (
//                   <TimelineItemRow
//                     key={item.id}
//                     item={item}
//                     sortMode={sortMode}
//                     categoryOptions={CATEGORY_OPTIONS}
//                     isFirst={index === 0}
//                     isLast={index === sortedItems.length - 1}
//                     onChange={updateItem}
//                     onDelete={deleteItem}
//                     onMove={moveItem}
//                   />
//                 ))}
//               </Stack>
//             )}

//             <Box mt={4}>
//               <Button variant="outline" borderStyle="dashed" onClick={addItem}>
//                 + 項目を追加
//               </Button>
//             </Box>

//             {/* モバイル時は左下にも予算サマリー */}
//             {!isDesktop && (
//               <Box mt={4}>
//                 <Box
//                   bg="white"
//                   border="1px solid #f1f1f0"
//                   borderRadius="14px"
//                   p={4}
//                   boxShadow="0 8px 20px rgba(0,0,0,0.04)"
//                 >
//                   <Text fontWeight="700" fontSize="sm" mb={2} color="#111827">
//                     予算サマリー
//                   </Text>
//                   <TimelineSummary
//                     categoryTotals={categoryTotals}
//                     totalAmount={totalAmount}
//                     perPersonAmount={perPersonAmount}
//                     peopleCount={peopleCount}
//                     onPeopleChange={setPeopleCount}
//                     categoryMeta={SUMMARY_CATEGORY_META}
//                   />
//                 </Box>
//               </Box>
//             )}

//             <Text mt={6} fontSize="xs" color="#6b7280">
//               入力内容はブラウザのローカル（localStorage）に保存されます。
//             </Text>
//           </Box>
//         </Flex>

//         {/* Right sidebar：デスクトップのみ */}
//         {isDesktop && (
//           <Box bg="white" p={4} overflow="auto" minH={0}>
//             <Stack gap={4}>
//               {/* 予算サマリー */}
//               <Box
//                 border="1px solid #f1f1f0"
//                 borderRadius="14px"
//                 p={4}
//                 boxShadow="0 8px 20px rgba(0,0,0,0.04)"
//               >
//                 <Text fontWeight="700" fontSize="sm" mb={2} color="#111827">
//                   予算サマリー
//                 </Text>
//                 <TimelineSummary
//                   categoryTotals={categoryTotals}
//                   totalAmount={totalAmount}
//                   perPersonAmount={perPersonAmount}
//                   peopleCount={peopleCount}
//                   onPeopleChange={setPeopleCount}
//                   categoryMeta={SUMMARY_CATEGORY_META}
//                 />
//               </Box>

//               <TripAlbumCard
//                 photos={albumPhotos}
//                 onAdd={(url) => setAlbumPhotos((prev) => [url, ...prev])}
//                 onRemove={(index) =>
//                   setAlbumPhotos((prev) => prev.filter((_, i) => i !== index))
//                 }
//                 onPhotoClick={(url, index) => {
//                   console.log("clicked:", url);
//                   alert(`clicked: ${index + 1}\n${url}`);
//                 }}
//               />

//               {/* 便利ツール */}
//               <UsefulToolsCard />
//             </Stack>
//           </Box>
//         )}
//       </Box>

//       {/* Dock：モバイルのみ */}
//       {!isDesktop && (
//         <Flex
//           position="fixed"
//           left={0}
//           right={0}
//           bottom={0}
//           zIndex={20}
//           bg="rgba(255,255,255,0.96)"
//           backdropFilter="blur(10px)"
//           borderTop="1px solid #e5e7eb"
//           px={{ base: 4, md: 5 }}
//           py={3}
//           align="center"
//           justify="space-between"
//           boxShadow="0 -10px 30px rgba(0,0,0,0.08)"
//         >
//           <Button
//             variant="ghost"
//             color="#6b7280"
//             fontWeight="800"
//             onClick={() => router.push(`/print/${itineraryId}`)}
//             display="inline-flex"
//             flexDirection="column"
//             gap={1}
//           >
//             👁️ <Text fontSize="xs">保存・見る</Text>
//           </Button>

//           <Box
//             role="button"
//             tabIndex={0}
//             aria-label="予定を追加"
//             onClick={addItem}
//             w="72px"
//             h="72px"
//             borderRadius="full"
//             border="6px solid #fff"
//             bg={PRIMARY}
//             color="white"
//             fontSize="28px"
//             display="grid"
//             placeItems="center"
//             boxShadow="0 14px 34px rgba(14,165,233,0.3)"
//             cursor="pointer"
//           >
//             +
//           </Box>

//           <Button
//             variant="ghost"
//             color="#6b7280"
//             fontWeight="800"
//             onClick={() => router.push(`/share/${itineraryId}`)}
//             display="inline-flex"
//             flexDirection="column"
//             gap={1}
//           >
//             🛠️ <Text fontSize="xs">便利機能</Text>
//           </Button>
//         </Flex>
//       )}
//     </>
//   );
// }