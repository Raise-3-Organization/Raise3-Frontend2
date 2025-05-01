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
      STATUS: (id: string) => `/investments/${id}/status`
    },
    
    // Users endpoints
    USERS: {
      PROFILE: '/users/profile',
      REGISTER_FOUNDER: '/users/register-founder',
      REGISTER_INVESTOR: '/users/register-investor',
      INITIATE_KYC: '/users/initiate-kyc',
      KYC_STATUS: (walletAddress: string) => `/users/kyc-status/${walletAddress}`
    }
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000, // 30 seconds
};

// Helper to get the full API URL for an endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}${endpoint}`;
}; 