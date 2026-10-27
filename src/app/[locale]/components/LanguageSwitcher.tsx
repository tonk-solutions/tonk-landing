"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Flex } from '@chakra-ui/react';
import { brandAlpha } from '@/app/brandTokens';

const languages = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' }
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <Flex
      bg={brandAlpha.fg(0.04)}
      p="1"
      borderRadius="full"
      alignItems="center"
      display="inline-flex"
      border="1px solid"
      borderColor={brandAlpha.fg(0.1)}
    >
      {languages.map((lang) => {
        const isActive = locale === lang.code;
        return (
          <Button
            key={lang.code}
            variant="ghost"
            size="sm"
            px={4}
            py={1}
            h="28px"
            minW="50px"
            bg={isActive ? 'brand.accent' : 'transparent'}
            color={isActive ? 'brand.bg' : 'brand.muted'}
            borderRadius="full"
            fontFamily="mono"
            fontSize="xs"
            fontWeight={isActive ? "bold" : "medium"}
            onClick={() => handleLanguageChange(lang.code)}
            _hover={!isActive ? {
              color: 'brand.fg',
              bg: brandAlpha.fg(0.08)
            } : {}}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            {lang.short}
          </Button>
        );
      })}
    </Flex>
  );
}
