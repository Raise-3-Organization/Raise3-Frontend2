import { ReactNode } from 'react';

export interface ContractContextType {
  isConnected: boolean;
  address?: string;
  campaignsCount: number;
  isLoading: boolean;
  error: Error | null;
  
  // Methods
  getCampaignDetails: (campaignId: string) => Promise<any>;
  batchGetCampaigns: (startId: number, endId: number) => Promise<any[]>;
  createCampaign: (metadataUrl: string, goal: string, initialRaised: string) => Promise<any>;
  addMilestone: (campaignId: string, name: string, description: string, amount: string) => Promise<any>;
  completeMilestone: (campaignId: string, milestoneId: number) => Promise<any>;
  withdrawMilestone: (campaignId: string, milestoneId: number) => Promise<any>;
  investInCampaign: (campaignId: string, amount: string) => Promise<any>;
  donateToProject: (campaignId: string, amount: string) => Promise<any>;
  refreshCampaignCount: () => Promise<void>;
  submitProject: (projectData: any) => Promise<any>;
}

export interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps>;
export const useContract: () => ContractContextType;
