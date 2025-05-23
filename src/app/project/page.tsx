'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ProjectView from '@/components/project/ProjectView';
import CreateMilestone from '@/components/milestone/CreateMilestone';

// Mock data for demonstration
const MOCK_PROJECT = {
  projectName: "Raise3 DeFi Project",
  description: "A revolutionary decentralized finance platform built on Ethereum that enables users to raise funds for their projects through community support.",
  problem: "Traditional fundraising platforms have high fees and centralized control which limits innovation and access for many promising projects.",
  solution: "Our decentralized protocol reduces fees, removes intermediaries, and creates direct connections between projects and supporters.",
  mission: "To democratize fundraising and empower creators and innovators worldwide.",
  location: "Global, Remote",
  socialMedia: {
    twitter: "https://x.com/raise3",
    github: "https://github.com/raise3",
    discord: "https://discord.gg/raise3",
    website: "https://raise3.io",
    linkedin: "https://linkedin.com/company/raise3"
  },
  projectStage: {
    path: "path1",
    businessModel: "Subscription + Transaction fees",
    stage: "MVP",
    raisedAmount: "250000",
    raisedCurrency: "USD"
  },
  contactInfo: {
    fullName: "Alex Johnson",
    email: "alex@raise3.io",
    telegram: "alexjraise3",
    network: "ethereum"
  },
  team: {
    members: [
      { name: "Alex Johnson", role: "Founder & CEO" },
      { name: "Sophia Chen", role: "CTO" },
      { name: "Miguel Santos", role: "Lead Developer" },
      { name: "Emma Wilson", role: "Marketing Director" }
    ]
  },
  milestones: [
    {
      id: "m1",
      title: "Platform MVP Launch",
      description: "Release the minimum viable product with core functionality for fundraising.",
      targetDate: "2025-06-30",
      status: "in-progress",
      deliverables: [
        "Functional smart contracts for fundraising",
        "Web interface for project creation",
        "Basic dashboard for tracking funding progress"
      ],
      budget: "50000",
      budgetCurrency: "USD"
    },
    {
      id: "m2",
      title: "Mobile App Development",
      description: "Develop and release mobile applications for iOS and Android platforms.",
      targetDate: "2025-08-15",
      status: "pending",
      deliverables: [
        "Native iOS application",
        "Native Android application",
        "Mobile-specific features including push notifications",
        "Integration with wallet providers"
      ],
      budget: "75000",
      budgetCurrency: "USD"
    },
    {
      id: "m3",
      title: "Community Growth Initiative",
      description: "Expand the platform's user base through targeted marketing campaigns.",
      targetDate: "2025-05-01",
      status: "completed",
      deliverables: [
        "Social media campaign across major platforms",
        "Community-building events (virtual and in-person)",
        "Partnership program with 10+ established projects",
        "Referral program implementation"
      ],
      budget: "30000",
      budgetCurrency: "USD"
    }
  ],
  createdAt: "2025-01-15T12:00:00Z",
  updatedAt: "2025-05-10T09:30:00Z",
  imageUrl: ""
};

export default function ProjectPage() {
  const searchParams = useSearchParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  
  // Get project ID from URL parameters
  const projectId = searchParams?.get('id');
  
  useEffect(() => {
    // In a real application, you would fetch the project data from your API
    // For now, we'll use mock data
    const fetchProject = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we're using mock data
        // In a real app, you would fetch data from your API using the projectId
        setProject(MOCK_PROJECT);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchProject();
    } else {
      setLoading(false);
      setError('Project ID is required');
    }
  }, [projectId]);
  
  // Handler for milestone form submission
  const handleMilestoneSubmit = (data: any) => {
    // In a real application, you would send this data to your API
    console.log('New milestone data:', data);
    
    // For demo purposes, we'll update the local state
    if (project && data.milestones.length > 0) {
      const updatedMilestones = [
        ...(project.milestones || []),
        ...data.milestones.map((m: any, index: number) => ({
          ...m,
          id: `new-${Date.now()}-${index}` // Generate a temporary ID
        }))
      ];
      
      setProject({
        ...project,
        milestones: updatedMilestones
      });
    }
    
    // Close the form
    setShowMilestoneForm(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center p-8 rounded-lg">
          <FontAwesomeIcon icon={faSpinner} spin className="text-[#FF7171] mb-4 h-8 w-8" />
          <p className="text-white text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="p-8 bg-red-900/20 border border-red-800 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
          <Link href="/dashboard" className="mt-4 inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400">The project you're looking for does not exist or has been removed.</p>
          <Link href="/dashboard" className="mt-4 inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowMilestoneForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#FF7171] to-[#FF5C87] hover:from-[#FF5C87] hover:to-[#FF7171] rounded-lg text-white font-medium transition-all duration-300 flex items-center"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="mr-2 h-4 w-4" />
              Add Milestone
            </button>
          </div>
        </div>
        
        <ProjectView project={project} />
      </div>
      
      {showMilestoneForm && (
        <CreateMilestone
          onClose={() => setShowMilestoneForm(false)}
          onSubmit={handleMilestoneSubmit}
          projectId={projectId || ''}
        />
      )}
    </div>
  );
}
