/** @type {import('next').NextConfig} */
const nextConfig = {
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