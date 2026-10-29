import type { ReactNode } from "react";
import { Providers } from "../../providers";
import { EmotionRegistry } from "./emotion-registry";

/**
 * Chakra sigue montado únicamente en el detalle de servicio (spec S15). La home
 * usa CSS Modules y no necesita Emotion: montarlo ahí provocaba un mismatch de
 * hidratación por el `<style>` global que Emotion inyecta en el body.
 */
export default function ServiceDetailLayout({ children }: { children: ReactNode }) {
  return (
    <EmotionRegistry options={{ key: "css" }}>
      <Providers>{children}</Providers>
    </EmotionRegistry>
  );
}
