/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开启静态导出，生成 out 文件夹
  output: 'export',
  
  // 静态导出必须关闭 Next.js 自带的图片优化，因为没有服务器处理图片
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
