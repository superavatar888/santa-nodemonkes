const repoName = "santa-nodemonkes";

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    
    basePath: `/${repoName}`, 
    assetPrefix: `/${repoName}/`,
    
    distDir: "out",
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;