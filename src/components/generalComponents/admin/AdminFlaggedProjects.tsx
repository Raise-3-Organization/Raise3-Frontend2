"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown, CheckCircle, X, AlertTriangle, Eye } from "lucide-react";
import { useAdminDashboard } from "../AdminDashboard";

// This would come from your API in a real implementation
const flaggedProjectsData = [
  {
    id: "2",
    title: "DeFi Lending Protocol",
    description: "Decentralized lending platform with multi-chain support",
    creator: "0x5f6e7d8c9b0a1e2d3c4b5a6d7c8e9f0a1b2c3d4e",
    creatorName: "Michael Johnson",
    category: "DeFi",
    blockchain: "BSC",
    status: "Flagged",
    createdAt: "2025-05-01",
    fundingGoal: 250000,
    raisedAmount: 75000,
    flagReason: "Suspicious funding activity",
    flaggedBy: "System",
    flaggedAt: "2025-05-09",
  },
  {
    id: "6",
    title: "Crypto Trading Bot",
    description: "Automated trading algorithm for cryptocurrency markets",
    creator: "0x4f5e6d7c8b9a0f1e2d3c4b5a6d7c8e9f0a1b2c3d",
    creatorName: "David Kim",
    category: "Trading",
    blockchain: "Ethereum",
    status: "Flagged",
    createdAt: "2025-05-06",
    fundingGoal: 150000,
    raisedAmount: 45000,
    flagReason: "Potential misleading claims",
    flaggedBy: "Admin",
    flaggedAt: "2025-05-08",
  },
  {
    id: "7",
    title: "Cross-Chain Bridge",
    description: "Secure asset transfer between multiple blockchains",
    creator: "0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b",
    creatorName: "Lisa Wang",
    category: "Infrastructure",
    blockchain: "Multiple",
    status: "Flagged",
    createdAt: "2025-05-04",
    fundingGoal: 400000,
    raisedAmount: 120000,
    flagReason: "Security review required",
    flaggedBy: "Admin",
    flaggedAt: "2025-05-07",
  },
];

const AdminFlaggedProjects = () => {
  const { setActiveSection } = useAdminDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReason, setSelectedReason] = useState("All");
  
  // Filter projects based on search term and filters
  const filteredProjects = flaggedProjectsData.filter(project => {
    // Filter by search term
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.creator.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by flag reason
    const matchesReason = selectedReason === "All" || project.flagReason.includes(selectedReason);
    
    return matchesSearch && matchesReason;
  });

  // Handle project resolution actions
  const handleApproveProject = (projectId: string) => {
    // In a real implementation, this would call an API
    alert(`Project ${projectId} has been approved and unflagged.`);
  };

  const handleRejectProject = (projectId: string) => {
    // In a real implementation, this would call an API
    alert(`Project ${projectId} has been rejected.`);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-medium">Flagged Projects</h2>
            <p className="text-sm text-gray-400 mt-1">Projects that have been flagged for review</p>
          </div>
          
          {/* Search and filter tools */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search flagged projects..." 
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            </div>
            
            <div className="relative">
              <button className="flex items-center justify-between px-4 py-2 bg-[#111] border border-gray-800 rounded-lg min-w-[150px]">
                <span className="flex items-center">
                  <Filter size={14} className="mr-2 text-gray-500" />
                  <span>Reason: {selectedReason}</span>
                </span>
                <ChevronDown size={14} className="ml-2 text-gray-500" />
              </button>
              {/* Dropdown would go here */}
            </div>
          </div>
        </div>
        
        {/* Flagged Projects list */}
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border border-gray-800 rounded-lg p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center mt-1">
                      <AlertTriangle size={18} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{project.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Creator</div>
                          <div className="text-sm mt-1">{project.creatorName}</div>
                          <div className="text-xs text-gray-400">{project.creator.slice(0, 6)}...{project.creator.slice(-4)}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500">Category & Chain</div>
                          <div className="text-sm mt-1">{project.category} • {project.blockchain}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500">Funding</div>
                          <div className="text-sm mt-1">${project.raisedAmount.toLocaleString()} of ${project.fundingGoal.toLocaleString()}</div>
                          <div className="mt-1 w-full bg-gray-800 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-1.5 rounded-full" 
                              style={{ width: `${(project.raisedAmount / project.fundingGoal) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500">Flag Information</div>
                          <div className="text-sm mt-1">{project.flaggedBy} on {project.flaggedAt}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-xs text-gray-500">Flag Reason</div>
                        <div className="text-sm mt-1 px-3 py-2 bg-red-900/10 border border-red-900/20 rounded-lg text-red-400">
                          {project.flagReason}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-3 ml-auto">
                  <button 
                    onClick={() => handleApproveProject(project.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2F50FF] to-[#FF7171] text-white rounded-lg hover:opacity-90"
                  >
                    <CheckCircle size={16} />
                    <span>Approve</span>
                  </button>
                  
                  <button 
                    onClick={() => handleRejectProject(project.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X size={16} />
                    <span>Reject</span>
                  </button>
                  
                  <button 
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle size={36} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No flagged projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFlaggedProjects;
