import React from "react";
import { cn } from "@/lib/utils";

interface TonkLogoProps {
  className?: string;
  showText?: boolean;
  theme?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

const TonkLogo: React.FC<TonkLogoProps> = ({
  className = "",
  showText = true,
  theme = "dark",
  size = "md",
}) => {
  const primaryColor = theme === "dark" ? "#06b6d4" : "#0891b2";
  const secondaryColor = theme === "dark" ? "#3b82f6" : "#2563eb";
  const textColor = theme === "dark" ? "#ffffff" : "#0f172a";

  const svgSize = size === "sm" ? "32px" : size === "md" ? "48px" : "64px";
  const titleSize =
    size === "sm"
      ? "text-lg"
      : size === "md"
        ? "text-2xl"
        : "text-3xl";
  const subtitleSize =
    size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 100 100"
        height={svgSize}
        style={{ flexShrink: 0, aspectRatio: "1 / 1" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M20 20 H45 V80 H20 V20 Z" fill={secondaryColor} style={{ opacity: 0.9 }} />
        <path d="M55 20 H80 V60 H55 V20 Z" fill={primaryColor} />
        <path d="M45 35 H55 V45 H45 V35 Z" fill="white" />
        <rect x="42" y="32" width="16" height="16" rx="1" stroke={primaryColor} strokeWidth="2" fill="none" />
        <circle cx="80" cy="20" r="3" fill="white" />
        <rect x="20" y="77" width="25" height="3" fill="white" fillOpacity="0.5" />
      </svg>

      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={cn("font-bold leading-none tracking-tight", titleSize)}
            style={{ color: textColor, fontFamily: "system-ui, sans-serif" }}
          >
            TONK
          </span>
          <span
            className={cn(
              "font-medium uppercase leading-none tracking-[0.2em] opacity-80 mt-0.5",
              subtitleSize,
            )}
            style={{ color: primaryColor }}
          >
            Solutions
          </span>
        </div>
      )}
    </div>
  );
};

export default TonkLogo;
