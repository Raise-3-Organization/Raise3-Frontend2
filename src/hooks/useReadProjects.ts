import { useReadContract } from "wagmi"
import { CONTRACT_ROLE } from "@/contants"
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";



export const useReadProjects = (id: string) => {
    const { data: projects, isLoading: isProjectLoading, error: projectError } = useReadContract({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: '_campaigns',
        args: [id],
    })

    return { projects, isProjectLoading, projectError } 
}


// 0: "ipfs://QmWBvTsXDtB45Aab5XNdCqDH6DpW5JSy2fBGKNJ5PxfbvE"
// 1:1n
// 2: 1n
// 3: "0x8822F2965090Ddc102F7de354dfd6E642C090269"
// 4: "0x0000000000000000000000000000000000000000"
// 5: 0n
// 6: 0