"use client";

import { Box, Button, Flex, Text, Input } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TimelineEditor from "@/components/timeline/TimelineEditor";
import { PrintNavigationButton } from "@/components/atoms/PrintNavigationButton";
import SaveTripButton from "@/components/atoms/SaveTripButton"


const PRIMARY = "#0ea5e9";

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

  // ✅ ①② 共有URL用state
  const [shareUrl, setShareUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

const [shareUrl, setShareUrl] = useState<string>(
  typeof window !== "undefined" ? window.location.href : ""
);

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

  // ✅ ③ コピー関数（EditPage内・returnの前）
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMsg("コピーしました");
      setTimeout(() => setToastMsg(null), 1200);
    } catch {
      setToastMsg("コピーに失敗しました");
      setTimeout(() => setToastMsg(null), 1200);
    }
  };

  // ✅ 仮の短縮リンク生成（後でAPIに差し替える場所）
  const createShortLink = async () => {
    const fake = `https://example.com/s/${itineraryId.slice(0, 8)}`;
    setShortUrl(fake);
    await copyToClipboard(fake);
  };

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
        
        // 保存(プレビュー画面繊維ボタン)
          < SaveTripButton />

        // 印刷ボタン
          <PrintNavigationButton itineraryId={itineraryId} />
        
        </Flex>
      </Flex>

      {/* ✅ ④ 共有UI（ID表示の代わり） */}
      <Box px={{ base: 3, md: 5 }} pt={2}>
        <Flex align="center" gap={3} wrap="wrap">
          <Text color="#6b7280" fontSize="xs">
            共有（URL）
          </Text>

          <Button
            size="xs"
            variant="outline"
            borderRadius="full"
            onClick={() => copyToClipboard(shareUrl)}
            disabled={!shareUrl}
          >
            URLをコピー
          </Button>

          <Button
            size="xs"
            variant="outline"
            borderRadius="full"
            onClick={createShortLink}
          >
            短い共有リンクを作成
          </Button>

          <Text color="#9ca3af" fontSize="xs">
            ※内容が多くURLが長い場合（有効期限30日／期限後は閲覧不可・再発行可）
          </Text>

          {shortUrl && (
            <Text color="#6b7280" fontSize="xs">
              短縮：{shortUrl}
            </Text>
          )}

          {toastMsg && (
            <Text color="#0ea5e9" fontSize="xs" fontWeight="700">
              {toastMsg}
            </Text>
          )}
        </Flex>
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
