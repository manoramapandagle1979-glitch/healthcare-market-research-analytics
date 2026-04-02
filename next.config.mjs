/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'logo.clearbit.com'],
  },
  experimental: {
    cpus: 1,
  },
}

export default nextConfig
