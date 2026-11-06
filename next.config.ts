import type { NextConfig } from "next";

/**
 * BASE_PATH: sub-path the site is served from, e.g. "/respiro" on GitHub Pages.
 * Empty (the default) serves the site from the domain root, as for local builds and tests.
 */
const basePath = process.env.BASE_PATH ?? "";
if (!/^(\/[a-z0-9-]+)*$/.test(basePath)) {
  throw new Error(`BASE_PATH must look like "/name" or be empty, got "${basePath}"`);
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: { root: __dirname },
  ...(basePath ? { basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
