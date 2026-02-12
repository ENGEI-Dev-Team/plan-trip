"use client";

import dynamic from "next/dynamic";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { PrintNavigationButton } from "@/components/atoms/PrintNavigationButton";

const TimelineEditor = dynamic(
  () => import("@/components/timeline/TimelineEditor"),
  { ssr: false }
);

export default function EditPage() {
  const params = useParams();
  const itineraryId = params.id as string;
  const router = useRouter();

  return (
    <Flex direction="column" h="100vh" bg="#f8f8f7" color="#1f2937">
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
          bg="#f3f4f6"
          color="#374151"
          borderRadius="full"
          _hover={{ bg: "#e5e7eb" }}
          onClick={() => router.push("/")}
        >
          ← ホームへ
        </Button>

        <Box
          position="absolute"
          left={0}
          right={0}
          textAlign="center"
          pointerEvents="none"
          px={{ base: 14, md: 20 }}
        >
          <Text fontWeight="800" fontSize="md" lineHeight="1.1">
            京都紅葉めぐり
          </Text>
          <Text color="#6b7280" fontSize="sm" lineHeight="1.1">
            2023-11-20 〜 2023-11-21
          </Text>
        </Box>

        <Flex align="center" gap={2}>
          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg="#e0f2fe"
            color="#0369a1"
            fontWeight="800"
            fontSize="sm"
            whiteSpace="nowrap"
          >
            京都府
          </Box>
          <PrintNavigationButton itineraryId={itineraryId} />
        </Flex>
      </Flex>

      <Box flex={1} minH={0}>
        <TimelineEditor />
      </Box>
    </Flex>
  );
}
