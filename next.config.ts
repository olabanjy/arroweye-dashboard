/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com", "images.pexels.com"],
  },
};

module.exports = nextConfig;
