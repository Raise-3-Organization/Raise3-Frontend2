// _founderProjectByInvestor

import { useReadContract } from "wagmi"
import { CONTRACT_ROLE } from "@/contants"
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";

interface IvestorParamsQueryProjectFunded {
    campaignId: string;
    investor: `0x${string}`;
}

export const useReadrInvestorFundproject = ({campaignId, investor}: IvestorParamsQueryProjectFunded) => {
    const { data: fundedProject, isLoading: isfundedProjectLoading, error: fundedProjectError } = useReadContract({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: '_founderProjectByInvestor',
        args: [campaignId, investor],
    })

    return { fundedProject, isfundedProjectLoading, fundedProjectError } 
}
