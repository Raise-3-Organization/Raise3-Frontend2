import { useReadContract } from "wagmi"
import { CONTRACT_ROLE } from "@/contants"
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";

export const useRoles = (address: string) => {

    const { data: isFounderRole, isLoading: isFounderLoading, error: founderError } = useReadContract({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: 'hasRole',
        args: [CONTRACT_ROLE.FOUNDER_ROLE, address],
    })
    const { data: isInvestorRole, isLoading: isInvestorLoading, error: investorError } = useReadContract({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: 'hasRole',
        args: [CONTRACT_ROLE.INVESTOR_ROLE, address],
    });
    const { data: isManagerRole, isLoading: isManagerLoading, error: managerError } = useReadContract({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: 'hasRole',
        args: [CONTRACT_ROLE.MANAGER_ROLE, address],
    });

    

    return {isFounderRole, isInvestorRole, isInvestorLoading, investorError, isManagerLoading, isManagerRole}
} 