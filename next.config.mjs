/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
    images: {
        domains: ['i.imgur.com'],
    },
    async headers() {
        return [
          {
            source: "/assets/image/:path*",
            headers: [
              { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            ],
          },
          {
            source: "/assets/:path*",
            headers: [
              { key: "Cache-Control", value: "public, max-age=86400" },
            ],
          },
        ];
      },
};

export default nextConfig;