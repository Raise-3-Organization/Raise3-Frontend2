"use client";

import React, { useState, useEffect, createContext } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Rocket, 
  LineChart, 
  FileText, 
  Clock, 
  Users, 
  Briefcase, 
  Settings,
  ChevronRight,
  BarChart3,
  Wallet,
  CheckCircle,
  PlusCircle,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Bell,
  Building
} from "lucide-react";
import { useTheme } from "next-themes";
import ProjectList from '../ProjectList';
import ProjectActions from '../ProjectActions';
import TransactionNotification, { useTransactionNotification } from '../TransactionNotification';
import { v4 as uuidv4 } from 'uuid';
import { useContract } from "@/context/ContractContext";
import { ethers } from "ethers";
import ContractInitializer from '../ContractInitializer';

type UserRole = "founder" | "investor" | "both";
type ActiveView = "founder" | "investor";

// Create Dashboard Context
interface DashboardContextProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  addNotification: (message: string, type?: string, duration?: number) => string;
  removeNotification: (id: string) => void;
  updateNotification: (id: string, updates: any) => void;
}

export const DashboardContext = createContext<DashboardContextProps>({
  activeSection: "dashboard",
  setActiveSection: () => {},
  activeView: "founder",
  setActiveView: () => {},
  addNotification: () => "",
  removeNotification: () => {},
  updateNotification: () => {},
});

