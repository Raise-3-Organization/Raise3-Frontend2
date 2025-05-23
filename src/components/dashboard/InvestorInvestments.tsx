import React from "react";

const InvestorInvestments = () => (

    
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-medium mb-6">Your Investments</h2>
  
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none"
            placeholder="Search your investments"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>
  
      <div className="space-y-4">
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">DeFi Lending Platform</h3>
              <p className="text-sm text-gray-400 mt-1">$30,000 invested • 3 of 4 milestones completed</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-900/30 text-green-500 text-xs px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Next milestone: <span className="text-white">Beta Launch</span>
            </div>
            <div>
              <button className="text-[#FF7171] text-sm hover:underline">Details</button>
            </div>
          </div>
        </div>
  
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">NFT Marketplace</h3>
              <p className="text-sm text-gray-400 mt-1">$25,000 invested • 2 of 3 milestones completed</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/30 text-blue-500 text-xs px-2 py-1 rounded-full">Pending Review</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">66%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "66%" }}></div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Milestone verification in progress
            </div>
            <div>
              <button className="text-[#FF7171] text-sm hover:underline">Details</button>
            </div>
          </div>
        </div>
  
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Game Development Studio</h3>
              <p className="text-sm text-gray-400 mt-1">$30,000 invested • 4 of 4 milestones completed</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-900/30 text-green-500 text-xs px-2 py-1 rounded-full">Completed</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">100%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              All milestones completed
            </div>
            <div>
              <button className="text-[#FF7171] text-sm hover:underline">Final Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


export default InvestorInvestments;