import { apiClient } from './client';
import { API_CONFIG } from './config';
import { ApiResponse, AuthConnectRequest, AuthConnectResponse, AuthVerifyRequest, AuthVerifyResponse, User } from './types';

/**
 * Initiate wallet connection for authentication
 */
export const connectWallet = async (walletAddress: string): Promise<AuthConnectResponse> => {
  const response = await apiClient.post<ApiResponse<AuthConnectResponse>>(
    API_CONFIG.ENDPOINTS.AUTH.CONNECT_WALLET,
    { walletAddress },
    { requiresAuth: false }
  );
  
  return response.data;
};

/**
 * Verify wallet signature to complete authentication
 */
export const verifySignature = async (walletAddress: string, signature: string): Promise<AuthVerifyResponse> => {
  const response = await apiClient.post<ApiResponse<AuthVerifyResponse>>(
    API_CONFIG.ENDPOINTS.AUTH.VERIFY_SIGNATURE,
    { walletAddress, signature },
    { requiresAuth: false }
  );
  
  // Store the token in the API client
  if (response.data.token) {
    apiClient.setAuthToken(response.data.token);
  }
  
  return response.data;
};

/**
 * Get current user's profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(
    API_CONFIG.ENDPOINTS.AUTH.ME
  );
  
  return response.data;
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  await apiClient.post<ApiResponse<{ success: boolean }>>(
    API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
    {}
  );
  
  // Clear the token from the API client
  apiClient.clearAuthToken();
}; 