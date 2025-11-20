"use client";
import { HeroSection } from "../components/organisms/HeroSection";
import { CreateTripCard } from "@/components/organisms/CreateTripCard";
import { Box, Container, Stack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box as="main" py={8}>
      <Container maxW="4xl">
        <Stack gap={8}>
          <HeroSection onCreateClick={() => {
            // Heroのボタンからも「作成カード」位置にスクロールさせたい場合などに使える
            const el = document.getElementById("create-trip-card");
            el?.scrollIntoView({ behavior: "smooth" });
          }} />
          <Box id="create-trip-card">
            <CreateTripCard />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
