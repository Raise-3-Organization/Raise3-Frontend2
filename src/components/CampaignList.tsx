"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCampaigns } from '@/lib/hooks';
import { CampaignStatus } from '@/lib/api/types';

interface CampaignListProps {
  initialStatus?: CampaignStatus;
  showFilters?: boolean;
  maxItems?: number;
  founderId?: string;
}

const CampaignList: React.FC<CampaignListProps> = ({
  initialStatus = CampaignStatus.ACTIVE,
  showFilters = true,
  maxItems,
  founderId,
}) => {
  const [status, setStatus] = useState<CampaignStatus | undefined>(initialStatus);
  const [category, setCategory] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error } = useCampaigns({
    status,
    category,
    search: searchTerm || undefined,
    founderId,
    page,
    limit: maxItems || 10
  });
  
  const campaigns = data?.campaigns || [];
  const totalPages = data?.totalPages || 0;
  
  return (
    <div className="w-full">
      {/* Content goes here */}
      <p>Campaigns will be displayed here</p>
    </div>
  );
};

export default CampaignList; 