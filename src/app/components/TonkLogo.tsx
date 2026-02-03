"use client";

import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface TonkLogoProps {
  className?: string;
  showText?: boolean;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | string;
}

const TonkLogo: React.FC<TonkLogoProps> = ({ 
  className = "", 
  showText = true, 
  theme = "dark",
  size = "md"
}) => {
  // Colors based on theme
  const primaryColor = theme === 'dark' ? '#06b6d4' : '#0891b2'; // Cyan
  const secondaryColor = theme === 'dark' ? '#3b82f6' : '#2563eb'; // Blue
  const textColor = theme === 'dark' ? '#ffffff' : '#0f172a'; // White/Slate

  // Calculate sizes based on the size prop
  const getSize = () => {
    if (size === 'sm') return '32px';
    if (size === 'md') return '48px';
    if (size === 'lg') return '64px';
    return size;
  };

  return (
    <Flex alignItems="center" gap="3" className={className}>
      {/* Isotype / Icon */}
      <svg viewBox="0 0 100 100" height={getSize()} width="auto" style={{ flexShrink: 0 }} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Pillar (Legacy/Stability) - Blue */}
        <path d="M20 20 H45 V80 H20 V20 Z" fill={secondaryColor} style={{ opacity: 0.9 }} />

        {/* Right Pillar (Future/Cloud) - Cyan */}
        <path d="M55 20 H80 V60 H55 V20 Z" fill={primaryColor} />

        {/* The Bridge / Spark (Connection) */}
        <path d="M45 35 H55 V45 H45 V35 Z" fill="white" />
        <rect x="42" y="32" width="16" height="16" rx="1" stroke={primaryColor} strokeWidth="2" fill="none" />

        {/* Tech Accents */}
        <circle cx="80" cy="20" r="3" fill="white" />
        <rect x="20" y="77" width="25" height="3" fill="white" fillOpacity="0.5" />
      </svg>

      {/* Logotype */}
      {showText && (
        <Flex flexDirection="column" justifyContent="center">
          <Text 
            fontWeight="bold" 
            fontSize={size === 'sm' ? 'lg' : size === 'md' ? '2xl' : '3xl'} 
            letterSpacing="tight" 
            lineHeight="none" 
            color={textColor}
            fontFamily="system-ui, sans-serif"
          >
            TONK
          </Text>
          <Text 
            fontSize={size === 'sm' ? '2xs' : size === 'md' ? 'xs' : 'sm'} 
            fontWeight="medium" 
            letterSpacing="0.2em" 
            textTransform="uppercase" 
            lineHeight="none" 
            mt="1" 
            opacity="0.8" 
            color={primaryColor}
          >
            Solutions
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default TonkLogo;
