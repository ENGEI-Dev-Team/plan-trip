"use client";

import { Tag } from "@chakra-ui/react";

type AppTagProps = {
  children: React.ReactNode;
  colorPalette?: string;
  size?: "sm" | "md" | "lg";
  variant?: "surface" | "solid" | "subtle";
};

export const AppTag = ({
  children,
  colorPalette = "teal",
  size = "sm",
  variant = "surface",
}: AppTagProps) => (
  <Tag.Root colorPalette={colorPalette} size={size} variant={variant}>
    <Tag.Label>{children}</Tag.Label>
  </Tag.Root>
);
