// src/app/layout.tsx
import type { Metadata } from "next";
import { ChakraProviderWrapper } from "./ChakraProviderWrapper";

export const metadata: Metadata = {
  title: "PlanTrip",
  description: "旅行しおりアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* ここでは Chakra は使わず、ラッパーに全部任せる */}
        <ChakraProviderWrapper>{children}</ChakraProviderWrapper>
      </body>
    </html>
  );
}
