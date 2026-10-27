import React from 'react';
import Image from 'next/image';

type TonkLogoVariant = 'horizontal' | 'apilado';

interface TonkLogoProps {
  /** Lockup orientation. Header uses `horizontal`; footer uses `apilado`. */
  variant?: TonkLogoVariant;
  className?: string;
  /** Rendered height in px. Width follows the lockup aspect ratio. */
  height?: number;
  /** Set on above-the-fold usage (header). */
  priority?: boolean;
}

/**
 * Brand lockups from `public/brand/`.
 *
 * The `*-oscuro` variants are the ones made for dark backgrounds: graphite
 * (#17191C) plate, light wordmark (#E8EAED) and a mint detail (#3DF5C8).
 *
 * `next/image` is used with `unoptimized`: the lockups are static SVGs the
 * optimizer would reject, so the source is served as-is from `public/` while
 * the component still gets the layout reservation and the `priority` preload.
 */
const LOCKUPS = {
  horizontal: {
    src: '/brand/tonk-lockup-horizontal-oscuro.svg',
    width: 520,
    height: 192,
  },
  apilado: {
    src: '/brand/tonk-lockup-apilado-oscuro.svg',
    width: 305,
    height: 336,
  },
} as const satisfies Record<TonkLogoVariant, { src: string; width: number; height: number }>;

const TonkLogo: React.FC<TonkLogoProps> = ({
  variant = 'horizontal',
  className = '',
  height = 40,
  priority = false,
}) => {
  const lockup = LOCKUPS[variant];
  const width = Math.round((height * lockup.width) / lockup.height);

  return (
    <Image
      src={lockup.src}
      alt="Tonk Solutions"
      width={width}
      height={height}
      unoptimized
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={{
        display: 'block',
        height: `${height}px`,
        width: 'auto',
      }}
    />
  );
};

export default TonkLogo;
