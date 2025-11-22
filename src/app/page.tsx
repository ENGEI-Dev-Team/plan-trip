"use client";

import {
  Box,
  Flex,
  Stack,
  Text,
  Heading,
  Button,
  HStack,
  Tag,
  Separator,
} from "@chakra-ui/react";

import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* 背景全体：空＋砂浜っぽいグラデーション */}
      <Flex
        minH="100vh"
        bgGradient="linear(to-br, #fdf6e3, #f2fbff)"
        px={{ base: 4, md: 10 }}
        py={{ base: 8, md: 16 }}
        align="center"
        justify="center"
      >
        {/* 中央のカード */}
        <Box
          w="100%"
          maxW="1000px"
          borderRadius="2xl"
          border="1px solid"
          borderColor="blackAlpha.100"
          bg="white"
          boxShadow="0 18px 45px rgba(15, 23, 42, 0.08)"
          px={{ base: 5, md: 10 }}
          py={{ base: 7, md: 10 }}
        >
          {/* 上部ヘッダー行 */}
          <HStack justify="space-between" align="center" mb={{ base: 6, md: 8 }}>
            <HStack gap={3}>
              <Box
                px={3}
                py={1}
                borderRadius="full"
                bg="teal.500"
                color="white"
                boxShadow="0 4px 10px rgba(45, 212, 191, 0.5)"
                fontWeight="bold"
                fontSize="sm"
              >
                PlanTrip
              </Box>

              {/* Tag v3（Root + Label） */}
              <Tag.Root
                size="sm"
                borderRadius="full"
                colorPalette="teal"
                variant="surface"
              >
                <Tag.Label>旅のしおりメーカー</Tag.Label>
              </Tag.Root>
            </HStack>

            <Text fontSize="xs" color="gray.500">
              みんなで旅程を整えて、同じしおりでおでかけしよう
            </Text>
          </HStack>

          {/* メイン2列レイアウト */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 8, md: 10 }}
          >
            {/* 左：テキスト & CTA */}
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

              {/* CTA */}
              <Stack gap={3}>
                <Link href="/edit">
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
                  >
                    旅行プラン作成をはじめる
                  </Button>
                </Link>

                <Text fontSize="xs" color="gray.500">
                  入力は4つだけ（タイトル・都道府県・開始日・終了日）。
                  ログインなしでお試しできます。
                </Text>
              </Stack>

              {/* タグ（Tag.Root 使用） */}
              <HStack
                gap={3}
                pt={2}
                flexWrap="wrap"
                fontSize="xs"
                color="gray.600"
              >
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

            {/* 右：しおりプレビュー */}
            <Box
              flex="0.9"
              borderRadius="xl"
              bgGradient="linear(to-br, #fefcf7, #e6fbff)"
              border="1px solid"
              borderColor="teal.50"
              p={5}
              position="relative"
              overflow="hidden"
            >
              {/* 装飾の円 */}
              <Box
                position="absolute"
                top="-40px"
                right="-40px"
                w="120px"
                h="120px"
                bg="teal.100"
                opacity={0.4}
                borderRadius="full"
              />
              <Box
                position="absolute"
                bottom="-50px"
                left="-30px"
                w="130px"
                h="130px"
                bg="orange.100"
                opacity={0.4}
                borderRadius="3xl"
                transform="rotate(-8deg)"
              />

              {/* プレビュー中身 */}
              <Box position="relative">
                <Text fontSize="xs" color="gray.500">
                  サンプルしおり
                </Text>

                <Heading
                  as="h2"
                  fontSize="lg"
                  mt={2}
                  mb={1}
                  color="gray.800"
                >
                  春の京都 2泊3日 食べ歩き旅
                </Heading>

                <Text fontSize="xs" color="gray.600">
                  2025/03/20 – 03/22 ・ 京都府
                </Text>

                <Separator my={4} />

                <Stack gap={3} fontSize="sm" color="gray.700">
                  <Box>
                    <Text fontSize="xs" color="teal.600" fontWeight="medium">
                      DAY 1｜伏見稲荷と祇園さんぽ
                    </Text>
                    <Text>京都駅 → 伏見稲荷大社 → 祇園散策 → 夜ごはん</Text>
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="teal.600" fontWeight="medium">
                      DAY 2｜清水寺と町家カフェ
                    </Text>
                    <Text>清水寺 → 三年坂・二年坂 → 町家カフェ → 錦市場</Text>
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="teal.600" fontWeight="medium">
                      DAY 3｜嵐山でゆったり
                    </Text>
                    <Text>嵐山散策 → ランチ → おみやげ → 帰路へ</Text>
                  </Box>
                </Stack>

                <Separator my={4} />

                <HStack
                  justify="space-between"
                  fontSize="xs"
                  color="gray.600"
                >
                  <Text>参加メンバー：3人</Text>
                  <Text>共有：URL / 画像 / 印刷</Text>
                </HStack>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </main>
  );
}