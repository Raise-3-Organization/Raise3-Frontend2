"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown, Flag, Eye, CheckCircle } from "lucide-react";
import { useAdminDashboard } from "../AdminDashboard";
import AdminProjectList from "./AdminProjectList";
// This would come from your API in a real implementation
const projectsData = [
  {
    id: "1",
    title: "Decentralized Identity Platform",
    description: "A blockchain-based identity verification system",
    creator: "0x7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    creatorName: "Alex Thompson",
    category: "Identity",
    blockchain: "Ethereum",
    status: "Active",
    createdAt: "2025-04-28",
    fundingGoal: 120000,
    raisedAmount: 42000,
  },
  {
    id: "2",
    title: "DeFi Lending Protocol",
    description: "Decentralized lending platform with multi-chain support",
    creator: "0x5f6e7d8c9b0a1e2d3c4b5a6d7c8e9f0a1b2c3d4e",
    creatorName: "Michael Johnson",
    category: "DeFi",
    blockchain: "BSC",
    status: "Active",
    createdAt: "2025-05-01",
    fundingGoal: 250000,
    raisedAmount: 75000,
  },
  {
    id: "3",
    title: "NFT Marketplace",
    description: "Platform for trading unique digital collectibles",
    creator: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    creatorName: "Sarah Chen",
    category: "NFT",
    blockchain: "Ethereum",
    status: "Active",
    createdAt: "2025-05-03",
    fundingGoal: 180000,
    raisedAmount: 108000,
  },
  {
    id: "4",
    title: "Web3 Social Network",
    description: "Decentralized social media platform",
    creator: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
    creatorName: "Jason Williams",
    category: "Social",
    blockchain: "Polygon",
    status: "Active",
    createdAt: "2025-05-05",
    fundingGoal: 200000,
    raisedAmount: 50000,
  },
  {
    id: "5",
    title: "Gaming DAO",
    description: "Play-to-earn gaming ecosystem with DAO governance",
    creator: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
    creatorName: "Emily Rodriguez",
    category: "Gaming",
    blockchain: "Polygon",
    status: "Under Review",
    createdAt: "2025-05-08",
    fundingGoal: 300000,
    raisedAmount: 0,
  },
];

const AdminProjectsList = () => {
  const { setActiveSection } = useAdminDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  // Filter projects based on search term and filters
  const filteredProjects = projectsData.filter(project => {
    // Filter by search term
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.creator.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    
    // Filter by status
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Handle flagging a project
  const handleFlagProject = (projectId: string) => {
    // In a real implementation, you would call an API to flag the project
    alert(`Project ${projectId} has been flagged for review.`);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h2 className="text-xl font-medium">Projects</h2>
          
          {/* Search and filter tools */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <button className="flex items-center justify-between px-4 py-2 bg-[#111] border border-gray-800 rounded-lg min-w-[120px]">
                  <span className="flex items-center">
                    <Filter size={14} className="mr-2 text-gray-500" />
                    <span>Category: {selectedCategory}</span>
                  </span>
                  <ChevronDown size={14} className="ml-2 text-gray-500" />
                </button>
                {/* Dropdown would go here */}
              </div>
              
              <div className="relative">
                <button className="flex items-center justify-between px-4 py-2 bg-[#111] border border-gray-800 rounded-lg min-w-[120px]">
                  <span className="flex items-center">
                    <Filter size={14} className="mr-2 text-gray-500" />
                    <span>Status: {selectedStatus}</span>
                  </span>
                  <ChevronDown size={14} className="ml-2 text-gray-500" />
                </button>
                {/* Dropdown would go here */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects list */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Project</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Creator</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Category</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Blockchain</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Status</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Funding</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Actions</th>
              </tr>
            </thead>
            {/* <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-800">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-[200px]">{project.description}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{project.creatorName}</div>
                    <div className="text-sm text-gray-400">{project.creator.slice(0, 6)}...{project.creator.slice(-4)}</div>
                  </td>
                  <td className="py-4 px-4">{project.category}</td>
                  <td className="py-4 px-4">{project.blockchain}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'Active' 
                        ? 'bg-green-900/30 text-green-500' 
                        : project.status === 'Under Review'
                        ? 'bg-yellow-900/30 text-yellow-500'
                        : 'bg-red-900/30 text-red-500'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">${project.raisedAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">of ${project.fundingGoal.toLocaleString()}</div>
                    <div className="mt-1 w-full bg-gray-800 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-1.5 rounded-full" 
                        style={{ width: `${(project.raisedAmount / project.fundingGoal) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleFlagProject(project.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-800"
                        title="Flag Project"
                      >
                        <Flag size={16} />
                      </button>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-800"
                        title="Approve Project"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-800"
                        title="View Project"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody> */}
            <AdminProjectList />
          </table>
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectsList;
