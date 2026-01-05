/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // !! ATTENTION !!
      // Permet de déployer même s'il y a des erreurs TypeScript
      ignoreBuildErrors: true,
    },
    eslint: {
      // Permet de déployer même s'il y a des erreurs de linting
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;
  