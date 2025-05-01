// API response and request types

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
}

// Error Types
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Authentication Types
export interface AuthConnectRequest {
  walletAddress: string;
}

export interface AuthConnectResponse {
  message: string;
  nonce: string;
}

export interface AuthVerifyRequest {
  walletAddress: string;
  signature: string;
}

export interface AuthVerifyResponse {
  token: string;
  user: User;
}

// User Types
export interface User {
  id: string;
  walletAddress: string;
  name?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  role: UserRole;
  isFounder: boolean;
  isInvestor: boolean;
  kycStatus: KycStatus;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'USER',
  FOUNDER = 'FOUNDER',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN'
}

export enum KycStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface UserProfileUpdateRequest {
  name?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
}

export interface RegisterFounderRequest {
  companyName: string;
  registrationNumber?: string;
  country: string;
  industry: string;
}

export interface RegisterInvestorRequest {
  investorType: InvestorType;
  accreditationStatus: AccreditationStatus;
  investmentPreferences?: string[];
}

export enum InvestorType {
  INDIVIDUAL = 'INDIVIDUAL',
  INSTITUTION = 'INSTITUTION',
  DAO = 'DAO'
}

export enum AccreditationStatus {
  ACCREDITED = 'ACCREDITED',
  NON_ACCREDITED = 'NON_ACCREDITED'
}

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  founderId: string;
  founderName: string;
  founderImage?: string;
  coverImage?: string;
  logoImage?: string;
  targetAmount: number;
  raisedAmount: number;
  tokenSymbol?: string;
  tokenPrice?: number;
  tokenSupply?: number;
  startDate?: string;
  endDate?: string;
  category: string;
  status: CampaignStatus;
  contractAddress?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  milestones?: Milestone[];
  team?: TeamMember[];
  documents?: Document[];
  socials?: Social;
}

export interface Milestone {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
}

export interface Document {
  title: string;
  type: string;
  fileId: string;
  fileUrl: string;
}

export interface Social {
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  github?: string;
  linkedin?: string;
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  FUNDED = 'FUNDED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED'
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  shortDescription: string;
  targetAmount: number;
  tokenSymbol?: string;
  tokenPrice?: number;
  tokenSupply?: number;
  startDate?: string;
  endDate?: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  logoImage?: string;
  milestones?: Milestone[];
  team?: TeamMember[];
  socials?: Social;
}

export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  shortDescription?: string;
  targetAmount?: number;
  tokenSymbol?: string;
  tokenPrice?: number;
  tokenSupply?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  logoImage?: string;
  milestones?: Milestone[];
  team?: TeamMember[];
  socials?: Social;
}

export interface UpdateCampaignStatusRequest {
  status: CampaignStatus;
  reason?: string;
}

// Investment Types
export interface Investment {
  id: string;
  investorId: string;
  investorName: string;
  investorImage?: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  tokenAmount?: number;
  transactionHash: string;
  status: InvestmentStatus;
  createdAt: string;
  updatedAt: string;
}

export enum InvestmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED'
}

export interface RecordInvestmentRequest {
  campaignId: string;
  amount: number;
  tokenAmount?: number;
  transactionHash: string;
}

export interface UpdateInvestmentStatusRequest {
  status: InvestmentStatus;
}

// Contract Types
export interface Contract {
  id: string;
  campaignId: string;
  type: ContractType;
  address: string;
  network: string;
  deployerAddress: string;
  deploymentTxHash: string;
  createdAt: string;
  updatedAt: string;
}

export enum ContractType {
  ERC20 = 'ERC20',
  VESTING = 'VESTING',
  CROWDSALE = 'CROWDSALE'
}

export interface RecordContractRequest {
  campaignId: string;
  type: ContractType;
  address: string;
  network: string;
  deploymentTxHash: string;
}

// File Types
export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface FounderDashboard {
  totalCampaigns: number;
  totalRaised: number;
  totalInvestors: number;
  campaigns: Array<{
    id: string;
    title: string;
    status: CampaignStatus;
    targetAmount: number;
    raisedAmount: number;
    investorCount: number;
    progress: number;
    startDate?: string;
    endDate?: string;
  }>;
}

