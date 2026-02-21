"use client";

import { Button, Heading, HStack, Stack, Tag, Text } from "@chakra-ui/react";

type HeroLeftSectionProps = {
  onCreateClick?: () => void;
};

export const HeroLeftSection = ({ onCreateClick }: HeroLeftSectionProps) => {
  return (
    <Stack gap={5} flex="1">
      <Heading
        as="h1"
        fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        lineHeight={1.3}
        color="gray.800"
      >
        1分でつくれる、
        <br />
        やさしい旅行しおり
      </Heading>

      <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
        行き先と日付を入力するだけで、旅の予定がすっきりまとまります。
        <br />
        URL・画像・印刷の3パターンで、友だちや家族と同じしおりを共有できます。
      </Text>

      <Stack gap={3}>
        <Button
          borderRadius="full"
          size="lg"
          w={{ base: "100%", md: "auto" }}
          px={8}
          fontWeight="semibold"
          bg="orange.300"
          color="white"
          boxShadow="0 14px 30px rgba(248, 180, 80, 0.55)"
          _hover={{
            bg: "orange.400",
            boxShadow: "0 18px 36px rgba(248, 180, 80, 0.7)",
            transform: "translateY(-1px)",
          }}
          _active={{
            bg: "orange.400",
            boxShadow: "0 8px 20px rgba(248, 180, 80, 0.5)",
            transform: "translateY(0)",
          }}
          onClick={onCreateClick}
        >
          旅行プラン作成をはじめる
        </Button>

        <Text fontSize="xs" color="gray.500">
          入力は4つだけ（タイトル・都道府県・開始日・終了日）。
          ログインなしでお試しできます。
        </Text>
      </Stack>

      <HStack gap={3} pt={2} flexWrap="wrap" fontSize="xs" color="gray.600">
        <Tag.Root colorPalette="teal" size="sm" variant="surface">
          <Tag.Label>スマホ / PC 両対応</Tag.Label>
        </Tag.Root>

        <Tag.Root colorPalette="blue" size="sm" variant="surface">
          <Tag.Label>オフライン下書き保存</Tag.Label>
        </Tag.Root>

        <Tag.Root colorPalette="pink" size="sm" variant="surface">
          <Tag.Label>共有用の短縮URL</Tag.Label>
        </Tag.Root>
      </HStack>
    </Stack>
  );
};
