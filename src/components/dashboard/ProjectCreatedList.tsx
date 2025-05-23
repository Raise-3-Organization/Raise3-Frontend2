import React, { useCallback, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import ContractInitializer from "../ContractInitializer";
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";
import ProjectCard from "./ProjectCard";


const ProjectCreatedList = () => {
    const { address } = useAccount();
    const [projectLen, setProjectLen] = useState<Map<string, string>>(new Map());
    const { data: projectlength, isLoading: isProjectLenLoading, error: projectLenError } = useReadContract({
      address: contractAddress,
      abi: Raise3Abi,
      functionName: 'getCampaignLen',
      args: [],
  })
//   console.log(projectlength, "projectLen")

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

  if (!projectlength) {
    return (
        <div className="p-4">
          No campaigns found on the blockchain. Be the first to create one!
        </div>
      );
  }

  if(isProjectLenLoading) {
    return <div className="p-4">Loading campaigns from blockchain...</div>;

  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
         {[...projectLen.entries()].map(([key, value]) => (
        <ProjectCard id={value} key={key} />
      ))}
    </div>
  )
}

export default ProjectCreatedList