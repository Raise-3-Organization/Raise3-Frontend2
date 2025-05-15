import { useWriteContract, useReadContract } from "wagmi"
import { contractAddress } from "@/contants"
import Raise3Abi from "@/abis/Raise3MileStone.json";


export const useCreateProject = () => {

    
    const {data: campaignLen } = useReadContract({
        address: contractAddress,
        abi: Raise3Abi,
        functionName: 'campaignLen',
        args: [],
    })

    

    // const {data: getCampaignDetails } = useReadContract({
    //     address: contractAddress,
    //     abi: Raise3Abi,
    //     functionName: 'getCampaignDetails',
    //     args: [],
    // })
}