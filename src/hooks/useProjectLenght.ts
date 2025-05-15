import { useReadContract } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { contractAddress } from "@/contants";
import Raise3Abi from "@/abis/Raise3MileStone.json";

export const useProjectLength = () => {
  const [projectLen, setProjectLen] = useState<Map<string, string>>(new Map());
  const { data: projectlength, isLoading: isProjectLenLoading, error: projectLenError } = useReadContract({
    address: contractAddress,
    abi: Raise3Abi,
    functionName: 'getCampaignLen',
    args: [],
  });

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
      console.error("Error setting project IDs:", error);
    }
  }, [projectlength]);

  useEffect(() => {
    getProjectLen();
  }, [projectlength, getProjectLen]);

  return { projectLen, isProjectLenLoading, projectLenError };
};