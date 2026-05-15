import type { NextConfig } from 'next'

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://*.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://firebasestorage.googleapis.com https://*.google-analytics.com https://*.googlesyndication.com;
  frame-src https://googleads.g.doubleclick.net;
  connect-src 'self' https://firestore.googleapis.com https://*.googleapis.com https://*.google-analytics.com;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
    ]
  },

  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
}

export default nextConfig
