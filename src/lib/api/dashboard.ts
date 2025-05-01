import { apiClient } from './client';
import { API_CONFIG } from './config';
import { ApiResponse, FounderDashboard, InvestorDashboard, CampaignAnalytics } from './types';

/**
 * Get founder dashboard data
 */
export const getFounderDashboard = async (): Promise<FounderDashboard> => {
  const response = await apiClient.get<ApiResponse<FounderDashboard>>(
    API_CONFIG.ENDPOINTS.DASHBOARD.FOUNDER
  );
  
  return response.data;
};

/**
 * Get investor dashboard data
 */
export const getInvestorDashboard = async (): Promise<InvestorDashboard> => {
  const response = await apiClient.get<ApiResponse<InvestorDashboard>>(
    API_CONFIG.ENDPOINTS.DASHBOARD.INVESTOR
  );
  
  return response.data;
};

/**
 * Get detailed analytics for a specific campaign
 */
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  const response = await apiClient.get<ApiResponse<CampaignAnalytics>>(
    API_CONFIG.ENDPOINTS.DASHBOARD.CAMPAIGN_ANALYTICS(campaignId)
  );
  
  return response.data;
}; 