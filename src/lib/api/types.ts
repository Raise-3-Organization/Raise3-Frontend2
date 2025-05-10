// Campaign status enum
export enum CampaignStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Campaign interface
export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: CampaignStatus;
  founderId: string;
  goalAmount: number;
  raisedAmount: number;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  imageUrl?: string;
}

// Campaign list response interface
export interface CampaignListResponse {
  campaigns: Campaign[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Campaign query params interface
export interface CampaignQueryParams {
  status?: CampaignStatus;
  category?: string;
  search?: string;
  founderId?: string;
  page?: number;
  limit?: number;
}
