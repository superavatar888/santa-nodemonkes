/** @type {import('next').NextConfig} */
const nextConfig = {
  // 这一行非常关键！它告诉 Next.js 生成 'out' 文件夹
  output: 'export',
  
  // 这一行也必须有，因为静态导出不支持 Next.js 自带的图片优化服务
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
