/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  <-- 删除或注释这一行
  
  // 如果你需要允许跨域图片，保留 images 配置，否则可以忽略
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
