import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: './dist',
  basePath: process.env.NODE_ENV === 'production' ? '/RSSCHOOLREACTQ3/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
