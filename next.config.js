/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        "*.js": [
          {
            loader: "react-loader",
          },
        ],
      },
    },
  },
};

module.exports = nextConfig
