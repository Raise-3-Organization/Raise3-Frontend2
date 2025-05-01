import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as investmentsApi from '../api/investments';
import { 
  RecordInvestmentRequest,
  UpdateInvestmentStatusRequest,
  Investment
} from '../api/types';

// Get all investments with filtering
export const useInvestments = (options: Parameters<typeof investmentsApi.getInvestments>[0] = {}) => {
  return useQuery({
    queryKey: ['investments', options],
    queryFn: () => investmentsApi.getInvestments(options),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Get a single investment by ID
export const useInvestment = (id: string | undefined) => {
  return useQuery({
    queryKey: ['investment', id],
    queryFn: () => investmentsApi.getInvestmentById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Record a new investment
export const useRecordInvestment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RecordInvestmentRequest) => investmentsApi.recordInvestment(data),
    onSuccess: (newInvestment) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', newInvestment.campaignId] });
      
      // Optionally update the investment list directly
      queryClient.setQueryData<{ investments: Investment[] }>(['investments', {}], (oldData) => {
        if (!oldData) return { investments: [newInvestment], total: 1, page: 1, totalPages: 1 };
        return {
          ...oldData,
          investments: [newInvestment, ...oldData.investments],
          total: (oldData.total || 0) + 1
        };
      });
    },
  });
};

// Update investment status
export const useUpdateInvestmentStatus = (id: string | undefined) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateInvestmentStatusRequest) => investmentsApi.updateInvestmentStatus(id!, data),
    onSuccess: (updatedInvestment) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['investment', id] });
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', updatedInvestment.campaignId] });
    },
  });
}; 