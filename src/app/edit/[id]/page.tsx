"use client";

import { Box, Button, Flex, Text, Input } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TimelineEditor from "@/components/timeline/TimelineEditor";
import type { DayTab } from "@/types/dayTab";

const PRIMARY = "#0ea5e9";

// ✅ 日付タブ生成（YYYY-MM-DD）
function parseYmd(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function formatMD(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function buildDays(startYmd: string, endYmd: string): DayTab[] {
  if (!startYmd || !endYmd) return [];
  const start = parseYmd(startYmd);
  const end = parseYmd(endYmd);
  if (end < start) return [];

  const out: DayTab[] = [];
  const cur = new Date(start);
  let i = 0;

  while (cur <= end) {
    out.push({
      index: i,
      dateStr: toYmd(cur),
      label: `${i + 1}日目 ${formatMD(cur)}`,
    });
    cur.setDate(cur.getDate() + 1);
    i++;
    if (i > 60) break;
  }
  return out;
}

export default function EditPage() {
  const params = useParams();
  const itineraryId = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(
    () => searchParams.get("title") ?? "旅のタイムラインを編集",
  );
  const [prefecture] = useState(() => searchParams.get("pref") ?? "東京都");

  const [startDate] = useState(() => searchParams.get("start") ?? "");
  const [endDate] = useState(() => searchParams.get("end") ?? "");

  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const days = useMemo<DayTab[]>(() => {
    const built = buildDays(startDate, endDate);
    if (built.length > 0) return built;

    return [
      { index: 0, dateStr: "day-1", label: "1日目" },
      { index: 1, dateStr: "day-2", label: "2日目" },
      { index: 2, dateStr: "day-3", label: "3日目" },
    ];
  }, [startDate, endDate]);

  const maxDayIndex = Math.max(days.length - 1, 0);
  const activeDayIndexSafe = Math.min(activeDayIndex, maxDayIndex);

  return (
    <Flex direction="column" h="100vh" bg="#f8f8f7" color="#1f2937">
      {/* header */}
      <Flex
        as="header"
        position="sticky"
        top={0}
        zIndex={10}
        bg="rgba(255,255,255,0.92)"
        backdropFilter="blur(8px)"
        borderBottom="1px solid"
        borderColor="#e5e7eb"
        px={{ base: 3, md: 5 }}
        py={2}
        align="center"
        justify="space-between"
        boxShadow="0 2px 14px rgba(0,0,0,0.04)"
        gap={3}
        role="group"
      >
        <Button
          size="sm"
          variant="solid"
          bg="#f3f4f6"
          color="#374151"
          borderRadius="full"
          _hover={{ bg: "#e5e7eb" }}
          onClick={() => router.push("/")}
          flexShrink={0}
        >
          ← ホームへ
        </Button>

        {/* title center */}
        <Box
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          maxW="520px"
          w="70%"
          px={2}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            textAlign="center"
            fontWeight="800"
            border="none"
            bg="transparent"
            _focusVisible={{ outline: "none" }}
            placeholder="旅行タイトル"
          />
        </Box>

        {/* right */}
        <Flex align="center" gap={2} flexShrink={0} ml="auto">
          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg="rgba(14,165,233,0.1)"
            color={PRIMARY}
            fontWeight="800"
            fontSize="sm"
            whiteSpace="nowrap"
          >
            {prefecture}
          </Box>

          <Button
            size="sm"
            borderRadius="full"
            fontWeight="900"
            color="white"
            px={4}
            background="conic-gradient(from 180deg at 50% 50%, #00E5FF, #7C3AED, #FF00CC, #FF3D00, #FFEA00, #7CFF00, #00FF85, #00E5FF)"
            boxShadow="0 14px 34px rgba(0,0,0,0.22)"
            _hover={{
              transform: "translateY(-1px) scale(1.02)",
              boxShadow: "0 18px 44px rgba(0,0,0,0.28)",
            }}
            _active={{ transform: "translateY(0px) scale(0.99)" }}
            onClick={() => router.push(`/print/${itineraryId}`)}
          >
            できた！
          </Button>
        </Flex>
      </Flex>

      {/* meta */}
      <Box px={{ base: 3, md: 5 }} pt={2}>
        <Text color="#6b7280" fontSize="xs">
          ID: {itineraryId.slice(0, 8)}…
        </Text>
      </Box>

      {/* content */}
      <Box flex={1} minH={0}>
        <TimelineEditor
          days={days}
          activeDayIndex={activeDayIndexSafe}
          onActiveDayChange={(i) => setActiveDayIndex(Math.min(i, maxDayIndex))}
        />
      </Box>
    </Flex>
  );
}