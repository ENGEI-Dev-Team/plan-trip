"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Noto_Sans_JP } from "next/font/google";
import { useParams, useRouter } from "next/navigation";
import { PrintNavigationButton } from "@/components/atoms/PrintNavigationButton";
import TimelineEditor from "@/components/timeline/TimelineEditor";

const PRIMARY = "#0ea5e9";
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin", "japanese"],
  weight: ["400", "700"],
  display: "swap",
});

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

  /* =========================
     共有URL関連（state不要）
     ========================= */
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  /* =========================
     Day tabs
     ========================= */
  const days = useMemo<DayTab[]>(() => {
    const built = buildDays(startDate, endDate);
    if (built.length > 0) return built;

    // フォールバック
    return [
      { index: 0, dateStr: "day-1", label: "1日目" },
      { index: 1, dateStr: "day-2", label: "2日目" },
      { index: 2, dateStr: "day-3", label: "3日目" },
    ];
  }, [startDate, endDate]);

  const maxDayIndex = Math.max(days.length - 1, 0);
  const activeDayIndexSafe = Math.min(activeDayIndex, maxDayIndex);

  /* =========================
     utils
     ========================= */
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
          fontFamily={notoSansJP.style.fontFamily}
          fontWeight="700"
          onClick={() => router.push("/")}
          flexShrink={0}
        >
          ← ホームへ
        </Button>

        <Box minW={0} flex={1}>
          <Text fontWeight="700" fontSize="md" noOfLines={1}>
            旅のしおりを編集
          </Text>
        </Box>

        <Flex align="center" gap={2}>
          <Button
            size="xs"
            variant="outline"
            borderRadius="full"
            onClick={() => copyToClipboard(shareUrl)}
            disabled={!shareUrl}
          >
            URLをコピー
          </Button>
        </Flex>
      </Box>

      {/* content */}
      <Box flex={1} minH={0}>
        <TimelineEditor
          days={days}
          activeDayIndex={activeDayIndexSafe}
          onActiveDayChange={(i) =>
            setActiveDayIndex(Math.min(i, maxDayIndex))
          }
        />
      </Box>
    </Flex>
  );
}