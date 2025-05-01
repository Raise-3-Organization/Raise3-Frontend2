import { apiClient } from './client';
import { API_CONFIG } from './config';
import { 
  ApiResponse, 
  Campaign, 
  CreateCampaignRequest, 
  UpdateCampaignRequest,
  UpdateCampaignStatusRequest,
  CampaignStatus
} from './types';

/**
 * Create a new campaign
 */
export const createCampaign = async (data: CreateCampaignRequest): Promise<Campaign> => {
  const response = await apiClient.post<ApiResponse<Campaign>>(
    API_CONFIG.ENDPOINTS.CAMPAIGNS.BASE,
    data
  );
  
  return response.data;
};

/**
 * Get all campaigns with optional filters
 */
export const getCampaigns = async (options: {
  status?: CampaignStatus;
  category?: string;
  founderId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<{
  campaigns: Campaign[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const { status, category, founderId, search, page = 1, limit = 10, sortBy, sortOrder } = options;
  
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };
  
  if (status) params.status = status;
  if (category) params.category = category;
  if (founderId) params.founderId = founderId;
  if (search) params.search = search;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;
  
  const response = await apiClient.get<ApiResponse<Campaign[]>>(
    API_CONFIG.ENDPOINTS.CAMPAIGNS.BASE,
    { params }
  );
  
  return {
    campaigns: response.data,
    total: response.meta?.total || 0,
    page: response.meta?.page || 1,
    totalPages: Math.ceil((response.meta?.total || 0) / limit)
  };
};

/**
 * Get a campaign by ID
 */
export const getCampaignById = async (id: string): Promise<Campaign> => {
  const response = await apiClient.get<ApiResponse<Campaign>>(
    API_CONFIG.ENDPOINTS.CAMPAIGNS.BY_ID(id)
  );
  
  return response.data;
};

/**
 * Update a campaign
 */
export const updateCampaign = async (id: string, data: UpdateCampaignRequest): Promise<Campaign> => {
  const response = await apiClient.put<ApiResponse<Campaign>>(
    API_CONFIG.ENDPOINTS.CAMPAIGNS.BY_ID(id),
    data
  );
  
  return response.data;
};

/**
 * Get campaign status
 */
export const getCampaignStatus = async (id: string): Promise<{
  status: CampaignStatus;
  raisedAmount: number;
  targetAmount: number;
  progress: number;
  investorCount: number;
}> => {
  const response = await apiClient.get<ApiResponse<{
    status: CampaignStatus;
    raisedAmount: number;
    targetAmount: number;
    progress: number;
    investorCount: number;
  }>>(
    API_CONFIG.ENDPOINTS.CAMPAIGNS.STATUS(id)
  );
  
  return response.data;
};

/**
 * Update campaign status
 */
export const updateCampaignStatus = async (id: string, data: UpdateCampaignStatusRequest): Promise<Campaign> => {
  const response = await apiClient.put<ApiResponse<Campaign>>(
    API_CONFIG.ENDPOINTS.CAMPAIGNS.STATUS(id),
    data
  );
  
  return response.data;
}; 