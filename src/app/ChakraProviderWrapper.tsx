// src/app/ChakraProviderWrapper.tsx
"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function ChakraProviderWrapper({ children }: Props) {
  // QueryClient は 1 回だけ生成して使い回す
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraProvider>
  );
}
