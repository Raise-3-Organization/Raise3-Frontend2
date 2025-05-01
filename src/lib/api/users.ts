import { apiClient } from './client';
import { API_CONFIG } from './config';
import { 
  ApiResponse, 
  User, 
  UserProfileUpdateRequest,
  RegisterFounderRequest,
  RegisterInvestorRequest,
  KycStatus
} from './types';

/**
 * Get the current user's profile
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(
    API_CONFIG.ENDPOINTS.USERS.PROFILE
  );
  
  return response.data;
};

/**
 * Update the current user's profile
 */
export const updateUserProfile = async (data: UserProfileUpdateRequest): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>(
    API_CONFIG.ENDPOINTS.USERS.PROFILE,
    data
  );
  
  return response.data;
};

/**
 * Register current user as a founder
 */
export const registerAsFounder = async (data: RegisterFounderRequest): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>(
    API_CONFIG.ENDPOINTS.USERS.REGISTER_FOUNDER,
    data
  );
  
  return response.data;
};

/**
 * Register current user as an investor
 */
export const registerAsInvestor = async (data: RegisterInvestorRequest): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>(
    API_CONFIG.ENDPOINTS.USERS.REGISTER_INVESTOR,
    data
  );
  
  return response.data;
};

/**
 * Initiate KYC process for the current user
 */
export const initiateKyc = async (): Promise<{ redirectUrl: string }> => {
  const response = await apiClient.post<ApiResponse<{ redirectUrl: string }>>(
    API_CONFIG.ENDPOINTS.USERS.INITIATE_KYC,
    {}
  );
  
  return response.data;
};

/**
 * Update KYC status for a user (Admin only)
 */
export const updateKycStatus = async (walletAddress: string, status: KycStatus, notes?: string): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>(
    API_CONFIG.ENDPOINTS.USERS.KYC_STATUS(walletAddress),
    { status, notes }
  );
  
  return response.data;
}; 