const Dashboard = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("founder");
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Transaction notifications
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    updateNotification 
  } = useTransactionNotification();

  // Check if user is connected and registered
  useEffect(() => {
    setMounted(true);
    
    if (!isConnected) {
      router.push("/login");
      return;
    }

    // Simulate getting user role from API/database
    const fetchUserRole = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate unregistered user (first-time visitor)
      const isRegistered = localStorage.getItem(`user-registered-${address}`);
      
      if (!isRegistered) {
        setUserRole(null);
        setIsRegistrationModalOpen(true);
      } else {
        const savedRole = localStorage.getItem(`user-role-${address}`) as UserRole;
        setUserRole(savedRole || "both");
        setActiveView(localStorage.getItem(`user-active-view-${address}`) as ActiveView || "founder");
      }
      setIsLoading(false);
    };

    fetchUserRole();
  }, [isConnected, router, address]);

  // Handle role selection during registration
  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem(`user-role-${address}`, role);
    localStorage.setItem(`user-registered-${address}`, "true");
    
    // Set default active view based on role
    let view: ActiveView = "founder";
    if (role === "investor") {
      view = "investor";
    }
    
    setActiveView(view);
    localStorage.setItem(`user-active-view-${address}`, view);
    setIsRegistrationModalOpen(false);
  };

  // Handle view toggle between founder and investor
  const toggleView = (view: ActiveView) => {
    setActiveView(view);
    localStorage.setItem(`user-active-view-${address}`, view);
  };

  // Format address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem(`user-active-view-${address}`);
    router.push("/login");
  };

  // Registration Modal Component
  const RegistrationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#0B0B0F] border border-gray-800 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Select Your Role</h2>
        <p className="text-gray-300 mb-8 text-center text-sm font-krona">
          Choose how you want to participate in the Raise3 platform
        </p>
        
        <div className="space-y-4">
          <motion.button
            onClick={() => handleRoleSelection("founder")}
            className="w-full p-4 border border-gray-600 rounded-xl bg-[#111]/80 backdrop-blur-sm hover:border-[#FF7171] transition flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/50 rounded-lg mr-3">
                <Rocket size={24} className="text-[#FF7171]" />
              </div>
              <div className="text-left text-white">
                <h3 className="font-medium">Founder</h3>
                <p className="text-sm text-gray-400">Create and manage fundraising campaigns</p>
              </div>
            </div>
            <ChevronRight className="text-[#FF7171]" />
          </motion.button>
          
          <motion.button
            onClick={() => handleRoleSelection("investor")}
            className="w-full p-4 border border-gray-600 rounded-xl bg-[#111]/80 backdrop-blur-sm hover:border-[#FF7171] transition flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/50 rounded-lg mr-3">
                <LineChart size={24} className="text-[#2F50FF]" />
              </div>
              <div className="text-left text-white">
                <h3 className="font-medium">Investor</h3>
                <p className="text-sm text-gray-400">Browse and invest in campaigns</p>
              </div>
            </div>
            <ChevronRight className="text-[#FF7171]" />
          </motion.button>
          
          <motion.button
            onClick={() => handleRoleSelection("both")}
            className="w-full p-4 border border-gray-600 rounded-xl bg-[#111]/80 backdrop-blur-sm hover:border-[#FF7171] transition flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/50 rounded-lg mr-3">
                <Users size={24} className="text-[#9360BB]" />
              </div>
              <div className="text-left text-white">
                <h3 className="font-medium">Both Roles</h3>
                <p className="text-sm text-gray-400">Participate as both founder and investor</p>
              </div>
            </div>
            <ChevronRight className="text-[#FF7171]" />
          </motion.button>
        </div>
      </div>
    </div>
  );

  // Sidebar navigation items based on active view
  const getNavItems = () => {
    if (activeView === "founder") {
      return [
        { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", active: activeSection === "dashboard" },
        { id: "projects", icon: <Rocket size={20} />, label: "My Projects", active: activeSection === "projects" },
        { id: "create-project", icon: <FileText size={20} />, label: "Create Project", active: activeSection === "create-project" },
        { id: "milestones", icon: <Clock size={20} />, label: "Milestones", active: activeSection === "milestones" },
        { id: "investors", icon: <Users size={20} />, label: "Investors", active: activeSection === "investors" },
      ];
    } else {
      return [
        { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", active: activeSection === "dashboard" },
        { id: "investments", icon: <Briefcase size={20} />, label: "Investments", active: activeSection === "investments" },
        { id: "browse-projects", icon: <Rocket size={20} />, label: "Browse Projects", active: activeSection === "browse-projects" },
        { id: "performance", icon: <BarChart3 size={20} />, label: "Performance", active: activeSection === "performance" },
        { id: "wallet", icon: <Wallet size={20} />, label: "Wallet", active: activeSection === "wallet" },
      ];
    }
  };

  // Helper function to get dashboard title
  const getDashboardTitle = () => {
    if (activeView === "founder") {
      switch (activeSection) {
        case "dashboard": return "Founder Dashboard";
        case "projects": return "My Projects";
        case "create-project": return "Create New Project";
        case "milestones": return "Project Milestones";
        case "investors": return "Potential Investors";
        case "settings": return "Account Settings";
        default: return "Founder Dashboard";
      }
    } else {
      switch (activeSection) {
        case "dashboard": return "Investor Dashboard";
        case "investments": return "My Investments";
        case "browse-projects": return "Browse Projects";
        case "performance": return "Investment Performance";
        case "wallet": return "Wallet";
        case "settings": return "Account Settings";
        default: return "Investor Dashboard";
      }
    }
  };

  // Helper function to get dashboard description
  const getDashboardDescription = () => {
    if (activeView === "founder") {
      switch (activeSection) {
        case "dashboard": return "Manage your projects and milestones";
        case "projects": return "View and manage your existing projects";
        case "create-project": return "Set up a new fundraising project";
        case "milestones": return "Track and submit proofs for your project milestones";
        case "investors": return "View investors interested in your project type";
        case "settings": return "Manage your founder account settings";
        default: return "Manage your projects and milestones";
      }
    } else {
      switch (activeSection) {
        case "dashboard": return "Track your investments and find new opportunities";
        case "investments": return "Manage your current investments";
        case "browse-projects": return "Discover promising projects to invest in";
        case "performance": return "Monitor the performance of your investments";
        case "wallet": return "Manage your funds and transactions";
        case "settings": return "Manage your investor account settings";
        default: return "Track your investments and find new opportunities";
      }
    }
  };

  // Render founder content based on active section
  const renderFounderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <FounderDashboard />;
      case "projects":
        return <FounderProjects />;
      case "create-project":
        return <ContractInitializer><CreateProject /></ContractInitializer>;
      case "milestones":
        return <FounderMilestones />;
      case "investors":
        return <PotentialInvestors />;
      case "settings":
        return <FounderSettings />;
      default:
        return <FounderDashboard />;
    }
  };

  // Render investor content based on active section
  const renderInvestorContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <InvestorDashboard />;
      case "investments":
        return <InvestorInvestments />;
      case "browse-projects":
        return <ContractInitializer><BrowseProjects /></ContractInitializer>;
      case "performance":
        return <InvestmentPerformance />;
      case "wallet":
        return <InvestorWallet />;
      case "settings":
        return <InvestorSettings />;
      default:
        return <InvestorDashboard />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B0F] text-white">
        <div className="w-12 h-12 rounded-full border-2 border-[#FF7171] border-t-transparent animate-spin mb-4"></div>
        <p className="text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  // Registration required
  if (isRegistrationModalOpen) {
    return <RegistrationModal />;
  }

  return (
    <DashboardContext.Provider value={{ 
      activeSection, 
      setActiveSection,
      activeView,
      setActiveView: (view) => {
        setActiveView(view);
        localStorage.setItem(`user-active-view-${address}`, view);
      },
      addNotification,
      removeNotification,
      updateNotification
    }}>
      <div className="min-h-screen flex flex-col bg-[#0B0B0F] text-white">
        {/* Header */}
        <header className="border-b border-gray-800 bg-[#0B0B0F] backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            {/* Logo and mobile menu button */}
            <div className="flex items-center gap-4">
              <button 
                className="block md:hidden text-gray-400 hover:text-white" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-2">
                <Image src="/Subtract.png" alt="Raise3 Logo" width={28} height={28} />
                <span className="text-xl font-semibold text-white font-krona">Raise3</span>
              </div>
            </div>

            {/* Dashboard Role Toggle (Available for all users) */}
            <div className="hidden md:flex items-center bg-[#111] rounded-full p-1">
              <button
                onClick={() => toggleView("founder")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === "founder"
                    ? "bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Founder
              </button>
              <button
                onClick={() => toggleView("investor")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === "investor"
                    ? "bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Investor
              </button>
            </div>

            {/* User actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}
              
              {/* Notifications */}
              <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              
              {/* Profile */}
              <div className="flex items-center gap-2">
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{formatAddress(address)}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Role Toggle (Available for all users) */}
          <div className="md:hidden px-4 pb-4">
            <div className="flex items-center bg-[#111] rounded-full p-1">
              <button
                onClick={() => toggleView("founder")}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === "founder"
                    ? "bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Founder
              </button>
              <button
                onClick={() => toggleView("investor")}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === "investor"
                    ? "bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Investor
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Sidebar (desktop) or slide-over menu (mobile) */}
          <div
            className={`
              fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out
              md:static md:translate-x-0 md:mt-0 bg-black md:bg-transparent border-r border-gray-800
              ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="h-full md:h-auto md:sticky md:top-[83px] overflow-y-auto p-4">
              {/* Mobile logo and close button */}
              <div className="flex justify-between items-center mb-8 md:hidden">
                <div className="flex items-center space-x-2">
                  <Image src="/Subtract.png" alt="Raise3 Logo" width={24} height={24} />
                  <span className="text-lg font-semibold text-white">Raise3</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1">
                {getNavItems().map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                      ${
                        item.active
                          ? "bg-gradient-to-r from-[#2F50FF]/20 via-[#FF7171]/20 to-[#9360BB]/20 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Settings link at bottom */}
              <div className="mt-8">
                <button
                  onClick={() => {
                    setActiveSection("settings");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                    ${
                      activeSection === "settings"
                        ? "bg-gradient-to-r from-[#2F50FF]/20 via-[#FF7171]/20 to-[#9360BB]/20 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6">
            {/* Page title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {getDashboardTitle()}
              </h1>
              <p className="text-gray-400 mt-1 text-sm">
                {getDashboardDescription()}
              </p>
            </div>

            {/* Dashboard content */}
            {activeView === "founder" 
              ? renderFounderContent()
              : renderInvestorContent()
            }
          </main>
        </div>
      </div>
      
      {/* Transaction Notifications */}
      <TransactionNotification 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </DashboardContext.Provider>
  );
};

export default Dashboard; 

// Founder Dashboard Components
const FounderDashboard = () => {
  const { setActiveSection } = React.useContext(DashboardContext);
  
  return (
    <div className="space-y-8">
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-6">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Active Projects</div>
            <div className="text-2xl font-semibold mt-2">2</div>
          </div>
          <div className="bg-[#111] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Total Raised</div>
            <div className="text-2xl font-semibold mt-2">$120,500</div>
          </div>
          <div className="bg-[#111] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Completed Milestones</div>
            <div className="text-2xl font-semibold mt-2">8/12</div>
          </div>
        </div>
      </div>

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
        
        <div className="space-y-4">
          <div className="border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Decentralized Exchange Protocol</h3>
                <p className="text-sm text-gray-400 mt-1">DeFi • Ethereum</p>
              </div>
              <div className="bg-green-900/30 text-green-500 text-xs px-2 py-1 rounded-full">
                Active
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-400">$90,000 raised of $120,000</span>
              <button className="text-[#FF7171] font-medium hover:underline">Manage</button>
            </div>
          </div>
          
          <div className="border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Web3 Social Platform</h3>
                <p className="text-sm text-gray-400 mt-1">Social • Polygon</p>
              </div>
              <div className="bg-yellow-900/30 text-yellow-500 text-xs px-2 py-1 rounded-full">
                Pending KYC
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-400">Complete KYC to publish</span>
              <button className="text-[#FF7171] font-medium hover:underline">Complete KYC</button>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => setActiveSection("create-project")}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-800 rounded-lg text-gray-300 hover:text-white hover:border-gray-700 hover:bg-gray-900/50 transition-colors"
          >
            <PlusCircle size={20} />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Upcoming Milestones</h2>
          <button 
            onClick={() => setActiveSection("milestones")}
            className="text-[#FF7171] text-sm flex items-center gap-1 hover:underline"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="border border-gray-800 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">Smart Contract Audit</p>
              <p className="text-sm text-gray-400 mt-1">DeFi Exchange • Due in 5 days</p>
            </div>
            <button className="text-[#FF7171] hover:underline text-sm">Submit Proof</button>
          </div>
          <div className="border border-gray-800 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">Alpha Release</p>
              <p className="text-sm text-gray-400 mt-1">Web3 Social • Due in 12 days</p>
            </div>
            <button className="text-[#FF7171] hover:underline text-sm">Submit Proof</button>
          </div>
        </div>
      </div>
    </div>
  );
}; 

// Other Founder Components
const FounderProjects = () => (
  <div className="space-y-6">
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-medium mb-6">All Projects</h2>
      <div className="space-y-4">
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Decentralized Exchange Protocol</h3>
              <p className="text-sm text-gray-400 mt-1">DeFi • Ethereum</p>
            </div>
            <div className="bg-green-900/30 text-green-500 text-xs px-2 py-1 rounded-full">
              Active
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-gray-400">$90,000 raised of $120,000</span>
            <button className="text-[#FF7171] font-medium hover:underline">Manage</button>
          </div>
        </div>
        
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Web3 Social Platform</h3>
              <p className="text-sm text-gray-400 mt-1">Social • Polygon</p>
            </div>
            <div className="bg-yellow-900/30 text-yellow-500 text-xs px-2 py-1 rounded-full">
              Pending KYC
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">0%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-gray-400">Complete KYC to publish</span>
            <button className="text-[#FF7171] font-medium hover:underline">Complete KYC</button>
          </div>
        </div>

        <div className="border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">NFT Marketplace</h3>
              <p className="text-sm text-gray-400 mt-1">NFT • Ethereum</p>
            </div>
            <div className="bg-red-900/30 text-red-500 text-xs px-2 py-1 rounded-full">
              Funding Failed
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium">25%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "25%" }}></div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-gray-400">$15,000 raised of $100,000</span>
            <button className="text-[#FF7171] font-medium hover:underline">Archive</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CreateProject = () => (
  <div className="bg-black border border-gray-800 rounded-xl p-6">
    <h2 className="text-xl font-medium mb-6">Create a New Project</h2>
    
    {/* Smart Contract Integrated Project Creation */}
    <ProjectActions />
  </div>
);

const FounderMilestones = () => (
  <div className="bg-black border border-gray-800 rounded-xl p-6">
    <h2 className="text-xl font-medium mb-6">Project Milestones</h2>
    
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Select Project</label>
      <select className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none">
        <option value="dex">Decentralized Exchange Protocol</option>
        <option value="social">Web3 Social Platform</option>
      </select>
    </div>
    
    <div className="space-y-6">
      <div className="border border-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Smart Contract Audit</h3>
            <p className="text-sm text-gray-400 mt-1">Due in 5 days</p>
          </div>
          <div className="bg-yellow-900/30 text-yellow-500 text-xs px-2 py-1 rounded-full">
            Pending
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Complete a security audit from a reputable auditing firm to verify the security of the smart contracts.
          </p>
        </div>
        <div className="mt-4 border-t border-gray-800 pt-4">
          <h4 className="text-sm font-medium mb-2">Submit Proof</h4>
          <div className="flex gap-2">
            <input
              type="file"
              className="hidden"
              id="audit-file"
            />
            <label
              htmlFor="audit-file"
              className="flex-1 cursor-pointer px-4 py-2 border border-gray-600 rounded-lg text-center text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
            >
              Choose File
            </label>
            <button
              className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#2F50FF] to-[#FF7171] hover:opacity-90 text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Alpha Release</h3>
            <p className="text-sm text-gray-400 mt-1">Due in 12 days</p>
          </div>
          <div className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
            Upcoming
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Release an alpha version of the platform for initial testing with a small group of users.
          </p>
        </div>
      </div>
      
      <div className="border border-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Initial Smart Contract Deployment</h3>
            <p className="text-sm text-gray-400 mt-1">Completed on Sep 15, 2023</p>
          </div>
          <div className="bg-green-900/30 text-green-500 text-xs px-2 py-1 rounded-full">
            Completed
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Deploy the initial version of the smart contracts to the testnet.
          </p>
        </div>
        <div className="mt-4 border-t border-gray-800 pt-4">
          <h4 className="text-sm font-medium mb-2">Submitted Proof</h4>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-500" />
            <a href="#" className="text-[#FF7171] hover:underline">contract-deployment.pdf</a>
            <span className="text-gray-500">• Verified on Sep 16, 2023</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PotentialInvestors = () => (
  <div className="space-y-6">
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-medium mb-6">Potential Investors</h2>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
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
        </div>
        
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none"
            placeholder="Search investors by name or type"
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
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-[#2F50FF]">
                <Building size={20} />
              </div>
              <div>
                <h3 className="font-medium">Blue Horizon Capital</h3>
                <p className="text-sm text-gray-400 mt-1">VC Fund • Invested in 12 projects</p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">DeFi</span>
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">Infrastructure</span>
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">Gaming</span>
                </div>
              </div>
            </div>
            <button className="text-[#FF7171] font-medium hover:underline text-sm">Contact</button>
          </div>
        </div>
        
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center text-[#9360BB]">
                <div className="font-semibold">JD</div>
              </div>
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-gray-400 mt-1">Angel Investor • Invested in 5 projects</p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">NFT</span>
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">Social</span>
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">DeFi</span>
                </div>
              </div>
            </div>
            <button className="text-[#FF7171] font-medium hover:underline text-sm">Contact</button>
          </div>
        </div>
        
        <div className="border border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-900/30 flex items-center justify-center text-pink-400">
                <div className="font-semibold">DG</div>
              </div>
              <div>
                <h3 className="font-medium">DeGen DAO</h3>
                <p className="text-sm text-gray-400 mt-1">DAO • Invested in 8 projects</p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">Gaming</span>
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">NFT</span>
                  <span className="inline-block bg-gray-800 text-xs px-2 py-1 rounded-full">DeFi</span>
                </div>
              </div>
            </div>
            <button className="text-[#FF7171] font-medium hover:underline text-sm">Contact</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FounderSettings = () => {
  const [formData, setFormData] = useState({
    name: "John Smith",
    email: "john@example.com",
    projectType: "defi",
    blockchain: "ethereum",
    notifications: {
      email: true,
      milestones: true,
      investors: true
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving founder settings:", formData);
    // Handle submission logic here
  };

  return (
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-medium mb-6">Founder Account Settings</h2>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg font-medium mb-4">Profile Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Project Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Project Type</label>
              <select 
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none"
              >
                <option value="defi">DeFi</option>
                <option value="nft">NFT</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="gaming">Gaming</option>
                <option value="dao">DAO</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Blockchain</label>
              <select 
                name="blockchain"
                value={formData.blockchain}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none"
              >
                <option value="ethereum">Ethereum</option>
                <option value="solana">Solana</option>
                <option value="polygon">Polygon</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive emails about your projects</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#FF7171] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Milestone Reminders</p>
                <p className="text-sm text-gray-400">Get reminded about upcoming milestones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.notifications.milestones}
                  onChange={() => handleNotificationChange('milestones')}
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#FF7171] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Investor Alerts</p>
                <p className="text-sm text-gray-400">Get notified when new investors show interest</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.notifications.investors}
                  onChange={() => handleNotificationChange('investors')}
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#FF7171] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// Investor Dashboard Components
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
      <ProjectList />
    </div>
  </div>
); 

const InvestorSettings = () => {
  const [formData, setFormData] = useState({
    name: "Jane Doe",
    email: "jane@example.com",
    investorType: "angel",
    investmentSize: "medium",
    categories: {
      defi: true,
      nft: true,
      gaming: true,
      infrastructure: false,
      dao: false,
      social: false
    },
    notifications: {
      newProjects: true,
      milestones: true,
      reports: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category as keyof typeof prev.categories]
      }
    }));
  };

  const handleNotificationChange = (key: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - send data to backend, etc.
    console.log("Saving settings:", formData);
    // Show success message or handle errors
  };

  return (
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-medium mb-6">Investor Account Settings</h2>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg font-medium mb-4">Profile Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#2F50FF] outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#2F50FF] outline-none"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Investment Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Investor Type</label>
              <select 
                name="investorType"
                value={formData.investorType}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#2F50FF] outline-none"
              >
                <option value="angel">Angel Investor</option>
                <option value="vc">VC Fund</option>
                <option value="dao">DAO</option>
                <option value="retail">Retail Investor</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Investment Size</label>
              <select 
                name="investmentSize"
                value={formData.investmentSize}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#111]/80 backdrop-blur-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#2F50FF] outline-none"
              >
                <option value="small">Small ($1k - $10k)</option>
                <option value="medium">Medium ($10k - $50k)</option>
                <option value="large">Large ($50k - $250k)</option>
                <option value="xlarge">X-Large ($250k+)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Investment Categories (select multiple)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="defi" 
                  className="mr-2" 
                  checked={formData.categories.defi}
                  onChange={() => handleCheckboxChange('defi')} 
                />
                <label htmlFor="defi">DeFi</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="nft" 
                  className="mr-2" 
                  checked={formData.categories.nft}
                  onChange={() => handleCheckboxChange('nft')} 
                />
                <label htmlFor="nft">NFT</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="gaming" 
                  className="mr-2" 
                  checked={formData.categories.gaming}
                  onChange={() => handleCheckboxChange('gaming')} 
                />
                <label htmlFor="gaming">Gaming</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="infrastructure" 
                  className="mr-2" 
                  checked={formData.categories.infrastructure}
                  onChange={() => handleCheckboxChange('infrastructure')} 
                />
                <label htmlFor="infrastructure">Infrastructure</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="dao" 
                  className="mr-2" 
                  checked={formData.categories.dao}
                  onChange={() => handleCheckboxChange('dao')} 
                />
                <label htmlFor="dao">DAO</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="social" 
                  className="mr-2" 
                  checked={formData.categories.social}
                  onChange={() => handleCheckboxChange('social')} 
                />
                <label htmlFor="social">Social</label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Project Alerts</p>
                <p className="text-sm text-gray-400">Receive emails about new projects that match your preferences</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.notifications.newProjects}
                  onChange={() => handleNotificationChange('newProjects')}
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#2F50FF] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Milestone Completion Notifications</p>
                <p className="text-sm text-gray-400">Get notified when projects you've invested in complete milestones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.notifications.milestones}
                  onChange={() => handleNotificationChange('milestones')}
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#2F50FF] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Performance Reports</p>
                <p className="text-sm text-gray-400">Receive weekly performance reports for your investments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.notifications.reports}
                  onChange={() => handleNotificationChange('reports')}
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#2F50FF] peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const InvestmentPerformance = () => (
  <div className="space-y-6">
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-medium mb-6">Investment Performance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#111] p-4 rounded-lg">
          <div className="text-sm text-gray-400">Total Invested</div>
          <div className="text-2xl font-semibold mt-2">$85,000</div>
        </div>
        <div className="bg-[#111] p-4 rounded-lg">
          <div className="text-sm text-gray-400">Current Value</div>
          <div className="text-2xl font-semibold mt-2 text-green-500">$102,500</div>
        </div>
        <div className="bg-[#111] p-4 rounded-lg">
          <div className="text-sm text-gray-400">Performance</div>
          <div className="text-2xl font-semibold mt-2 text-green-500">+20.6%</div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Investment Breakdown</h3>
          <div className="space-y-4">
            <div className="border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">DeFi Investments</h4>
                  <p className="text-sm text-gray-400 mt-1">2 projects • $55,000 invested</p>
                </div>
                <div className="text-green-500 font-medium">+32%</div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-[#FF7171] h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>65% of portfolio</span>
                  <span>Current value: $72,600</span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Gaming Investments</h4>
                  <p className="text-sm text-gray-400 mt-1">1 project • $30,000 invested</p>
                </div>
                <div className="text-red-500 font-medium">-5%</div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-[#2F50FF] h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>35% of portfolio</span>
                  <span>Current value: $28,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Milestone Progress</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-medium">Total Milestones Completed</h4>
                </div>
                <div className="font-medium">9/12</div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#2F50FF] to-[#FF7171] h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>75% completion rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InvestorWallet = () => {
  return (
    <div className="space-y-6">
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-6">Wallet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Total Balance</div>
            <div className="text-2xl font-semibold mt-2">$10,500</div>
          </div>
          <div className="bg-[#111] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Pending Withdrawals</div>
            <div className="text-2xl font-semibold mt-2">$2,000</div>
          </div>
          <div className="bg-[#111] p-4 rounded-lg">
            <div className="text-sm text-gray-400">Total Investments</div>
            <div className="text-2xl font-semibold mt-2">$85,000</div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <button className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#2F50FF] to-[#4364ff] hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            Deposit
          </button>
          <button className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#FF7171] to-[#ff8585] hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            Withdraw
          </button>
        </div>
      </div>

      {/* Donation Form Section - Moved from Founder to Investor tab */}
      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-6">Invest in Project</h2>
        <ContractInitializer>
          <InvestorDonationForm />
        </ContractInitializer>
      </div>

      <div className="bg-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-medium mb-6">Transaction History</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                    </div>
                    <span>Deposit</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-500">+$5,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">2023-06-15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-500">Completed</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-500/20 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                    </div>
                    <span>Withdraw</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-500">-$2,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">2023-06-10</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/30 text-yellow-500">Pending</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
                    </div>
                    <span>Investment</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-500">-$30,000</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">2023-05-28</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-500">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component to handle just the donation form for investors
const InvestorDonationForm = () => {
  const { isConnected: isContractConnected, donateToProject } = useContract();
  const { isConnected: isWagmiConnected } = useAccount();
  const { addNotification } = React.useContext(DashboardContext);
  const [donationData, setDonationData] = useState({
    projectId: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Handle donation input changes
  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonationData(prev => ({ ...prev, [name]: value }));
  };

  // Handle donation submission
  const handleDonate = async (e) => {
    e.preventDefault();
    
    // Check both Wagmi and contract connection status
    if (!isWagmiConnected) {
      addNotification('Please connect your wallet first', 'error');
      return;
    }
    
    // If Wagmi says we're connected but contract doesn't, try to force a refresh
    if (!isContractConnected) {
      addNotification('Wallet connected but contract not initialized. Please refresh the page.', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Show pending notification
      addNotification('Processing donation, please confirm in your wallet...', 'info', 0);

      const tx = await donateToProject(
        donationData.projectId,
        ethers.utils.parseEther(donationData.amount)
      );

      // Update notification while waiting for transaction
      addNotification('Transaction submitted. Waiting for confirmation...', 'info', 0);
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Show success notification
      addNotification(`Successfully donated ${donationData.amount} ETH to project #${donationData.projectId}!`, 'success');
      
      // Reset form
      setDonationData({
        projectId: '',
        amount: ''
      });
    } catch (error) {
      console.error('Error donating to project:', error);
      addNotification(`Error donating: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleDonate}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">Project ID</label>
            <input
              type="number"
              name="projectId"
              value={donationData.projectId}
              onChange={handleDonationChange}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-[#FF7171] focus:ring-[#FF7171]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white">Amount (ETH)</label>
            <input
              type="number"
              name="amount"
              value={donationData.amount}
              onChange={handleDonationChange}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-[#FF7171] focus:ring-[#FF7171]"
              step="0.01"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !isWagmiConnected || !isContractConnected}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7171] disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Invest in Project'}
          </button>
        </div>
      </form>
    </div>
  );
};