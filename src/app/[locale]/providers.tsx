"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { EmotionRegistry } from "./emotion-registry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={theme}>{children}</ChakraProvider>
    </EmotionRegistry>
  );
}
