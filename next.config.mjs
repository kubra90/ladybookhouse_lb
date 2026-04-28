/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.theartofbooks.com" },
      { protocol: "https", hostname: "theartofbooks.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      // AoB book covers come from Amazon's CDN
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "images.amazon.com" },
      { protocol: "http", hostname: "ecx.images-amazon.com" },
      { protocol: "https", hostname: "ecx.images-amazon.com" },
    ],
  },
};

export default nextConfig;
