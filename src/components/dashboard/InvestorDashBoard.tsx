import React, { useContext} from "react";
import { DashboardContext } from "../generalComponents/Dashboard";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Image from "next/image";

const InvestorDashboard = () => {
    const { setActiveSection } = React.useContext(DashboardContext);
  
    return (
      <div className="space-y-8">
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6">Portfolio Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Total Invested</div>
              <div className="text-2xl font-semibold mt-2">$85,000</div>
            </div>
            <div className="bg-[#111] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Active Investments</div>
              <div className="text-2xl font-semibold mt-2">3</div>
            </div>
            <div className="bg-[#111] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Pending Releases</div>
              <div className="text-2xl font-semibold mt-2">2</div>
            </div>
          </div>
        </div>
  
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Featured Projects</h2>
            <button
              onClick={() => setActiveSection("browse-projects")}
              className="text-[#FF7171] text-sm flex items-center gap-1 hover:underline"
            >
              Browse all <ChevronRight size={16} />
            </button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-800 rounded-lg overflow-hidden group">
              <div className="h-40 bg-gray-800 relative overflow-hidden">
                <Image
                  src="/image.png"
                  alt="Project"
                  width={500}
                  height={200}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
                <div className="absolute top-2 right-2 bg-green-900/70 text-green-400 text-xs px-2 py-1 rounded-full">
                  Active
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium">DeFi Lending Protocol</h3>
                <p className="text-sm text-gray-400 mt-1">DeFi • Ethereum</p>
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Raising</p>
                    <p className="font-medium">$120,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Minimum</p>
                    <p className="font-medium">$5,000</p>
                  </div>
                  <div>
                    <button
                      className="text-[#FF7171] flex items-center gap-1 hover:underline"
                    >
                      View <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="border border-gray-800 rounded-lg overflow-hidden group">
              <div className="h-40 bg-gray-800 relative overflow-hidden">
                <Image
                  src="/Frame 27 (3).png"
                  alt="Project"
                  width={500}
                  height={200}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
                <div className="absolute top-2 right-2 bg-purple-900/70 text-purple-400 text-xs px-2 py-1 rounded-full">
                  New
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium">Decentralized Identity Solution</h3>
                <p className="text-sm text-gray-400 mt-1">Infrastructure • Polygon</p>
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Raising</p>
                    <p className="font-medium">$180,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Minimum</p>
                    <p className="font-medium">$2,500</p>
                  </div>
                  <div>
                    <button
                      className="text-[#FF7171] flex items-center gap-1 hover:underline"
                    >
                      View <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Your Investments</h2>
            <button
              onClick={() => setActiveSection("investments")}
              className="text-[#FF7171] text-sm flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
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
                <button className="text-[#FF7171] text-sm hover:underline">Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default InvestorDashboard;