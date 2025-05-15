"use client";

import React, { useState, useEffect, createContext, useRef, useContext } from "react";
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
  Building,
  Search,
  Clock8
} from "lucide-react";
import { useTheme } from "next-themes";
import ProjectList from '../ProjectList';
import ProjectActions from '../ProjectActions';
import TransactionNotification, { useTransactionNotification } from '../TransactionNotification';
import { useContract } from "@/context/ContractContext";
import { ethers } from "ethers";
import ContractInitializer from '../ContractInitializer';
import Footer from "@/components/landingPage/Footer";
import TopNavigation from "./TopNavigation";
import SearchBar from "./SearchBar";
import EmptyProjectState from "./EmptyProjectState";
import MultiStepProjectForm from "../project/MultiStepProjectForm";
import FounderProjects from "../dashboard/FounderProjects";
import { useRoles } from "@/hooks/useRoles";
import BrowseProjects from "../dashboard/BrowseProjects";
import FounderDashboard from "../dashboard/FounderDashBoard";
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
  setActiveSection: () => { },
  activeView: "founder",
  setActiveView: () => { },
  addNotification: () => "",
  removeNotification: () => { },
  updateNotification: () => { },
});

const Dashboard = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("founder");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const { isFounderRole, isInvestorRole } = useRoles(address || '');


  // Create a ref to track redirect status at component level, not inside useEffect
  const redirectingRef = useRef(false);

  // Import notification utilities
  const {
    notifications,
    addNotification,
    removeNotification,
    updateNotification
  } = useTransactionNotification();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is connected and registered
  // useEffect(() => {
  //   setMounted(true);

  //   // Only perform checks if component is mounted
  //   if (!mounted) return;

  //   // No need to re-declare redirectingRef here since we're using the component level one

  //   const checkConnection = async () => {
  //     // Only redirect if we're sure the user isn't connected
  //     // This prevents flickering during wallet connection
  //     if (!isConnected && mounted && !redirectingRef.current) {
  //       console.log("User not connected, redirecting to login");
  //       redirectingRef.current = true;
  //       router.push("/");
  //       return;
  //     }

  //     if (isConnected && mounted) {
  //       // Simulate getting user role from API/database
  //       const fetchUserRole = async () => {
  //         try {
  //           // Simulate API call delay
  //           await new Promise(resolve => setTimeout(resolve, 800));

  //           // Check if user is registered - use the same key pattern as WalletRedirector
  //           const isRegistered = localStorage.getItem(`userType-${address}`);
  //           const savedRole = localStorage.getItem(`userRole-${address}`);

  //           if (!isRegistered && !savedRole) {
  //             setUserRole(null);
  //             setIsRegistrationModalOpen(true);
  //           } else {
  //             // Convert role string format to match our expected types
  //             const roleValue = savedRole?.toLowerCase() as UserRole || "both";
  //             setUserRole(roleValue);
  //             // Keep track of active view preference separately
  //             setActiveView(localStorage.getItem(`user-active-view-${address}`) as ActiveView || "founder");
  //           }
  //         } catch (error) {
  //           console.error("Error fetching user role:", error);
  //         } finally {
  //           setIsLoading(false);
  //         }
  //       };

  //       fetchUserRole();
  //     }
  //   };

  //   checkConnection();

  //   // Only add isConnected to dependency array
  //   // We don't want to re-run this on router or address changes
  // }, [isConnected, mounted, router, address]);

  // Handle role selection during registration
  const handleRoleSelection = (role: UserRole) => {
    // Store selected role - use the same key pattern as WalletRedirector
    localStorage.setItem(`userRole-${address}`, role);
    localStorage.setItem(`userType-${address}`, 'registered');

    // Initialize active view based on role
    const defaultView: ActiveView = (role === "investor") ? "investor" : "founder";
    localStorage.setItem(`user-active-view-${address}`, defaultView);
    setActiveView(defaultView);
    setIsRegistrationModalOpen(false);
  };

  // Handle view toggle between founder and investor
  const toggleView = (view: ActiveView) => {
    setActiveView(view);
    localStorage.setItem(`user-active-view-${address}`, view);
  };


  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Logout function
  // const handleLogout = () => {
  //   localStorage.removeItem(`user-active-view-${address}`);
  //   router.push("/login");
  // };

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
        {
          id: "dashboard",
          icon: <LayoutDashboard size={20} />,
          label: "Dashboard",
          active: activeSection === "dashboard",
          onClick: () => setActiveSection("dashboard"),
        },
        {
          id: "campaigns",
          icon: <Rocket size={20} />,
          label: "My Campaigns",
          active: activeSection === "campaigns",
          onClick: () => setActiveSection("campaigns"),
        },
        {
          id: "messages",
          icon: <FileText size={20} />,
          label: "Messages",
          active: activeSection === "messages",
          onClick: () => setActiveSection("messages"),
        },
        {
          id: "notifications",
          icon: <Bell size={20} />,
          label: "Notifications",
          active: activeSection === "notifications",
          onClick: () => setActiveSection("notifications"),
        },
      ];
    } else {
      return [
        {
          id: "dashboard",
          icon: <LayoutDashboard size={20} />,
          label: "Dashboard",
          active: activeSection === "dashboard",
          onClick: () => setActiveSection("dashboard"),
        },
        {
          id: "investments",
          icon: <Briefcase size={20} />,
          label: "Investments",
          active: activeSection === "investments",
          onClick: () => setActiveSection("investments"),
        },
        {
          id: "browse-projects",
          icon: <Rocket size={20} />,
          label: "Browse Projects",
          active: activeSection === "browse-projects",
          onClick: () => {
            console.log("browse project");
            setActiveSection("browse-projects")
          },
        },
        {
          id: "performance",
          icon: <BarChart3 size={20} />,
          label: "Performance",
          active: activeSection === "performance",
          onClick: () => setActiveSection("performance"),
        },
        {
          id: "wallet",
          icon: <Wallet size={20} />,
          label: "Wallet",
          active: activeSection === "wallet",
          onClick: () => setActiveSection("wallet"),
          subItems: [
            {
              id: "settings",
              icon: <Settings size={20} />,
              label: "Settings",
              active: activeSection === "settings",
              onClick: () => setActiveSection("settings"),
            },
          ],
        },
      ];
    }
  };

  // Helper function to get dashboard title
  const getDashboardTitle = () => {
    if (activeView === "founder") {
      switch (activeSection) {
        case "dashboard": return "Founder Dashboard";
        case "campaigns": return "My Campaigns";
        case "messages": return "Messages";
        case "notifications": return "Notifications";
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
        case "campaigns": return "View and manage your existing campaigns";
        case "messages": return "Send and receive messages with investors";
        case "notifications": return "Manage notifications for your projects";
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
      case "campaigns":
        return <FounderProjects />;
      case "create-project":
        return <CreateProject />;
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
        return <BrowseProjects />
      // return <ContractInitializer><BrowseProjects /></ContractInitializer>;
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
  
  // Load dashboard content based on role
  const renderContent = () => {
    if (activeView === "founder") {
      return renderFounderContent();
    } else {
      return renderInvestorContent();
    }
  };

  // Create Dashboard context value
  const dashboardContextValue = {
    activeSection,
    setActiveSection,
    activeView,
    setActiveView,
    addNotification,
    removeNotification,
    updateNotification,
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7171]"></div>
      </div>
    );
  }

  if (isRegistrationModalOpen) {
    return <RegistrationModal />;
  }

  const handleAddProject = () => {
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
    <DashboardContext.Provider value={dashboardContextValue}>
      <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row max-w-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0B0B0F] border-r border-gray-800 h-screen sticky top-0 overflow-y-auto">
          {/* Logo */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Image src="/Subtract.png" alt="Raise3 Logo" width={28} height={28} />
              <span className="text-xl font-bold">Raise3</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {getNavItems().map((item) => (
                <li key={item.id}>
                  <button
                    onClick={item.onClick}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active
                        ? "bg-[#181818] text-white font-medium"
                        : "text-gray-400 hover:bg-[#181818] hover:text-white"
                      }`}
                  >
                    <span className={item.active ? "text-[#FF7171]" : ""}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                  {item.subItems && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={subItem.onClick}
                            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${subItem.active
                                ? "bg-[#181818] text-white font-medium"
                                : "text-gray-400 hover:bg-[#181818] hover:text-white"
                              }`}
                          >
                            <span className={subItem.active ? "text-[#FF7171]" : ""}>{subItem.icon}</span>
                            <span>{subItem.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-70" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-[#0B0B0F] border-r border-gray-800 z-50 overflow-y-auto">
              {/* Mobile sidebar content */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image src="/Subtract.png" alt="Raise3 Logo" width={28} height={28} />
                    <span className="text-xl font-bold">Raise3</span>
                  </div>
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {getNavItems().map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active
                            ? "bg-[#181818] text-white font-medium"
                            : "text-gray-400 hover:bg-[#181818] hover:text-white"
                          }`}
                      >
                        <span className={item.active ? "text-[#FF7171]" : ""}>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Content container */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Project Form Modal */}
          {isProjectFormOpen && (
            <MultiStepProjectForm onClose={handleCloseProjectForm} onSubmit={handleProjectSubmit} />
          )}
          {/* Mobile Header */}
          <header className="border-b border-gray-800 bg-[#0B0B0F] backdrop-blur-md sticky top-0 z-30 w-full lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Logo and mobile menu button */}
              <div className="flex items-center gap-3">
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu size={22} />
                </button>
                <div className="flex items-center space-x-2">
                  <Image src="/Subtract.png" alt="Raise3 Logo" width={24} height={24} />
                  <span className="text-lg font-bold">Raise3</span>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 relative"
                >
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {/* Role toggle - Always visible */}
                <div className="flex rounded-lg bg-[#111] overflow-hidden">
                  <button
                    onClick={() => toggleView("founder")}
                    className={`px-4 py-2 text-sm font-medium ${activeView === "founder"
                        ? "bg-gradient-to-r from-[#FF7171] to-[#FF4E4E] text-white"
                        : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Founder
                  </button>
                  <button
                    onClick={() => toggleView("investor")}
                    className={`px-4 py-2 text-sm font-medium ${activeView === "investor"
                        ? "bg-gradient-to-r from-[#2F50FF] to-[#1E3FD8] text-white"
                        : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Investor
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Desktop Header */}
          <TopNavigation walletAddress={address} onSwitchView={() => toggleView(activeView === "founder" ? "investor" : "founder")} />

          {/* Content */}
          <main className="flex-1 bg-black text-white">
            {/* Dashboard Content */}
            {/* <div className="p-6">
              <h1 className="text-2xl font-bold mb-1 text-white">Dashboard</h1>
              <p className="text-gray-400 mb-8">
                Explore our curated list of grant programs for innovators and creators: from tech pioneers to community
                leaders, there is a grant program to elevate your project.
              </p>

             
              <EmptyProjectState walletAddress={address} onAddProject={handleAddProject} />
            </div> */}
            {activeView === "founder" ? renderFounderContent() : renderInvestorContent()}
          </main>

          {/* Footer */}
          <Footer />
        </div>

        {/* Notifications */}
        <TransactionNotification notifications={notifications} removeNotification={removeNotification} />
      </div>
    </DashboardContext.Provider>
  );
};

export default Dashboard;


// Other Founder Components

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
  const handleDonationChange = (e: DonationInputEvent) => {
    const { name, value } = e.target;
    setDonationData(prev => ({ ...prev, [name]: value }));
  };

  // Handle donation submission
  const handleDonate = async (e: DonationFormEvent) => {
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
      addNotification('Processing investment, please confirm in your wallet...', 'info', 0);

      // Verify we have the donateToProject function
      if (!donateToProject || typeof donateToProject !== 'function') {
        throw new Error('Donation function not available. Please try again later.');
      }

      // Convert projectId to number and amount to BigNumber
      const projectId = parseInt(donationData.projectId);
      const amount = ethers.utils.parseEther(donationData.amount);

      console.log(`Investing ${donationData.amount} ETH in project ID: ${projectId}`);

      const tx = await donateToProject(
        projectId.toString(),
        amount.toString()
      );

      // Update notification while waiting for transaction
      addNotification('Transaction submitted. Waiting for confirmation...', 'info', 0);

      // Wait for transaction confirmation
      await tx.wait();

      // Show success notification
      addNotification(`Successfully invested ${donationData.amount} ETH in project #${donationData.projectId}!`, 'success');

      // Reset form
      setDonationData({
        projectId: '',
        amount: ''
      });
    } catch (error: unknown) {
      console.error("Error donating to project:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addNotification(`Error investing: ${errorMessage}`, "error");
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
