import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react', 'lucide-react', 'framer-motion', 'react-icons'],
  },
};

export default withNextIntl(nextConfig);
