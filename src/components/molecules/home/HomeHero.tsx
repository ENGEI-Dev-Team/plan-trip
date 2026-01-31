"use client";

import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";

type HomeHeroProps = {
  onCreateClick: () => void;
};

export const HomeHero = ({ onCreateClick }: HomeHeroProps) => {
  return (
    <Box
      as="header"
      position="relative"
      height={{ base: "62vh", md: "70vh" }}
      display="grid"
      placeItems="center"
      textAlign="center"
      overflow="hidden"
    >
      {/* 背景画像 layer */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage='url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop")'
        backgroundPosition="center"
        backgroundSize="cover"
        opacity={0.8}
        filter="saturate(1.05)"
      />

      {/* グラデ overlay */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-b, rgba(28,25,23,0.35) 0%, rgba(28,25,23,0.12) 55%, #fafaf9 95%)"
      />

      {/* 中身 */}
      <Box position="relative" zIndex={1} px={6} pt={12} pb={8} maxW="720px">
        <Box
          display="inline-block"
          px={4}
          py={2}
          borderRadius="10px"
          bg="#dbeafe"
          color="#0f172a"
          fontWeight="700"
          fontSize="sm"
          mb={4}
        >
          旅のしおりを、すぐに。
        </Box>

        <Heading
          as="h1"
          color="white"
          fontWeight="700"
          lineHeight={1.2}
          letterSpacing="0.02em"
          textShadow="0 4px 18px rgba(0,0,0,0.32)"
          fontSize={{ base: "3xl", md: "5xl" }}
          mb={4}
        >
          旅のしおりを、
          <br />
          もっと自由に。
        </Heading>

        <Text
          color="whiteAlpha.900"
          fontWeight="500"
          fontSize={{ base: "md", md: "lg" }}
          textShadow="0 4px 18px rgba(0,0,0,0.28)"
          mb={8}
        >
          会員登録なしですぐに作成。旅の計画から思い出の保存まで、これひとつで。
        </Text>

        <Button
          borderRadius="full"
          px={{ base: 10, md: 12 }}
          py={{ base: 6, md: 7 }}
          fontWeight="700"
          fontSize={{ base: "md", md: "lg" }}
          bg="white"
          color="#1f2937"
          boxShadow="0 18px 40px rgba(14,165,233,0.25)"
          _hover={{
            transform: "translateY(-2px) scale(1.01)",
            boxShadow: "0 14px 30px rgba(14,165,233,0.22)",
            bg: "whiteAlpha.950",
          }}
          onClick={onCreateClick}
        >
          しおりを作る（無料）
        </Button>
      </Box>
    </Box>
  );
};
