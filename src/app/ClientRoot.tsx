"use client";

import React from "react";
import { ChakraProviderWrapper } from "./ChakraProviderWrapper";

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChakraProviderWrapper>{children}</ChakraProviderWrapper>;
}
