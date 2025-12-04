"use client";

import { useState } from "react";
import { Box, Flex, Dialog } from "@chakra-ui/react";
import { HeroHeader } from "@/components/molecules/HeroHeader";
import { HeroLeftSection } from "@/components/molecules/HeroLeftSection";
import { ItineraryPreview } from "@/components/molecules/ItineraryPreview";
import { CreateTripCard } from "@/components/organisms/CreateTripCard";

export const PlanTripHero = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Flex
        minH="100vh"
        bgGradient="linear(to-br, #fdf6e3, #f2fbff)"
        px={{ base: 4, md: 10 }}
        py={{ base: 8, md: 16 }}
        align="center"
        justify="center"
      >
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
          <HeroHeader />

          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 8, md: 10 }}
          >
            <HeroLeftSection onCreateClick={() => setOpen(true)} />
            <ItineraryPreview />
          </Flex>
        </Box>
      </Flex>

      {/* 作成カードモーダル */}
      <Dialog.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
        size="lg"
        placement="center"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <CreateTripCard />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};
