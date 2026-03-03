"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { LazyMotion, domAnimation } from "framer-motion";
import theme from "./theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <ChakraProvider value={theme}>
        {children}
      </ChakraProvider>
    </LazyMotion>
  );
}
