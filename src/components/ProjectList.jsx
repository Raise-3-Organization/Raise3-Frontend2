"use client";

import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../context/ContractContext';
import { DashboardContext } from './generalComponents/Dashboard';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected, getProjectsCount, getProject } = useContract();
  const { addNotification } = useContext(DashboardContext);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const count = await getProjectsCount();
        
        if (count === 0) {
          addNotification('No projects found on the blockchain', 'info');
          setLoading(false);
          return;
        }
        
        const projectPromises = [];
        for (let i = 0; i < count; i++) {
          projectPromises.push(getProject(i));
        }
        
        const projectsData = await Promise.all(projectPromises);
        setProjects(projectsData);
        addNotification(`Successfully loaded ${projectsData.length} projects from the blockchain`, 'success', 3000);
      } catch (error) {
        console.error("Error fetching projects:", error);
        addNotification(`Error fetching projects: ${error.message || 'Unknown error'}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isConnected, getProjectsCount, getProject, addNotification]);

  // Function to format data from blockchain format
  const formatProject = (project) => {
    return {
      id: project.projectID.toString(),
      name: project.projectName,
      description: project.projectDescription,
      goal: ethers.utils.formatEther(project.fundraisingGoal),
      raised: ethers.utils.formatEther(project.totalFundRaised),
      remaining: ethers.utils.formatEther(project.remainingFund),
      isActive: project.isActive,
      milestones: project.milestones.map(m => ({
        name: m.milestoneName,
        description: m.milestoneDescription,
        fundNeeded: ethers.utils.formatEther(m.fundNeeded),
        isComplete: m.isComplete,
        isVoting: m.voting,
        isApproved: m.isApproved
      }))
    };
  };

  // Only perform this check for standalone project list, not when in dashboard
  if (!isConnected && !window.location.href.includes('dashboard')) {
    return <div className="p-4">Please connect your wallet to see projects</div>;
  }

  if (loading) {
    return <div className="p-4">Loading projects from blockchain...</div>;
  }

  if (projects.length === 0) {
    return <div className="p-4">No projects found on the blockchain. Be the first to create one!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {projects.map((project) => {
        const formattedProject = formatProject(project);
        return (
          <div key={formattedProject.id} className="border border-gray-800 rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-bold">{formattedProject.name}</h2>
            <p className="text-gray-600 mt-2">{formattedProject.description}</p>
            <div className="mt-4">
              <p>Goal: {formattedProject.goal} ETH</p>
              <p>Raised: {formattedProject.raised} ETH</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min((parseFloat(formattedProject.raised) / parseFloat(formattedProject.goal)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium">Status: {formattedProject.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectList; 