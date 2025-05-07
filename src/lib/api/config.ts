// API Configuration

export const API_CONFIG = {
  // Base URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://raise3-backend.onrender.com',
  
  // API Version
  API_VERSION: 'api',
  
  // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      CONNECT_WALLET: '/auth/connect-wallet',
      VERIFY_SIGNATURE: '/auth/verify-signature',
      ME: '/auth/me',
      LOGOUT: '/auth/logout'
    },
    
    // Campaigns endpoints
    CAMPAIGNS: {
      BASE: '/campaigns',
      BY_ID: (id: string) => `/campaigns/${id}`,
      STATUS: (id: string) => `/campaigns/${id}/status`
    },
    
    // Contracts endpoints
    CONTRACTS: {
      ABI: (type: string) => `/contracts/abi/${type}`,
      RECORD: '/contracts/record',
      BY_CAMPAIGN: (campaignId: string) => `/contracts/${campaignId}`
    },
    
    // Dashboard endpoints
    DASHBOARD: {
      FOUNDER: '/dashboard/founder',
      INVESTOR: '/dashboard/investor',
      CAMPAIGN_ANALYTICS: (id: string) => `/dashboard/campaign/${id}/analytics`
    },
    
    // Files endpoints
    FILES: {
      UPLOAD: '/files/upload',
      BY_ID: (id: string) => `/files/${id}`
    },
    
    // Investments endpoints
    INVESTMENTS: {
      RECORD: '/investments/record',
      BASE: '/investments',
      BY_ID: (id: string) => `/investments/${id}`,
      BY_CAMPAIGN: (campaignId: string) => `/investments/campaign/${campaignId}`,
      BY_INVESTOR: (investorAddress: string) => `/investments/investor/${investorAddress}`
    }
  }
};
