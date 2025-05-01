"use client";

import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { useContract } from "../context/ContractContext";
import { DashboardContext } from "./generalComponents/Dashboard";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected, campaignsCount, getCampaignDetails } = useContract();
  const { addNotification } = useContext(DashboardContext);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!isConnected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching campaigns, count:", campaignsCount);

        if (campaignsCount === 0) {
          addNotification("No campaigns found on the blockchain", "info");
          setLoading(false);
          return;
        }

        const projectPromises = [];
        // Use the actual number of campaigns from context
        for (let i = 0; i < campaignsCount; i++) {
          projectPromises.push(getCampaignDetails(i));
        }

        const projectsData = await Promise.all(projectPromises);
        console.log("Retrieved campaign data:", projectsData);
        setProjects(projectsData);
        addNotification(
          `Successfully loaded ${projectsData.length} campaigns from the blockchain`,
          "success",
          5000
        );
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        addNotification(
          `Error fetching campaigns: ${error.message || "Unknown error"}`,
          "error",
          5000
        );
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      fetchProjects();
    }
  }, [isConnected, campaignsCount, getCampaignDetails, addNotification]);

  // Function to format data from blockchain format
  const formatProject = (project) => {
    try {
      return {
        id: project.id || "N/A",
        name: project.metaUrl
          ? JSON.parse(project.metaUrl).name
          : "Unnamed Campaign",
        description: project.metaUrl
          ? JSON.parse(project.metaUrl).description
          : "No description",
        goal: project.goalAmount
          ? ethers.formatUnits(project.goalAmount.toString(), 18)
          : "0",
        raised: project.totalRaised
          ? ethers.formatUnits(project.totalRaised.toString(), 18)
          : "0",
        founder: project.founder || "Unknown",
        // Extract milestones from metaUrl if available
        milestones: project.metaUrl
          ? JSON.parse(project.metaUrl).milestones?.map((m, i) => ({
              name: m.name,
              description: m.description,
              fundNeeded: m.amount,
              index: i,
            })) || []
          : [],
      };
    } catch (error) {
      console.error("Error formatting project:", error, project);
      return {
        id: "Error",
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
