import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is enabled via --turbo flag in dev script (Next.js 16+)
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Optimize MUI imports for faster compilation and smaller bundles
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
      skipDefaultConversion: true,
    },
  },
  // Transpile packages for better optimization
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
  // Experimental optimizations for faster builds
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      '@tanstack/react-query',
      'react-hot-toast',
    ],
  },
  // Bundle analyzer (enabled via environment variable)
  ...(process.env.ANALYZE === 'true' && {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack: (config: any) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
      return config;
    },
  }),
};

export default nextConfig;
