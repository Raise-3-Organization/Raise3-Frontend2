import React, { useContext, useState } from "react";
import { useAccount } from "wagmi";
import { DashboardContext } from "../generalComponents/Dashboard";
import { useTransactionNotification } from "../TransactionNotification";
import { Rocket, LineChart, ArrowUpRight, CheckCircle, PlusCircle, ChevronRight, Clock, Users} from "lucide-react"
import MultiStepProjectForm from "../project/MultiStepProjectForm";
import ProjectList from "../ProjectList";
import ContractInitializer from "../ContractInitializer";
import FounderProjects from "./FounderProjects";
import CreateMilestone from "../milestone/CreateMilestone";
const FounderDashboard = () => {
    const { address } = useAccount();
    const { activeSection, setActiveSection } = useContext(DashboardContext);
    const {
      notifications,
      addNotification,
      removeNotification,
      updateNotification
    } = useTransactionNotification();
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  
    const handleOpenProjectForm = () => {
      setIsProjectFormOpen(true);
    };
  
    const handleCloseProjectForm = () => {
      setIsProjectFormOpen(false);
    };
  
    const handleProjectSubmit = (data: any) => {
      console.log("Project submitted:", data);
      setIsProjectFormOpen(false);
      // Show success notification
      addNotification("Project created successfully!", "success");
    };
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main stats */}
        <div className="lg:col-span-2">
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Project Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#111] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Active Projects</span>
                  <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center">
                    <Rocket size={16} className="text-green-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-green-500 mt-1 flex items-center">
                  <ArrowUpRight size={12} />
                  <span className="ml-1">+2 this month</span>
                </div>
              </div>
  
              <div className="bg-[#111] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Total Raised</span>
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                    <LineChart size={16} className="text-blue-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold">$150,000</div>
                <div className="text-xs text-green-500 mt-1 flex items-center">
                  <ArrowUpRight size={12} />
                  <span className="ml-1">+$25,000 this month</span>
                </div>
              </div>
  
              <div className="bg-[#111] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Milestones</span>
                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center">
                    <CheckCircle size={16} className="text-purple-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold">12 / 20</div>
                <div className="text-xs text-green-500 mt-1 flex items-center">
                  <ArrowUpRight size={12} />
                  <span className="ml-1">2 completed recently</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Quick actions */}
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={handleOpenProjectForm}
              className="w-full flex items-center justify-between p-4 bg-[#111] rounded-xl hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2F50FF] to-[#FF7171] flex items-center justify-center">
                  <PlusCircle size={16} className="text-white" />
                </div>
                <span className="ml-3 font-medium">Create New Project</span>
              </div>
              <ChevronRight size={18} className="text-gray-500" />
            </button>
            {isProjectFormOpen && (
              <MultiStepProjectForm onClose={handleCloseProjectForm} onSubmit={handleProjectSubmit} />
            )}
  
            <button
              onClick={() => setActiveSection("milestones")}
              className="w-full flex items-center justify-between p-4 bg-[#111] rounded-xl hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <Clock size={16} className="text-[#FF7171]" />
                </div>
                <span className="ml-3 font-medium">Update Milestones</span>
              </div>
              <ChevronRight size={18} className="text-gray-500" />
            </button>
  
            <button
              onClick={() => setActiveSection("investors")}
              className="w-full flex items-center justify-between p-4 bg-[#111] rounded-xl hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <Users size={16} className="text-[#FF7171]" />
                </div>
                <span className="ml-3 font-medium">View Investors</span>
              </div>
              <ChevronRight size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
  
        {/* My Projects section */}
        <div className="lg:col-span-3">
          <div className="bg-black border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">My Projects</h2>
              <button
                onClick={() => setActiveSection("projects")}
                className="text-[#FF7171] text-sm flex items-center gap-1 hover:underline"
              >
                View all <ChevronRight size={16} />
              </button>
            </div>
  
            {/* Blockchain Projects */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Blockchain Projects</h3>
              {/* <ContractInitializer> */}
                <ProjectList filterByFounder={address || undefined} />
              {/* </ContractInitializer> */}
            </div>
  
            {/* Static demo projects */}
            <FounderProjects />
  
          </div>
        </div>
      </div>
    );
  };

export default FounderDashboard;