"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { 
  Rocket, 
  LineChart, 
  Users, 
  ChevronRight,
  ArrowRight,
  Mail,
  Building,
  CheckCircle,
  ArrowUpRight 
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type UserRole = 'founder' | 'investor' | 'both';
type FounderProjectType = 'infrastructure' | 'defi' | 'gaming' | 'nft' | 'dao' | 'other';
type BlockchainPreference = 'ethereum' | 'solana' | 'polygon' | 'other';
type InvestorType = 'angel' | 'dao' | 'vc' | 'retail';

interface RegistrationProps {
  onComplete?: () => void;
}

const Registration = React.memo(({ onComplete }: RegistrationProps) => {
  const router = useRouter();
  const { address } = useAccount();
  
  // Registration steps
  const [step, setStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Founder profile
  const [founderName, setFounderName] = useState<string>('');
  const [founderEmail, setFounderEmail] = useState<string>('');
  const [projectType, setProjectType] = useState<FounderProjectType | null>(null);
  const [blockchainPreference, setBlockchainPreference] = useState<BlockchainPreference | null>(null);
  
  // Investor profile
  const [investorType, setInvestorType] = useState<InvestorType | null>(null);
  const [investorName, setInvestorName] = useState<string>('');
  const [investorEmail, setInvestorEmail] = useState<string>('');
  
  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  // Validate founder profile
  const validateFounderProfile = useCallback(() => {
    const newErrors: {[key: string]: string} = {};
    
    if (!founderName.trim()) newErrors.founderName = 'Name is required';
    if (!founderEmail.trim()) {
      newErrors.founderEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(founderEmail)) {
      newErrors.founderEmail = 'Please enter a valid email';
    }
    if (!projectType) newErrors.projectType = 'Project type is required';
    if (!blockchainPreference) newErrors.blockchainPreference = 'Blockchain preference is required';
    
    // Only update errors state if there are actual changes
    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
    return Object.keys(newErrors).length === 0;
  }, [founderName, founderEmail, projectType, blockchainPreference, errors]);

  // Validate investor profile
  const validateInvestorProfile = useCallback(() => {
    const newErrors: {[key: string]: string} = {};
    
    if (!investorType) newErrors.investorType = 'Investor type is required';
    if (!investorName.trim()) newErrors.investorName = 'Name is required';
    if (!investorEmail.trim()) {
      newErrors.investorEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(investorEmail)) {
      newErrors.investorEmail = 'Please enter a valid email';
    }
    
    // Only update errors state if there are actual changes
    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
    return Object.keys(newErrors).length === 0;
  }, [investorName, investorEmail, investorType, errors]);

  // Handle form submission
  const handleSubmit = () => {
    if (selectedRole === 'founder' || selectedRole === 'both') {
      if (!validateFounderProfile()) return;
    }
    
    if (selectedRole === 'investor' || selectedRole === 'both') {
      if (!validateInvestorProfile()) return;
    }
    
    // Store user data in localStorage for demo purposes
    // In a real app, this would be sent to a server
    localStorage.setItem(`user-registered-${address}`, 'true');
    localStorage.setItem(`user-role-${address}`, selectedRole as string);
    
    // Store default active view based on role
    if (selectedRole === 'investor') {
      localStorage.setItem(`user-active-view-${address}`, 'investor');
    } else {
      localStorage.setItem(`user-active-view-${address}`, 'founder');
    }
    
    // Store profile data
    if (selectedRole === 'founder' || selectedRole === 'both') {
      localStorage.setItem(`founder-profile-${address}`, JSON.stringify({
        name: founderName,
        email: founderEmail,
        projectType,
        blockchainPreference
      }));
    }
    
    if (selectedRole === 'investor' || selectedRole === 'both') {
      localStorage.setItem(`investor-profile-${address}`, JSON.stringify({
        name: investorName,
        email: investorEmail,
        investorType
      }));
    }
    
    // Navigate to dashboard or call completion callback
    if (onComplete) {
      onComplete();
    } else {
      router.push('/dashboard');
    }
  };

  // Optimize the onChange event handlers
  const handleFounderNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFounderName(e.target.value);
  }, []);

  const handleFounderEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFounderEmail(e.target.value);
  }, []);

  const handleInvestorNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestorName(e.target.value);
  }, []);

  const handleInvestorEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestorEmail(e.target.value);
  }, []);

  // Step 1: Role Selection
  const RoleSelectionStep = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center">Select Your Role</h2>
      <p className="text-gray-300 font-krona text-center text-sm">
        Choose how you want to participate in the Raise3 platform
      </p>
      
      <div className="space-y-4 mt-6">
        <motion.button
          onClick={() => handleRoleSelect('founder')}
          className="w-full p-4 border border-gray-600 rounded-xl bg-[#111]/80 backdrop-blur-sm hover:border-[#FF7171] transition flex items-center justify-between"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-900/50 rounded-lg mr-4">
              <Rocket size={24} className="text-[#FF7171]" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Founder</h3>
              <p className="text-sm text-gray-400">Create and manage fundraising campaigns</p>
            </div>
          </div>
          <ChevronRight className="text-[#FF7171]" />
        </motion.button>
        
        <motion.button
          onClick={() => handleRoleSelect('investor')}
          className="w-full p-4 border border-gray-600 rounded-xl bg-[#111]/80 backdrop-blur-sm hover:border-[#FF7171] transition flex items-center justify-between"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-900/50 rounded-lg mr-4">
              <LineChart size={24} className="text-[#2F50FF]" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Investor</h3>
              <p className="text-sm text-gray-400">Browse and invest in campaigns</p>
            </div>
          </div>
          <ChevronRight className="text-[#FF7171]" />
        </motion.button>
        
        <motion.button
          onClick={() => handleRoleSelect('both')}
          className="w-full p-4 border border-gray-600 rounded-xl bg-[#111]/80 backdrop-blur-sm hover:border-[#FF7171] transition flex items-center justify-between"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-900/50 rounded-lg mr-4">
              <Users size={24} className="text-[#9360BB]" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Both Roles</h3>
              <p className="text-sm text-gray-400">Participate as both founder and investor</p>
            </div>
          </div>
          <ChevronRight className="text-[#FF7171]" />
        </motion.button>
      </div>
    </motion.div>
  );

  // Step 2: Profile Setup
  const ProfileSetupStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
      
      {/* Founder Profile */}
      {(selectedRole === 'founder' || selectedRole === 'both') && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Rocket size={20} className="text-[#FF7171]" />
            Founder Profile
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={founderName}
                  onChange={handleFounderNameChange}
                  className={`w-full p-3 bg-[#111]/80 backdrop-blur-sm border ${
                    errors.founderName ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none`}
                  placeholder="Your name or company name"
                />
                {errors.founderName && (
                  <p className="text-red-500 text-xs mt-1">{errors.founderName}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={founderEmail}
                  onChange={handleFounderEmailChange}
                  className={`w-full pl-10 p-3 bg-[#111]/80 backdrop-blur-sm border ${
                    errors.founderEmail ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-[#FF7171] outline-none`}
                  placeholder="your-email@example.com"
                />
                {errors.founderEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.founderEmail}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Project Type</label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
                  { value: 'defi', label: 'DeFi', icon: '💰' },
                  { value: 'gaming', label: 'Gaming', icon: '🎮' },
                  { value: 'nft', label: 'NFT', icon: '🖼️' },
                  { value: 'dao', label: 'DAO', icon: '🏛️' },
                  { value: 'other', label: 'Other', icon: '✨' },
                ].map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setProjectType(type.value as FounderProjectType)}
                    className={`p-3 border ${
                      projectType === type.value
                        ? 'border-[#FF7171] bg-[#FF7171]/10'
                        : 'border-gray-600 bg-[#111]/80'
                    } rounded-lg cursor-pointer hover:border-[#FF7171] transition text-center`}
                  >
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="text-sm">{type.label}</div>
                  </div>
                ))}
              </div>
              {errors.projectType && (
                <p className="text-red-500 text-xs mt-1">{errors.projectType}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Blockchain</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'ethereum', label: 'Ethereum', icon: '/icons/eth.svg' },
                  { value: 'solana', label: 'Solana', icon: '/icons/sol.svg' },
                  { value: 'polygon', label: 'Polygon', icon: '/icons/polygon.svg' },
                  { value: 'other', label: 'Other', icon: '/icons/other-chain.svg' },
                ].map((chain) => (
                  <div
                    key={chain.value}
                    onClick={() => setBlockchainPreference(chain.value as BlockchainPreference)}
                    className={`p-3 border ${
                      blockchainPreference === chain.value
                        ? 'border-[#FF7171] bg-[#FF7171]/10'
                        : 'border-gray-600 bg-[#111]/80'
                    } rounded-lg cursor-pointer hover:border-[#FF7171] transition flex items-center gap-2`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Image src={chain.icon} alt={chain.label} width={20} height={20} />
                    </div>
                    <div className="text-sm">{chain.label}</div>
                  </div>
                ))}
              </div>
              {errors.blockchainPreference && (
                <p className="text-red-500 text-xs mt-1">{errors.blockchainPreference}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Investor Profile */}
      {(selectedRole === 'investor' || selectedRole === 'both') && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChart size={20} className="text-[#2F50FF]" />
            Investor Profile
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={investorName}
                  onChange={handleInvestorNameChange}
                  className={`w-full p-3 bg-[#111]/80 backdrop-blur-sm border ${
                    errors.investorName ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-[#2F50FF] outline-none`}
                  placeholder="Your name or company name"
                />
                {errors.investorName && (
                  <p className="text-red-500 text-xs mt-1">{errors.investorName}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={investorEmail}
                  onChange={handleInvestorEmailChange}
                  className={`w-full pl-10 p-3 bg-[#111]/80 backdrop-blur-sm border ${
                    errors.investorEmail ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-[#2F50FF] outline-none`}
                  placeholder="your-email@example.com"
                />
                {errors.investorEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.investorEmail}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Investor Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'angel', label: 'Angel Investor', icon: '👼' },
                  { value: 'vc', label: 'VC Fund', icon: '🏢' },
                  { value: 'dao', label: 'DAO', icon: '🏛️' },
                  { value: 'retail', label: 'Retail Investor', icon: '👤' },
                ].map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setInvestorType(type.value as InvestorType)}
                    className={`p-3 border ${
                      investorType === type.value
                        ? 'border-[#2F50FF] bg-[#2F50FF]/10'
                        : 'border-gray-600 bg-[#111]/80'
                    } rounded-lg cursor-pointer hover:border-[#2F50FF] transition text-center`}
                  >
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="text-sm">{type.label}</div>
                  </div>
                ))}
              </div>
              {errors.investorType && (
                <p className="text-red-500 text-xs mt-1">{errors.investorType}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 border border-gray-600 rounded-full text-white font-semibold hover:bg-white/5 transition-colors"
        >
          Back
        </button>
        <motion.button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Complete Registration
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <div className="bg-[#0B0B0F] border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-xl">
        {step === 1 && <RoleSelectionStep />}
        {step === 2 && <ProfileSetupStep />}
      </div>
    </div>
  );
});

export default Registration; 