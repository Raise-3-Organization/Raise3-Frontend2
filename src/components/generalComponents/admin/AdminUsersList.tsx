"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown, User, Shield, Ban, Edit } from "lucide-react";
import { useAdminDashboard } from "../AdminDashboard";

// This would come from your API in a real implementation
const usersData = [
  {
    id: "1",
    walletAddress: "0x7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    role: "Founder",
    status: "Active",
    projects: 3,
    joinedAt: "2025-01-15",
    verificationStatus: "Verified",
  },
  {
    id: "2",
    walletAddress: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Investor",
    status: "Active",
    projects: 0,
    joinedAt: "2025-02-10",
    verificationStatus: "Verified",
  },
  {
    id: "3",
    walletAddress: "0x5f6e7d8c9b0a1e2d3c4b5a6d7c8e9f0a1b2c3d4e",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    role: "Both",
    status: "Active",
    projects: 2,
    joinedAt: "2025-01-22",
    verificationStatus: "Verified",
  },
  {
    id: "4",
    walletAddress: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
    name: "Jason Williams",
    email: "jason.williams@example.com",
    role: "Founder",
    status: "Active",
    projects: 1,
    joinedAt: "2025-03-05",
    verificationStatus: "Unverified",
  },
  {
    id: "5",
    walletAddress: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    role: "Founder",
    status: "Active",
    projects: 1,
    joinedAt: "2025-03-18",
    verificationStatus: "Pending",
  },
  {
    id: "6",
    walletAddress: "0x4f5e6d7c8b9a0f1e2d3c4b5a6d7c8e9f0a1b2c3d",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Investor",
    status: "Suspended",
    projects: 0,
    joinedAt: "2025-02-28",
    verificationStatus: "Verified",
  },
];

const AdminUsersList = () => {
  const { setActiveSection } = useAdminDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  // Filter users based on search term and filters
  const filteredUsers = usersData.filter(user => {
    // Filter by search term
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by role
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    
    // Filter by status
    const matchesStatus = selectedStatus === "All" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-medium">User Management</h2>
            <p className="text-sm text-gray-400 mt-1">Manage platform users and their permissions</p>
          </div>
          
          {/* Search and filter tools */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search users..." 
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
                    <span>Role: {selectedRole}</span>
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
        
        {/* Users list */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">User</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Wallet</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Role</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Projects</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Status</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Verification</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-400 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-800">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2F50FF] to-[#FF7171] flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'Founder' 
                        ? 'bg-blue-900/30 text-blue-500' 
                        : user.role === 'Investor'
                        ? 'bg-purple-900/30 text-purple-500'
                        : 'bg-green-900/30 text-green-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">{user.projects}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-900/30 text-green-500' 
                        : 'bg-red-900/30 text-red-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.verificationStatus === 'Verified' 
                        ? 'bg-green-900/30 text-green-500' 
                        : user.verificationStatus === 'Pending'
                        ? 'bg-yellow-900/30 text-yellow-500'
                        : 'bg-gray-900/30 text-gray-500'
                    }`}>
                      {user.verificationStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-800"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-purple-500 rounded-full hover:bg-gray-800"
                        title="Change Permissions"
                      >
                        <Shield size={16} />
                      </button>
                      {user.status === 'Active' ? (
                        <button 
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-800"
                          title="Suspend User"
                        >
                          <Ban size={16} />
                        </button>
                      ) : (
                        <button 
                          className="p-1.5 text-gray-400 hover:text-green-500 rounded-full hover:bg-gray-800"
                          title="Activate User"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No users found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersList;
