"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Button, MenuRoot, MenuTrigger, MenuContent, MenuItem } from '@chakra-ui/react';

const languages = [
  { code: 'es', label: 'Español', flag: '🇦🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' }
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          px={3}
          py={2}
          minW="80px"
          bg="whiteAlpha.100"
          borderRadius="md"
          border="1px solid"
          borderColor="whiteAlpha.200"
          _hover={{ bg: 'whiteAlpha.200', borderColor: 'whiteAlpha.300' }}
          color="white"
          fontSize="sm"
          fontWeight="medium"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <span style={{ fontSize: '18px' }}>{currentLanguage?.flag}</span>
        </Button>
      </MenuTrigger>
      <MenuContent 
        bg="gray.900" 
        borderColor="gray.700"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
        minW="140px"
        p={1}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            value={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            bg={locale === lang.code ? 'gray.700' : 'transparent'}
            _hover={{ bg: 'gray.700' }}
            color="white"
            borderRadius="sm"
            px={3}
            py={2}
            fontSize="sm"
            cursor="pointer"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <span style={{ fontSize: '18px' }}>{lang.flag}</span>
            <span>{lang.label}</span>
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}
