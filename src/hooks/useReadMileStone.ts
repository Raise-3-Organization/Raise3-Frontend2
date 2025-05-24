import { useReadContract } from "wagmi"
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";

interface MileStoneDetails {
    projectId: string;
    mileStoneId: string;

}

export const useReadMileStone = ({projectId, mileStoneId}: MileStoneDetails) => {
    const { data: mileStone, isLoading: isMileStoneLoading, error: mileStoneError } = useReadContract({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: '_milestones',
        args: [projectId, mileStoneId],
    })

    return { mileStone, isMileStoneLoading, mileStoneError } 
}

