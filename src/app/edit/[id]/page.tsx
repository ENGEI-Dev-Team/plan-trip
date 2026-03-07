"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Noto_Sans_JP } from "next/font/google";
import {  useRouter } from "next/navigation";
import TimelineEditor from "@/components/timeline/TimelineEditor";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function EditPage() {
  const router = useRouter();

  return (
    <Flex direction="column" h="100vh" bg="#f8f8f7" color="#1f2937">
      {/* sticky header */}
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
        >
          ← ホームへ
        </Button>

        <Box minW={0} flex={1}>
          <Text fontWeight="700" fontSize="md" lineClamp={1}>
            旅のしおりを編集
          </Text>
        </Box>

        <Flex align="center" gap={2}>
          <Button
            size="sm"
            colorPalette="blue"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("tripbook:test-save"))
            }
          >
            保存テスト
          </Button>
        </Flex>
      </Flex>

      {/* content */}
      <Box flex={1} minH={0}>
        <TimelineEditor />
      </Box>
    </Flex>
  );
}
