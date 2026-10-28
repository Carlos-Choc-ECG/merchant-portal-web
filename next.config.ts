import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
