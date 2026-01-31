"use client";

import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";

const STEPS = [
  {
    num: "1",
    bg: "#eff6ff",
    title: "プランを作成",
    desc: "タイトルと日程を入れるだけ。1分で準備完了です。",
  },
  {
    num: "2",
    bg: "#fff7ed",
    title: "予定を追加",
    desc: "観光スポットや食事など、タイムラインで自由に編集。",
  },
  {
    num: "3",
    bg: "#ecfdf3",
    title: "共有・保存",
    desc: "URLで友達にシェア。おしゃれな画像で保存も。",
  },
];

export const HomeSteps = () => {
  return (
    <Box as="section" px={6} py={{ base: 10, md: 16 }}>
      <Box maxW="1100px" mx="auto">
        <Stack align="center" gap={2}>
          <Box
            display="inline-block"
            px={4}
            py={2}
            borderRadius="full"
            bg="white"
            border="1px solid #e7e5e4"
            color="#0ea5e9"
            fontWeight="700"
            fontSize="sm"
            boxShadow="0 10px 30px rgba(0,0,0,0.04)"
          >
            Easy Step
          </Box>

          <Heading
            as="h2"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            textAlign="center"
            color="#1f2937"
            mt={2}
          >
            ログインなしで、すぐに使えます
          </Heading>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={5} mt={8}>
          {STEPS.map((s) => (
            <Box
              key={s.num}
              bg="white"
              border="1px solid #f1f1f0"
              borderRadius="18px"
              p={6}
              textAlign="center"
              boxShadow="0 14px 40px rgba(0,0,0,0.04)"
              transition="transform 180ms ease, box-shadow 180ms ease"
              _hover={{ transform: "translateY(-6px)", boxShadow: "0 18px 60px rgba(0,0,0,0.06)" }}
            >
              <Box
                w="64px"
                h="64px"
                borderRadius="16px"
                display="grid"
                placeItems="center"
                mx="auto"
                mb={4}
                fontSize="2xl"
                fontWeight="700"
                color="#0f172a"
                bg={s.bg}
              >
                {s.num}
              </Box>
              <Text fontWeight="700" fontSize="md" mb={1} color="#1f2937">
                {s.title}
              </Text>
              <Text fontSize="sm" color="#6b7280">
                {s.desc}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