export interface InvestorDashboard {
  totalInvested: number;
  totalCampaignsInvested: number;
  investments: Array<{
    id: string;
    campaignId: string;
    campaignTitle: string;
    amount: number;
    tokenAmount?: number;
    status: InvestmentStatus;
    date: string;
  }>;
}

export interface CampaignAnalytics {
  campaign: {
    id: string;
    title: string;
    targetAmount: number;
    raisedAmount: number;
    progress: number;
    investorCount: number;
    startDate?: string;
    endDate?: string;
    status: CampaignStatus;
  };
  dailyStats: Array<{
    date: string;
    amount: number;
    investorCount: number;
  }>;
  investmentDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

// Transaction Types
export interface Transaction {
  type: string;
  id: string;
  attributes: TransactionAttributes;
}

export interface TransactionAttributes {
  state: TransactionState;
  total: number;
  total_commission: Commission;
  country: string;
  currency: string;
  customer: Customer;
  cards: Card[];
  client_order_id: string;
  payment_method?: PaymentMethod;
  metadata?: Record<string, any>;
}

export type TransactionState = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED';

export interface Commission {
  amount: number;
  rate: number;
  currency: string;
  crypto?: CryptoCommission;
}

export interface CryptoCommission {
  asset: string;
  amount: number;
  conversion_rate: number;
}

export interface Customer {
  id: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
}

export interface PaymentMethod {
  crypto?: CryptoPaymentMethod;
}

export interface CryptoPaymentMethod {
  asset: string;
  network: string;
  network_fee?: number;
  payment_address?: string;
  payment_total?: number;
  payment_expires_at?: number;
  transaction_hash?: string;
}

// Card Types
export interface Card {
  id: string;
  brand_id: string;
  brand_name: string;
  balance: number;
  currency: string;
  number?: CardField;
  csc?: CardField;
  view_card_url?: CardField;
  barcode?: CardBarcode;
  expires_at?: string;
  balance_checks_available: number;
  balance_check_supported: boolean;
  commission: Commission;
  state?: CardState;
  apple_pass_link?: string;
  google_pass_link?: string;
}

export interface CardField {
  label?: string;
  value?: string;
  raw: string;
}

export interface CardBarcode {
  kind: BarcodeType;
  value: string;
}

export type BarcodeType = 'CODE128' | 'DATA_MATRIX' | 'QR_CODE' | 'PDF417' | 'PDF417_COMPACT';
export type CardState = 'ACTIVE' | 'REDEEMED' | 'EXPIRED';

// Brand Types
export interface Brand {
  type: string;
  id: string;
  attributes: BrandAttributes;
}

export interface BrandAttributes {
  group_id: string;
  icon_url: string;
  name: string;
  currency: string;
  country: string;
  commission_rate: number;
  description: string;
  terms?: string;
  merchant_url: string;
  balance_check_url?: string;
  redemption_config: RedemptionConfig;
  transaction_config: TransactionConfig;
  categories: string[];
}

export interface RedemptionConfig {
  disclaimer: string;
  methods: RedemptionMethod[];
}

export interface RedemptionMethod {
  info: string;
  kind: RedemptionKind;
}

export type RedemptionKind = 'ONLINE' | 'IN_STORE' | 'APP' | 'RESTAURANT';

export interface TransactionConfig {
  disclaimer: string;
  variable_load?: {
    increment: number;
    minimum_amount: number;
    maximum_amount: number;
  };
  fixed_load?: {
    amounts: number[];
  };
}

// Token Types
export interface TokenResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      access_token: string;
      type: string;
      expires_at: number;
    }
  }
}

// Request Types
export interface CreateTransactionRequest {
  data: {
    type: "transactions";
    attributes: {
      type: "SYNC" | "ASYNC";
      cards: {
        brand_id: string;
        value: number;
        quantity: number;
      }[];
      customer: {
        id: string;
        email?: string;
        phone_number?: string;
        first_name?: string;
        last_name?: string;
      };
      client_order_id: string;
      payment_method?: {
        crypto?: {
          asset: string;
          network: string;
        }
      };
      metadata?: Record<string, any>;
    }
  }
} 