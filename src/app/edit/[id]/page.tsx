
"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { PrintNavigationButton } from "@/components/atoms/PrintNavigationButton";
import TimelineEditor from "@/components/timeline/TimelineEditor";

export default function EditPage() {
  const params = useParams();
  const itineraryId = params.id as string;
  const router = useRouter();

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="6xl">
        <Stack
          spacing={6}
          borderRadius="2xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          bg="white"
          boxShadow="0 18px 40px rgba(15, 23, 42, 0.08)"
          p={{ base: 6, md: 8 }}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            gap={4}
          >
            <Stack spacing={2}>
              <Badge
                variant="subtle"
                colorPalette="teal"
                alignSelf="flex-start"
              >
                Editing
              </Badge>
              <Heading size="lg" color="gray.800">
                旅のタイムラインを編集
              </Heading>
              <Text color="gray.600">
                時間順/任意順の切り替えや費用集計、自動保存を使ってしおりを整えましょう。
              </Text>
              <Text fontSize="sm" color="gray.500">
                プレビューや共有が必要になったら右上の印刷ボタンから確認できます。
              </Text>
            </Stack>
            <Flex gap={3} align="center">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                size="sm"
              >
                ホームへ戻る
              </Button>
              <PrintNavigationButton itineraryId={itineraryId} />
            </Flex>
          </Flex>

          <Box
            borderRadius="xl"
            border="1px solid"
            borderColor="blackAlpha.100"
            bg="gray.900"
            color="white"
            px={{ base: 4, md: 6 }}
            py={{ base: 5, md: 6 }}
          >
            <TimelineEditor />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
