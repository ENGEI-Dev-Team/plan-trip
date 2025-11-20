"use client";

import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";

interface HeroSectionProps {
  onCreateClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCreateClick }) => {
  return (
    <Box as="section" py={8}>
      <Stack gap={4}>
        <Heading as="h1" size="xl">
          1分で作れる、旅のしおり
        </Heading>
        <Text color="gray.600">
          複数人旅行の予定をまとめて、URLと三つ折り印刷でみんなに配れるWebしおりアプリです。
        </Text>
        <Button
          colorScheme="teal"
          size="lg"
          alignSelf={{ base: "stretch", md: "flex-start" }}
          onClick={onCreateClick}
        >
          旅行プラン作成
        </Button>
      </Stack>
    </Box>
  );
};
