/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    apiDemo: 'https://rt7vn8bn2l.execute-api.ap-northeast-2.amazonaws.com/demo',
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
};


export default nextConfig;
