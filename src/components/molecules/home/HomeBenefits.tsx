"use client";

import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";

type HomeBenefitsProps = {
  onLoginClick?: () => void;
};

const BENEFITS = [
  {
    title: "クラウドに保存",
    desc: "作成したしおりをいつでもどこでも確認・編集できます。",
  },
  {
    title: "旅の足跡マップ",
    desc: "訪れた都道府県が色付いていきます。全国制覇を目指そう。",
  },
  {
    title: "思い出のアルバム",
    desc: "旅の写真を無制限に保存。いつでも見返せます。",
  },
];

export const HomeBenefits = ({ onLoginClick }: HomeBenefitsProps) => {
  return (
    <Box as="section" px={6} py={{ base: 10, md: 16 }}>
      <Box
        maxW="1100px"
        mx="auto"
        bg="#f5f5f4"
        borderRadius="28px"
        p={{ base: 6, md: 10 }}
      >
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }}
          gap={{ base: 8, md: 10 }}
          alignItems="center"
        >
          {/* 左 */}
          <Box>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              color="#111827"
              lineHeight={1.3}
              mb={4}
            >
              ログインすると、
              <br />
              もっと便利に。
            </Heading>

            <Stack gap={4}>
              {BENEFITS.map((b) => (
                <HStack key={b.title} align="flex-start" gap={3}>
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="10px"
                    bg="#e0f2fe"
                    display="grid"
                    placeItems="center"
                    color="#0ea5e9"
                    fontWeight="700"
                  >
                    ✓
                  </Box>
                  <Box>
                    <Text fontWeight="700" color="#111827" mb={1}>
                      {b.title}
                    </Text>
                    <Text fontSize="sm" color="#6b7280">
                      {b.desc}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </Stack>

            <Button
              mt={6}
              px={6}
              py={5}
              borderRadius="12px"
              bg="#1f2937"
              color="white"
              fontWeight="700"
              _hover={{ bg: "#111827", transform: "translateY(-1px)" }}
              onClick={onLoginClick}
            >
              ログインして始める
            </Button>
          </Box>

          {/* 右：画像 */}
          <Box justifySelf="center" maxW="460px">
            <Box
              bg="white"
              borderRadius="20px"
              p={3}
              boxShadow="0 20px 50px rgba(0,0,0,0.08)"
              transform="rotate(3deg)"
            >
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
                alt="旅の地図イメージ"
                borderRadius="14px"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
