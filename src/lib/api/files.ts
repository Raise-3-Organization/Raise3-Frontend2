import { apiClient } from './client';
import { API_CONFIG } from './config';
import { ApiResponse, File } from './types';

/**
 * Upload a file
 * Note: This handles FormData for file uploads
 */
export const uploadFile = async (file: Blob | File, fileName?: string): Promise<File> => {
  const formData = new FormData();
  formData.append('file', file, fileName || (file as File).name);
  
  // For FormData, we need to omit the Content-Type header
  // to let the browser set it with the correct boundary
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/${API_CONFIG.API_VERSION}${API_CONFIG.ENDPOINTS.FILES.UPLOAD}`, 
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify({
      status: response.status,
      message: errorData.message || response.statusText,
      errors: errorData.errors
    }));
  }
  
  const result = await response.json();
  return result.data;
};

/**
 * Get file metadata by ID
 */
export const getFileById = async (id: string): Promise<File> => {
  const response = await apiClient.get<ApiResponse<File>>(
    API_CONFIG.ENDPOINTS.FILES.BY_ID(id)
  );
  
  return response.data;
};

/**
 * Delete a file
 */
export const deleteFile = async (id: string): Promise<void> => {
  await apiClient.delete(
    API_CONFIG.ENDPOINTS.FILES.BY_ID(id)
  );
}; 