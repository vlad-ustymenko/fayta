/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.31.239"],
  images: {
    formats: ["image/avif", "image/webp"],

    // domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // заміни на реальний домен з STRAPI_BASE_URL
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "placehold.co", // заміни на реальний домен з STRAPI_BASE_URL
      },
    ],
    dangerouslyAllowLocalIP: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)\\.(png|jpg|jpeg|webp|gif|svg|webm|mp4|woff2|css|js)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
