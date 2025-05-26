import { CheckCircle } from 'lucide-react'
import { PlusCircle, Flag } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import React from 'react'

type Props = {}

const RecentActivity = (props: Props) => {
  return (
    <div className="lg:col-span-3">
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Recent Activity</h2>
            <button className="text-[#FF7171] text-sm flex items-center gap-1 hover:underline">
              View all <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mt-1">
                  <PlusCircle size={18} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">New Project Submission</h3>
                  <p className="text-sm text-gray-400 mt-1">"Decentralized Identity Platform" was submitted by 0x7a...3f2e</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] text-white text-sm px-4 py-1.5 rounded-lg">Review</button>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center mt-1">
                  <Flag size={18} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium">Project Flagged</h3>
                  <p className="text-sm text-gray-400 mt-1">"DeFi Lending Protocol" has been flagged for review</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="border border-gray-700 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-800">View Project</button>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mt-1">
                  <CheckCircle size={18} className="text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Project Approved</h3>
                  <p className="text-sm text-gray-400 mt-1">"Web3 Social Network" project has been approved</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="border border-gray-700 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-800">View Project</button>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default RecentActivity