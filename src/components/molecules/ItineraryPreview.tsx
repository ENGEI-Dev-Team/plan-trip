"use client";

import {
  Box,
  Heading,
  HStack,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";

export const ItineraryPreview = () => {
  return (
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

      <Box position="relative">
        <Text fontSize="xs" color="gray.500">
          サンプルしおり
        </Text>

        <Heading as="h2" fontSize="lg" mt={2} mb={1} color="gray.800">
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

        <HStack justify="space-between" fontSize="xs" color="gray.600">
          <Text>参加メンバー：3人</Text>
          <Text>共有：URL / 画像 / 印刷</Text>
        </HStack>
      </Box>
    </Box>
  );
};
