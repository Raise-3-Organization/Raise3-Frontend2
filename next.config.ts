import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  
  webpack: (config) => {
    // Fix for LightningCSS in Tailwind v4
    config.resolve.alias = {
      ...config.resolve.alias,
      'lightningcss-wasm': false,
    };
    
    // Ensure the CSS loader is properly configured
    const oneOfRule = config.module.rules.find(
      (rule) => typeof rule.oneOf === "object"
    );
    
    if (oneOfRule) {
      const cssRule = oneOfRule.oneOf.find(
        (rule) => rule.test && rule.test.toString().includes("css")
      );
      
      if (cssRule) {
        cssRule.use = cssRule.use.filter(
          (rule) => !rule.loader || !rule.loader.includes("postcss-loader")
        );
      }
    }
    
    return config;
  },
};

export default nextConfig;