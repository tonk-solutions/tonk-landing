"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { ClientOnly } from "@/components/ClientOnly";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <ChakraProvider value={theme}>
        {children}
      </ChakraProvider>
    </ClientOnly>
  );
}
