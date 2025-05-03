"use client";

import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { useContract } from "../context/ContractContext";
import { DashboardContext } from "./generalComponents/Dashboard";

const ProjectList = ({ filterByFounder }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isConnected, campaignsCount, getCampaignDetails, batchGetCampaigns } = useContract();
  const { addNotification } = useContext(DashboardContext);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  // Use a ref to track if we're currently fetching to prevent multiple concurrent fetches
  const fetchingRef = React.useRef(false);

  useEffect(() => {
    // Guard to prevent unnecessary rerenders and fetch operations
    if (!isConnected || (hasFetched && campaignsCount === 0) || fetchingRef.current) {
      return;
    }
    
    const fetchProjects = async () => {
      // Return early if already fetching or loading state is active
      if (fetchingRef.current || loading) {
        return;
      }
      
      try {
        // Set both loading state and fetchingRef
        setLoading(true);
        fetchingRef.current = true;
        
        console.log("Fetching campaigns, count:", campaignsCount);

        if (campaignsCount === 0) {
          console.log("No campaigns to fetch");
          setProjects([]);
          setHasFetched(true);
          return;
        }

        // Use the new batch fetching capability if available
        let projectsData = [];
        if (batchGetCampaigns) {
          console.log("Using batch fetch for projects");
          projectsData = await batchGetCampaigns(0, campaignsCount);
        } else {
          // Fallback to individual fetching if batch function not available
          console.log("Falling back to individual project fetching");
          
          // Create an array to track individual project fetch success
          const projectStatus = Array(campaignsCount).fill(false);
          
          // Use Promise.allSettled to handle individual failures better
          const projectPromises = [];
          for (let i = 0; i < campaignsCount; i++) {
            projectPromises.push(
              getCampaignDetails(i)
                .then(projectData => {
                  if (projectData) {
                    projectStatus[i] = true;
                    projectsData.push({...projectData, id: i});
                  }
                  return projectData;
                })
                .catch(err => {
                  console.log(`Error fetching project ${i}:`, err.message);
                  return null; // Return null for failed projects
                })
            );
          }

          // Wait for all promises to settle (either resolve or reject)
          await Promise.allSettled(projectPromises);
        }
        
        console.log("Projects fetched:", projectsData.length, "of", campaignsCount);
        
        // Filter any null or undefined projects
        const validProjects = projectsData.filter(project => project && typeof project === 'object');
        
        // Filter by founder if filterByFounder prop is provided
        let filteredProjects = validProjects;
        if (filterByFounder) {
          console.log("Filtering projects by founder:", filterByFounder);
          filteredProjects = validProjects.filter(project => 
            project.founder && project.founder.toLowerCase() === filterByFounder.toLowerCase()
          );
          console.log("Filtered projects:", filteredProjects.length);
        }
        
        setProjects(filteredProjects);
        
        // Show appropriate notification based on success
        if (filteredProjects.length === campaignsCount) {
          addNotification(
            `Successfully loaded ${filteredProjects.length} campaigns from the blockchain`,
            "success",
            5000
          );
        } else if (filteredProjects.length > 0) {
          addNotification(
            `Loaded ${filteredProjects.length} of ${campaignsCount} campaigns`,
            "info",
            5000
          );
        } else {
          addNotification(
            "Failed to load campaigns from blockchain. Showing sample projects instead.",
            "warning",
            5000
          );
        }
        
        setHasFetched(true);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. " + err.message);
        
        // Try to show sample projects instead of nothing
        setProjects([
          {
            id: 0,
            metaUrl: JSON.stringify({
              name: "Sample DeFi Project",
              description: "A decentralized finance project for yield farming",
              milestones: [
                { name: "Platform Launch", description: "Initial platform release", amount: "5.0" },
                { name: "User Acquisition", description: "Reach 1000 users", amount: "3.0" }
              ]
            }),
            goalAmount: ethers.utils.parseEther("10"),
            totalRaised: ethers.utils.parseEther("3"),
            founder: "0x1234567890123456789012345678901234567890"
          },
          {
            id: 1,
            metaUrl: JSON.stringify({
              name: "NFT Marketplace",
              description: "A marketplace for trading digital collectibles",
              milestones: [
                { name: "Marketplace Beta", description: "Initial beta release", amount: "3.0" },
                { name: "Mobile App", description: "Launch mobile app", amount: "4.0" }
              ]
            }),
            goalAmount: ethers.utils.parseEther("15"),
            totalRaised: ethers.utils.parseEther("7"),
            founder: "0x0987654321098765432109876543210987654321"
          }
        ]);
        
        addNotification(
          "Failed to load projects from blockchain. Showing sample projects instead.",
          "error",
          5000
        );
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchProjects();
  }, [isConnected, campaignsCount, getCampaignDetails, batchGetCampaigns, addNotification, hasFetched, filterByFounder]);

  // Function to format data from blockchain format
  const formatProject = (project) => {
    try {
      // Validate the project object
      if (!project) {
        throw new Error("Project data is missing");
      }
      
      // Try to parse metaUrl JSON
      let metaData = { name: "Unnamed Project", description: "No description", milestones: [] };
      if (project.metaUrl) {
        try {
          metaData = JSON.parse(project.metaUrl);
        } catch (jsonError) {
          console.warn(`Failed to parse metaUrl JSON for project ${project.id}:`, jsonError.message);
        }
      }
      
      // Format amounts using ethers.js utilities - handle both string and BigNumber inputs
      let goalValue = "0";
      if (project.goalAmount) {
        try {
          goalValue = typeof project.goalAmount === 'object' && project.goalAmount._isBigNumber 
            ? ethers.utils.formatEther(project.goalAmount)
            : ethers.utils.formatEther(project.goalAmount.toString());
        } catch (amountError) {
          console.warn(`Error formatting goal amount for project ${project.id}:`, amountError.message);
        }
      }
      
      let raisedValue = "0";
      if (project.totalRaised) {
        try {
          raisedValue = typeof project.totalRaised === 'object' && project.totalRaised._isBigNumber
            ? ethers.utils.formatEther(project.totalRaised)
            : ethers.utils.formatEther(project.totalRaised.toString());
        } catch (raisedError) {
          console.warn(`Error formatting raised amount for project ${project.id}:`, raisedError.message);
        }
      }
      
      // Extract milestones from metaUrl if available
      const milestones = metaData.milestones?.map((m, i) => ({
        name: m.name || `Milestone ${i+1}`,
        description: m.description || "No description",
        fundNeeded: m.amount || "0",
        index: i,
      })) || [];
      
      return {
        id: project.id?.toString() || "N/A",
        name: metaData.name || `Project ${project.id}`,
        description: metaData.description || "No description available",
        goal: goalValue,
        raised: raisedValue,
        founder: project.founder || "Unknown",
        milestones
      };
    } catch (error) {
      console.error("Error formatting project:", error, project);
      return {
        id: project?.id?.toString() || "Error",
        name: "Error formatting campaign",
        description: "There was an error displaying this campaign",
        goal: "0",
        raised: "0",
        founder: "Unknown",
        milestones: [],
      };
    }
  };

  // Only perform this check for standalone project list, not when in dashboard
  if (
    !isConnected &&
    typeof window !== "undefined" &&
    !window.location.href.includes("dashboard")
  ) {
    return (
      <div className="p-4">Please connect your wallet to see campaigns</div>
    );
  }

  if (loading) {
    return <div className="p-4">Loading campaigns from blockchain...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="p-4">
        No campaigns found on the blockchain. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {projects.map((project, index) => {
        const formattedProject = formatProject(project);
        return (
          <div
            key={index}
            className="border border-gray-800 rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-xl font-bold">{formattedProject.name}</h2>
            <p className="text-gray-600 mt-2">{formattedProject.description}</p>
            <div className="mt-4">
              <p>Goal: {formattedProject.goal} ETH</p>
              <p>Raised: {formattedProject.raised} ETH</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      (parseFloat(formattedProject.raised) /
                        parseFloat(formattedProject.goal)) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium">
                Founder: {formattedProject.founder.substring(0, 6)}...
                {formattedProject.founder.substring(38)}
              </p>
              <p className="font-medium">
                Milestones: {formattedProject.milestones.length}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectList;
