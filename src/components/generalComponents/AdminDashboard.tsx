"use client";

import React, { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Rocket, 
  LineChart, 
  Users, 
  Settings,
  ChevronRight,
  ArrowUpRight,
  PlusCircle,
  Flag,
  CheckCircle,
  X,
  Bell,
  Menu,
  LogOut
} from "lucide-react";
import { useAccount } from "wagmi";
import AdminProjectsList from "./admin/AdminProjectsList";
import AdminFlaggedProjects from "./admin/AdminFlaggedProjects";
import AdminUsersList from "./admin/AdminUsersList";
import AdminSettings from "./admin/AdminSettings";
import { useTheme } from "next-themes";
import RecentActivity from "./admin/RecentActivity";

interface AdminDashboardContextProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminDashboardContext = createContext<AdminDashboardContextProps>({
  activeSection: "dashboard",
  setActiveSection: () => {},
});

export const useAdminDashboard = () => useContext(AdminDashboardContext);

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const router = useRouter();
  const { address } = useAccount();
  const { theme, setTheme } = useTheme();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigation items for sidebar
  const navItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      active: activeSection === "dashboard",
    },
    { 
      id: "projects", 
      icon: <Rocket size={20} />, 
      label: "Projects", 
      active: activeSection === "projects" 
    },
    { 
      id: "flagged-projects", 
      icon: <Flag size={20} />, 
      label: "Flagged Projects", 
      active: activeSection === "flagged-projects" 
    },
    { 
      id: "users", 
      icon: <Users size={20} />, 
      label: "Users", 
      active: activeSection === "users" 
    },
    { 
      id: "settings", 
      icon: <Settings size={20} />, 
      label: "Settings", 
      active: activeSection === "settings" 
    },
  ];

  // Handle section change
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear any necessary auth state
    router.push("/");
  };

  // Helper function to get dashboard title
  const getDashboardTitle = () => {
    switch (activeSection) {
      case "dashboard": return "Admin Dashboard";
      case "projects": return "Project Management";
      case "flagged-projects": return "Flagged Projects";
      case "users": return "User Management";
      case "settings": return "Platform Settings";
      default: return "Admin Dashboard";
    }
  };

  // Helper function to get dashboard description
  const getDashboardDescription = () => {
    switch (activeSection) {
      case "dashboard": return "Monitor platform activity and manage operations";
      case "projects": return "Review and manage submitted projects";
      case "flagged-projects": return "Review projects that have been flagged for attention";
      case "users": return "Manage user accounts and permissions";
      case "settings": return "Configure platform settings and parameters";
      default: return "Monitor platform activity and manage operations";
    }
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboardOverview setActiveSection={setActiveSection} />;
      case "projects":
        return <AdminProjectsList />;
      case "flagged-projects":
        return <AdminFlaggedProjects />;
      case "users":
        return <AdminUsersList />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboardOverview setActiveSection={setActiveSection} />;
    }
  };

  // Preserve wallet redirection flow as mentioned in the memory
  // Wallets must be redirected to the appropriate page based on registration status
  React.useEffect(() => {
    // If no wallet is connected, redirect to home
    if (!address) {
      router.push("/");
    }
    
    // In a real implementation, you'd check if the user has admin rights here
    // and redirect them if they don't have the proper permissions
  }, [address, router]);

  return (
    <AdminDashboardContext.Provider value={{ activeSection, setActiveSection }}>
      <div className="flex min-h-screen bg-black text-white">
        {/* Sidebar - desktop */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:w-64 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2F50FF] to-[#FF7171]"></div>
                <span className="font-bold text-xl">Raise3</span>
              </div>
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-800 lg:hidden"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                      item.active
                        ? "bg-gradient-to-r from-[#2F50FF] to-[#FF7171] text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.active && <ChevronRight size={16} />}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-40 bg-black border-b border-gray-800 py-3 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
                >
                  <Menu size={20} />
                </button>
                <h1 className="ml-2 text-xl font-bold lg:hidden">Raise3</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
                >
                  {theme === "dark" ? <Bell size={18} /> : <Bell size={18} />}
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2F50FF] to-[#FF7171] flex items-center justify-center">
                    <span className="text-xs font-bold">AD</span>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium">Admin</div>
                    <div className="text-xs text-gray-400 truncate">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{getDashboardTitle()}</h1>
              <p className="text-gray-400 mt-1">{getDashboardDescription()}</p>
            </div>
            
            {renderContent()}
          </main>
        </div>
      </div>
    </AdminDashboardContext.Provider>
  );
};

// Admin Dashboard Overview Component
const AdminDashboardOverview = ({ setActiveSection }: { setActiveSection: (section: string) => void }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main stats */}
      <div className="lg:col-span-2">
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Total Projects</span>
                <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center">
                  <Rocket size={16} className="text-green-500" />
                </div>
              </div>
              <div className="text-2xl font-bold">24</div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <ArrowUpRight size={12} />
                <span className="ml-1">+5 this month</span>
              </div>
            </div>
            
            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Active Users</span>
                <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <Users size={16} className="text-blue-500" />
                </div>
              </div>
              <div className="text-2xl font-bold">152</div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <ArrowUpRight size={12} />
                <span className="ml-1">+12 this month</span>
              </div>
            </div>
            
            <div className="bg-[#111] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Flagged Projects</span>
                <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center">
                  <Flag size={16} className="text-red-500" />
                </div>
              </div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-red-500 mt-1 flex items-center">
                <ArrowUpRight size={12} />
                <span className="ml-1">+2 this week</span>
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
            onClick={() => setActiveSection("projects")}
            className="w-full flex items-center justify-between p-4 bg-[#111] rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2F50FF] to-[#FF7171] flex items-center justify-center">
                <Rocket size={16} className="text-white" />
              </div>
              <span className="ml-3 font-medium">Manage Projects</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
          
          <button 
            onClick={() => setActiveSection("flagged-projects")}
            className="w-full flex items-center justify-between p-4 bg-[#111] rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                <Flag size={16} className="text-red-500" />
              </div>
              <span className="ml-3 font-medium">Flagged Projects</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
          
          <button
            onClick={() => setActiveSection("users")}
            className="w-full flex items-center justify-between p-4 bg-[#111] rounded-xl hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                <Users size={16} className="text-[#2F50FF]" />
              </div>
              <span className="ml-3 font-medium">Manage Users</span>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Recent Activity section */}
      <RecentActivity />
    </div>
  );
};

export default AdminDashboard;
