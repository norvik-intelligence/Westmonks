/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/kpcyenmx/image/upload/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/automatisierungs-blueprint.pdf": ["./assets/blueprint.part-*.bin"],
  },
};

export default nextConfig;
