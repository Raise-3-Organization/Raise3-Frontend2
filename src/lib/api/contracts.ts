import { apiClient } from './client';
import { API_CONFIG } from './config';
import { ApiResponse, Contract, ContractType, RecordContractRequest } from './types';

/**
 * Get contract ABI by type
 */
export const getContractAbi = async (type: ContractType): Promise<{ abi: any }> => {
  const response = await apiClient.get<ApiResponse<{ abi: any }>>(
    API_CONFIG.ENDPOINTS.CONTRACTS.ABI(type)
  );
  
  return response.data;
};

/**
 * Record a deployed contract
 */
export const recordContract = async (data: RecordContractRequest): Promise<Contract> => {
  const response = await apiClient.post<ApiResponse<Contract>>(
    API_CONFIG.ENDPOINTS.CONTRACTS.RECORD,
    data
  );
  
  return response.data;
};

/**
 * Get contract details for a campaign
 */
export const getContractsByCampaignId = async (campaignId: string): Promise<Contract[]> => {
  const response = await apiClient.get<ApiResponse<Contract[]>>(
    API_CONFIG.ENDPOINTS.CONTRACTS.BY_CAMPAIGN(campaignId)
  );
  
  return response.data;
}; 