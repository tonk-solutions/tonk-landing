"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Flex } from '@chakra-ui/react';

const languages = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' }
];

interface LanguageSwitcherProps {
  isLightMode?: boolean;
}

export default function LanguageSwitcher({ isLightMode = false }: LanguageSwitcherProps) {
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
      bg={isLightMode ? 'blackAlpha.50' : 'whiteAlpha.50'}
      p="1"
      borderRadius="full"
      alignItems="center"
      display="inline-flex"
      border="1px solid"
      borderColor={isLightMode ? 'blackAlpha.100' : 'whiteAlpha.100'}
      boxShadow="inset 0 1px 2px rgba(0,0,0,0.1)"
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
            bg={isActive ? 'primary.600' : 'transparent'}
            color={isActive ? 'white' : (isLightMode ? 'gray.600' : 'whiteAlpha.500')}
            borderRadius="full"
            fontSize="sm"
            fontWeight={isActive ? "bold" : "semibold"}
            onClick={() => handleLanguageChange(lang.code)}
            _hover={!isActive ? {
              color: isLightMode ? 'gray.900' : 'whiteAlpha.800',
              bg: isLightMode ? 'blackAlpha.50' : 'whiteAlpha.100'
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
