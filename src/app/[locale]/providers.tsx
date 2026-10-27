"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { domAnimation, LazyMotion } from "framer-motion";
import theme from "../theme";
import { EmotionRegistry } from "./emotion-registry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={theme}>
        {/*
          One shared animation feature bundle for the whole app: every animated
          element is an `m.*` component, so framer-motion loads `domAnimation`
          once instead of pulling a feature set per `motion.*` component.
          `strict` makes a stray `motion.*` fail loudly instead of silently
          re-adding the heavy bundle.
        */}
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </ChakraProvider>
    </EmotionRegistry>
  );
}
