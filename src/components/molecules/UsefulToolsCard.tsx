"use client";

import { Box, Button, Stack, Text } from "@chakra-ui/react";

type UsefulToolsCardProps = {
  onAddToCalendar?: () => void;
  onCreateShareLink?: () => void;
  onOfflineSave?: () => void;
};

export function UsefulToolsCard({
  onAddToCalendar,
  onCreateShareLink,
  onOfflineSave,
}: UsefulToolsCardProps) {
  return (
    <Box
      border="1px solid #f1f1f0"
      borderRadius="14px"
      p={4}
      boxShadow="0 8px 20px rgba(0,0,0,0.04)"
      bg="white"
    >
      <Stack gap={3}>
        <Text fontWeight="700" fontSize="sm" color="#111827">
          便利ツール
        </Text>

        <Stack gap={2}>
          <Button
            variant="outline"
            justifyContent="flex-start"
            borderRadius="10px"
            bg="#fafafa"
            borderColor="#e5e7eb"
            color="#374151"
            _hover={{ bg: "#f1f5f9" }}
            onClick={onAddToCalendar ?? (() => alert("カレンダーに追加（仮）"))}
          >
            カレンダーに追加
          </Button>

          <Button
            variant="outline"
            justifyContent="flex-start"
            borderRadius="10px"
            bg="#fafafa"
            borderColor="#e5e7eb"
            color="#374151"
            _hover={{ bg: "#f1f5f9" }}
            onClick={
              onCreateShareLink ?? (() => alert("共有リンクを作成（仮）"))
            }
          >
            共有リンクを作成
          </Button>

          <Button
            variant="outline"
            justifyContent="flex-start"
            borderRadius="10px"
            bg="#fafafa"
            borderColor="#e5e7eb"
            color="#374151"
            _hover={{ bg: "#f1f5f9" }}
            onClick={onOfflineSave ?? (() => alert("オフライン保存（仮）"))}
          >
            オフライン保存
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
