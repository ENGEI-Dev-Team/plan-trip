"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { PrintNavigationButton } from "@/components/atoms/PrintNavigationButton";
import TimelineEditor from "@/components/timeline/TimelineEditor";

const PRIMARY = "#0ea5e9";

export default function EditPage() {
  const params = useParams();
  const itineraryId = params.id as string;
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
          onClick={() => router.push("/")}
        >
          ← ホームへ
        </Button>

        <Box minW={0} flex={1}>
          <Text fontWeight="700" fontSize="md" noOfLines={1}>
            旅のタイムラインを編集
          </Text>
          <Text color="#6b7280" fontSize="sm" noOfLines={1}>
            ID: {itineraryId.slice(0, 8)}…
          </Text>
        </Box>

        <Flex align="center" gap={2}>
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
            Editing
          </Box>
          <Button
            size="sm"
            colorPalette="blue"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("tripbook:test-save"))
            }
          >
            保存テスト
          </Button>
          <PrintNavigationButton itineraryId={itineraryId} />
        </Flex>
      </Flex>

      {/* content */}
      <Box flex={1} minH={0}>
        <TimelineEditor />
      </Box>
    </Flex>
  );
}
