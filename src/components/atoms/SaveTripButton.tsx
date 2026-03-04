"use client";

import { Button } from "@chakra-ui/react";

type Props = {
  onClick?: () => void;
};

export default function SaveTripButton({ onClick }: Props) {
  return (
    <Button
      size="sm"
      borderRadius="full"
      fontWeight="900"
      color="white"
      px={4}
      background="conic-gradient(from 180deg at 50% 50%, #00E5FF, #7C3AED, #FF00CC, #FF3D00, #FFEA00, #7CFF00, #00FF85, #00E5FF)"
      boxShadow="0 12px 26px rgba(0,0,0,0.18)"
      border="1px solid rgba(255,255,255,0.35)"
      _hover={{
        transform: "translateY(-1px) scale(1.02)",
        boxShadow: "0 16px 34px rgba(0,0,0,0.22)",
      }}
      _active={{ transform: "translateY(0px) scale(0.99)" }}
      onClick={onClick ?? (() =>
        window.dispatchEvent(new CustomEvent("tripbook:test-save"))
      )}
    >
      できた！
    </Button>
  );
}