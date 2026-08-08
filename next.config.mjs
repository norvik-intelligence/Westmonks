/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/automatisierungs-blueprint.pdf": ["./assets/blueprint.part-*.bin"],
  },
};

export default nextConfig;
