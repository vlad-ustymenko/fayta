/** @type {import('next').NextConfig} */

const strapiUrl = new URL(
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337"
);

const nextConfig = {
  allowedDevOrigins: [strapiUrl.hostname],

  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(":", ""),
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
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
