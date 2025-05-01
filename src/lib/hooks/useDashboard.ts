import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '../api/dashboard';

// Get founder dashboard data
export const useFounderDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'founder'],
    queryFn: dashboardApi.getFounderDashboard,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Get investor dashboard data
export const useInvestorDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'investor'],
    queryFn: dashboardApi.getInvestorDashboard,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Get campaign analytics
export const useCampaignAnalytics = (campaignId: string | undefined) => {
  return useQuery({
    queryKey: ['dashboard', 'campaign', campaignId, 'analytics'],
    queryFn: () => dashboardApi.getCampaignAnalytics(campaignId!),
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}; 