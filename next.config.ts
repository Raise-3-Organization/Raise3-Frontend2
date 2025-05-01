import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com', 
      'cdn.pixabay.com', 
      'seeklogo.com', 
      'raw.githubusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  webpack: (config) => {
    // Fix for LightningCSS in Tailwind v4
    config.resolve.alias = {
      ...config.resolve.alias,
      'lightningcss-wasm': false,
    };
    
    // Ensure the CSS loader is properly configured
    const oneOfRule = config.module.rules.find(
      (rule: any) => typeof rule.oneOf === "object"
    );
    
    if (oneOfRule) {
      const cssRule = oneOfRule.oneOf.find(
        (rule: any) => rule.test && rule.test.toString().includes("css")
      );
      
      if (cssRule) {
        cssRule.use = cssRule.use.filter(
          (rule: { loader?: string }) => !rule.loader || !rule.loader.includes("postcss-loader")
        );
      }
    }
    
    return config;
  },
};

export default nextConfig;