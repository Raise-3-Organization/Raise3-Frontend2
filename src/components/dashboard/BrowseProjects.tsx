import React from 'react';
import ProjectList from '../ProjectList';
import ProjectCreatedList from './ProjectCreatedList';
const BrowseProjects = () => (
    <div className="space-y-6">
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-6">Browse Projects</h2>
        
        <div className="mb-6">
          <div className="flex gap-2 mb-4 flex-wrap">
            <button className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] text-white">
              All
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium transition-all text-gray-400 hover:text-white">
              DeFi
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium transition-all text-gray-400 hover:text-white">
              NFT
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium transition-all text-gray-400 hover:text-white">
              Gaming
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium transition-all text-gray-400 hover:text-white">
              Infrastructure
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium transition-all text-gray-400 hover:text-white">
              Social
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none"
              placeholder="Search projects by name, category, or blockchain"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Smart Contract Integrated Project List */}
        <ProjectCreatedList />
      </div>
    </div>
  ); 


export default BrowseProjects;