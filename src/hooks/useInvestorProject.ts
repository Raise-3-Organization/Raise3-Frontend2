// _investors

import { useReadContract } from "wagmi"
import { CONTRACT_ROLE } from "@/contants"
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";

interface IvestorParamsQueryProjectFunded {
    investor: `0x${string}`;
}

export const useReadrInvestorFundproject = ({ investor}: IvestorParamsQueryProjectFunded) => {
    const { data: fundedProject, isLoading: isfundedProjectLoading, error: fundedProjectError } = useReadContract({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: '_investors',
        args: [investor],
    })

    return { fundedProject, isfundedProjectLoading, fundedProjectError } 
}
