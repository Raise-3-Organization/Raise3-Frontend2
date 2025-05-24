export interface TeamMember {
    name: string;
    role: string;
}

export interface BusinessModel {
    businessModel: "grant";
    description: string;
    discord: string;
    email: string;
    external_link: string;
    githubLink: string;
    goalAmount: string;
    image: string;
    linkedIn: string;
    location: string;
    name: string;
    network: string;
    projectMission: string;
    projectName: string;
    projectProblem: string;
    projectSolution: string;
    projectStage: string;
    projectType: string;
    projectXLink: string;
    properties: {
        category: string;
    };
    raisedCurrency: string;
    team: {
        members: TeamMember[];
    };
    telegram: string;
    websiteLink: string;
}

export interface ProjectInterface {
    metaURL: string;
    goalAmount: number;
    totalRaised: number;
    founder: `0x${string}`;
    tokenAddress: `0x${string}`;
    milestoneCount: number;
    CampaignStatus: number;
}


export interface ProjectId {
    id: number;
}

export interface Milestone {
    mileStoneURL: string;
    prove: string;
    isApproved: boolean;
    amount: number;
    completed: boolean;
}

export interface MileStoneDetails {
    title: string;
    description: string;
    targetDate: string;
    status: 'pending' | 'in-progress' | 'completed';
    deliverables: string[];
    budget?: string;
    budgetCurrency?: string;
}