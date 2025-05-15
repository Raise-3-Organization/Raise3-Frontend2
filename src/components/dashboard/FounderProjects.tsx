import React, { useCallback, useEffect, useState } from "react";
import { useAccount, useCall, useReadContract } from "wagmi";
import ContractInitializer from "../ContractInitializer";
import ProjectList from "../ProjectList";
import FounderProjectsCard from "./FounderProjectsCard";
import { CONTRACT_ROLE } from "@/contants"
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";


const FounderProjects = () => {
    // Get the user's address to filter projects
    const { address } = useAccount();
    const [projectLen, setProjectLen] = useState<Map<string, string>>(new Map());
    const { data: projectlength, isLoading: isProjectLenLoading, error: projectLenError } = useReadContract({
      address: contractAddress,
      abi: Raise3Abi,
      functionName: 'getCampaignLen',
      args: [],
  })
  console.log(projectlength, "projectLen")

  const getProjectLen = useCallback(() => {
    try {
      if (!projectlength) {
        console.log("projectlength is undefined or null");
        return;
      }

      const newMap = new Map<string, string>();
      if (typeof projectlength === 'bigint' && projectlength > 0) {
        for (let i = 0; i < projectlength; i++) {
          newMap.set(i.toString(), i.toString()); 
        }
        setProjectLen(new Map(newMap));
      } else {
        console.log("projectlength is not a valid bigint:", projectlength);
      }
    } catch (error) {
      console.error("Error setting employee IDs:", error);
    }
  }, [projectlength])

  useEffect(() => {
    getProjectLen()
  
  }, [projectlength, getProjectLen])



    // const { setActiveSection } = useContext(DashboardContext);
    
    return (
      <div className="space-y-6">
        {/* Real blockchain projects */}
        <div className="bg-black border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6">My Blockchain Projects</h2>
          {/* <ContractInitializer> */}
            <ProjectList filterByFounder={address || undefined} />
          {/* </ContractInitializer> */}
        </div>
        
        {/* Demo projects */}
        <div className="space-y-4 mt-8">
      <h3 className="text-lg font-medium mb-4">Demo Projects</h3>
        {[...projectLen.entries()].map(([key, value]) => (
        <FounderProjectsCard id={value} key={key} />
      ))}
       </div>
        {/* <div className="bg-black border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-6">Demo Project</h2>
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
        </div> */}
      </div>
    );
  };

  export default FounderProjects;