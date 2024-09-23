/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    output: 'export',
    images: {
        domains: ['checkuree.s3.ap-northeast-2.amazonaws.com'],
    },
};

export default nextConfig;
