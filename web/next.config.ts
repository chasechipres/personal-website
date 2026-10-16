import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export served by nginx; no Node server in production.
  output: "export",
  // Emit /about/index.html so nginx serves directories without rewrites.
  trailingSlash: true,
  // The default image optimizer needs a server; serve images as-is.
  images: { unoptimized: true },
  // cacheComponents and partialPrefetching are left off: both need a server
  // and fail the build in export mode.
};

export default nextConfig;
