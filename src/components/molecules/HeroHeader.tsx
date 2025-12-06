"use client";

import { Box, HStack, Tag, Text } from "@chakra-ui/react";

export const HeroHeader = () => {
  return (
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
  );
};
