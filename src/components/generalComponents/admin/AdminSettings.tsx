"use client";

import React, { useState } from "react";
import { Save, AlertTriangle } from "lucide-react";
import { useAdminDashboard } from "../AdminDashboard";

const AdminSettings = () => {
  const { setActiveSection } = useAdminDashboard();
  
  // Platform settings - would be loaded from API in real implementation
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApprovalForVerified, setAutoApprovalForVerified] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [ipRestriction, setIpRestriction] = useState(false);
  const [platformFeePercentage, setPlatformFeePercentage] = useState("2.5");
  const [minimumWithdrawal, setMinimumWithdrawal] = useState("50");
  const [maxProjectsPerUser, setMaxProjectsPerUser] = useState("5");
  const [maxFundingAmount, setMaxFundingAmount] = useState("500000");
  
  // Handle saving settings
  const handleSaveSettings = () => {
    // In a real implementation, this would call an API to save settings
    alert("Settings have been saved successfully.");
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-6">Platform Settings</h2>
        
        <div className="space-y-8">
          {/* General Settings Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-800">General Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium">Platform Maintenance Mode</h4>
                  <p className="text-sm text-gray-400 mt-1">Temporarily disable access to the platform for non-admin users</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-800">
                  <input 
                    type="checkbox" 
                    id="toggle1" 
                    className="sr-only" 
                    checked={maintenanceMode}
                    onChange={() => setMaintenanceMode(!maintenanceMode)}
                  />
                  <label 
                    htmlFor="toggle1" 
                    className={`absolute left-0 w-6 h-6 transition duration-100 ease-in-out transform rounded-full cursor-pointer ${
                      maintenanceMode ? 'translate-x-6 bg-white' : 'bg-gray-600'
                    }`}
                  ></label>
                  <div className={`absolute inset-0 rounded-full ${
                    maintenanceMode ? 'bg-gradient-to-r from-[#2F50FF] to-[#FF7171]' : 'bg-gray-800'
                  }`}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium">Auto-approval for Verified Users</h4>
                  <p className="text-sm text-gray-400 mt-1">Automatically approve project submissions from verified users</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-800">
                  <input 
                    type="checkbox" 
                    id="toggle2" 
                    className="sr-only" 
                    checked={autoApprovalForVerified}
                    onChange={() => setAutoApprovalForVerified(!autoApprovalForVerified)}
                  />
                  <label 
                    htmlFor="toggle2" 
                    className={`absolute left-0 w-6 h-6 transition duration-100 ease-in-out transform rounded-full cursor-pointer ${
                      autoApprovalForVerified ? 'translate-x-6 bg-white' : 'bg-gray-600'
                    }`}
                  ></label>
                  <div className={`absolute inset-0 rounded-full ${
                    autoApprovalForVerified ? 'bg-gradient-to-r from-[#2F50FF] to-[#FF7171]' : 'bg-gray-800'
                  }`}></div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 border border-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">Max Projects Per User</h4>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      value={maxProjectsPerUser} 
                      onChange={(e) => setMaxProjectsPerUser(e.target.value)}
                      className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                
                <div className="flex-1 p-4 border border-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">Max Funding Amount</h4>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <input 
                      type="number" 
                      value={maxFundingAmount} 
                      onChange={(e) => setMaxFundingAmount(e.target.value)}
                      className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2"
                      min="1000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fee Settings Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-800">Fee Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Platform Fee Percentage</h4>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={platformFeePercentage} 
                    onChange={(e) => setPlatformFeePercentage(e.target.value)}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              
              <div className="p-4 border border-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Minimum Withdrawal</h4>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <input 
                    type="number" 
                    value={minimumWithdrawal} 
                    onChange={(e) => setMinimumWithdrawal(e.target.value)}
                    className="w-full bg-[#111] border border-gray-800 rounded-lg px-4 py-2"
                    step="10"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Settings Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-800">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-400 mt-1">Require 2FA for all admin actions</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-800">
                  <input 
                    type="checkbox" 
                    id="toggle3" 
                    className="sr-only" 
                    checked={twoFactorRequired}
                    onChange={() => setTwoFactorRequired(!twoFactorRequired)}
                  />
                  <label 
                    htmlFor="toggle3" 
                    className={`absolute left-0 w-6 h-6 transition duration-100 ease-in-out transform rounded-full cursor-pointer ${
                      twoFactorRequired ? 'translate-x-6 bg-white' : 'bg-gray-600'
                    }`}
                  ></label>
                  <div className={`absolute inset-0 rounded-full ${
                    twoFactorRequired ? 'bg-gradient-to-r from-[#2F50FF] to-[#FF7171]' : 'bg-gray-800'
                  }`}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium">IP Restriction</h4>
                  <p className="text-sm text-gray-400 mt-1">Limit admin access to specific IP addresses</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-800">
                  <input 
                    type="checkbox" 
                    id="toggle4" 
                    className="sr-only" 
                    checked={ipRestriction}
                    onChange={() => setIpRestriction(!ipRestriction)}
                  />
                  <label 
                    htmlFor="toggle4" 
                    className={`absolute left-0 w-6 h-6 transition duration-100 ease-in-out transform rounded-full cursor-pointer ${
                      ipRestriction ? 'translate-x-6 bg-white' : 'bg-gray-600'
                    }`}
                  ></label>
                  <div className={`absolute inset-0 rounded-full ${
                    ipRestriction ? 'bg-gradient-to-r from-[#2F50FF] to-[#FF7171]' : 'bg-gray-800'
                  }`}></div>
                </div>
              </div>
              
              {/* Warning box */}
              <div className="p-4 bg-yellow-900/10 border border-yellow-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-500">Security Warning</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Changing security settings may impact user access and platform behavior. 
                      Please ensure you understand the implications before saving changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Save button */}
          <div className="pt-4 border-t border-gray-800 flex justify-end gap-4">
            <button 
              onClick={() => setActiveSection("dashboard")}
              className="px-6 py-2 border border-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-gradient-to-r from-[#2F50FF] to-[#FF7171] text-white rounded-lg flex items-center gap-2"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
