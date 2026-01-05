/** @type {import('next').NextConfig} */
const nextConfig = {
  // 明确指定 Turbopack 的根目录，避免多重锁文件导致的工作区误判
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
