"use client";

import { useState } from "react";
import { Box, Dialog } from "@chakra-ui/react";

import { CreateTripCard } from "@/components/organisms/CreateTripCard";
import { HomeHero } from "@/components/molecules/home/HomeHero";
import { HomeSteps } from "@/components/molecules/home/HomeSteps";


export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <Box bg="#fafaf9" minH="100vh">
      <HomeHero onCreateClick={() => setOpen(true)} />
      <HomeSteps />

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
    </Box>
  );
}
