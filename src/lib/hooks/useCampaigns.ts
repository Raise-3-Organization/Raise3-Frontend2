import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as campaignsApi from '../api/campaigns';
import { 
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  UpdateCampaignStatusRequest,
  CampaignStatus 
} from '../api/types';

// Get all campaigns with filtering
export const useCampaigns = (options: Parameters<typeof campaignsApi.getCampaigns>[0] = {}) => {
  return useQuery({
    queryKey: ['campaigns', options],
    queryFn: () => campaignsApi.getCampaigns(options),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Get a single campaign by ID
export const useCampaign = (id: string | undefined) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignsApi.getCampaignById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Get campaign status
export const useCampaignStatus = (id: string | undefined) => {
  return useQuery({
    queryKey: ['campaign', id, 'status'],
    queryFn: () => campaignsApi.getCampaignStatus(id!),
    enabled: !!id,
    refetchInterval: 1000 * 30, // Refresh every 30 seconds
  });
};

// Create a campaign
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => campaignsApi.createCampaign(data),
    onSuccess: (newCampaign) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      
      // Add the new campaign to any existing campaigns query data
      queryClient.setQueryData<{ campaigns: Campaign[] }>(['campaigns', {}], (oldData) => {
        if (!oldData) return { campaigns: [newCampaign], total: 1, page: 1, totalPages: 1 };
        return {
          ...oldData,
          campaigns: [newCampaign, ...oldData.campaigns],
          total: (oldData.total || 0) + 1
        };
      });
    },
  });
};

// Update a campaign
export const useUpdateCampaign = (id: string | undefined) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateCampaignRequest) => campaignsApi.updateCampaign(id!, data),
    onSuccess: (updatedCampaign) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

// Update campaign status
export const useUpdateCampaignStatus = (id: string | undefined) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateCampaignStatusRequest) => campaignsApi.updateCampaignStatus(id!, data),
    onSuccess: (updatedCampaign) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      queryClient.invalidateQueries({ queryKey: ['campaign', id, 'status'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}; 