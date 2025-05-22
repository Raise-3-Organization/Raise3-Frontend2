import { pinFileWithPinata, pinJsonWithPinata } from "@/lib/pinta";



export async function makeContractMetadata({
    projectXLink, githubLink,
    discord, websiteLink,
    linkedIn, projectType,
    businessModel,
    projectStage, goalAmount,
    name, email, network, telegram,
    // teamMemberName, teamMemberRole,
    raisedCurrency,
    team,
    imageFile,
    projectName,
    description,
    projectProblem,
    projectSolution, projectMission, location
}: {
    projectXLink: string; githubLink: string;
    discord: string; websiteLink: string;
    linkedIn: string; projectType: string;
    businessModel: string;
    projectStage: string; goalAmount: string;
    name: string; email: string; network: string;
    telegram: string;
    // teamMemberName: string; teamMemberRole: string;
    raisedCurrency: string;
    team: { members: { name: string, role: string }[] }; 
    imageFile: File;
    projectName: string;
    description?: string;
    projectProblem?: string;
    projectSolution?: string; projectMission?: string;
    location?: string;
}) {
    const imageFileIpfsUrl = await pinFileWithPinata(imageFile);

    const metadataJson = {
        projectXLink: projectXLink,
        githubLink: githubLink,
        discord: discord, websiteLink: websiteLink,
        linkedIn: linkedIn, projectType: projectType,
        businessModel: businessModel,
        projectStage: projectStage, goalAmount: goalAmount,
        name: name, email: email,
        network: network, telegram: telegram,
        // teamMemberName: teamMemberName, teamMemberRole: teamMemberRole,
        raisedCurrency: raisedCurrency,
        team: team,
        description: description,
        image: imageFileIpfsUrl,
        projectName: projectName,
        projectProblem: projectProblem,
        projectSolution: projectSolution,
        projectMission: projectMission,
        location: location,
        external_link: "raise3.network",
        "properties": {
            "category": "payament"
        },
    };

    // upload token metadata json to Pinata and get ipfs uri
    const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson);

    return contractMetadataJsonUri;
}



interface MilestoneMetadata {
    title: string;
    description: string;
    targetDate: string;
    status: 'pending' | 'completed' | 'in-progress'; // Assuming these are the possible statuses
    deliverables: string[];
    budget: string;
    budgetCurrency: string;
}
// ProjectAction
export async function mileStoneMetadaya({
    title,
    description,
    targetDate,
    status,
    deliverables,
    budget,
    budgetCurrency
}: MilestoneMetadata) {
    
}