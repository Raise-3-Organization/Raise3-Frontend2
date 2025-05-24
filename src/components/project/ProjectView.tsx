'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faLocationDot, 
  faCalendarDay, 
  faBullseye, 
  faLightbulb, 
  faStar,
  faHeart, 
  faGlobe, 
  faCircleInfo, 
  faEnvelope, 
  faUsers, 
  faArrowUpRightFromSquare,
  faChevronDown,
  faChevronUp,
  faCheck,
  faSpinner,
  faClock,
  faList,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faXTwitter,
  faLinkedin,
  faDiscord
} from '@fortawesome/free-brands-svg-icons';
import { useParams } from 'next/navigation';
import { useReadProjects } from '@/hooks/useReadProjects';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import AllMileStone from '../milestone/AllMileStone';

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliverables: string[];
  budget?: string;
  budgetCurrency?: string;
}





const ProjectView = () => {
  // If project is passed directly as a prop, use it
  // Otherwise, fetch it using hooks
  const params = useParams();
  const id = params?.id as string;
  const { projects, isProjectLoading } = useReadProjects(id);
  const { project: fetchedProject, projectDetails } = useProjectDetails(projects as any[]);
  
  // Use either the prop-passed project or the fetched one
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const renderSocialLinks = () => {
    const socialLinks = [
      { 
        name: 'X', 
        url: projectDetails?.projectXLink, 
        icon: <FontAwesomeIcon icon={faXTwitter} className="text-white h-[18px]" /> 
      },
      { 
        name: 'GitHub', 
        url: projectDetails?.githubLink, 
        icon: <FontAwesomeIcon icon={faGithub} className="text-white h-[18px]" /> 
      },
      { 
        name: 'Discord', 
        url: projectDetails?.discord, 
        icon: <FontAwesomeIcon icon={faDiscord} className="text-[#5865F2] h-[18px]" /> 
      },
      { 
        name: 'Website', 
        url: projectDetails?.websiteLink, 
        icon: <FontAwesomeIcon icon={faGlobe} className="text-[#FF7171] h-[18px]" /> 
      },
      { 
        name: 'LinkedIn', 
        url: projectDetails?.linkedIn, 
        icon: <FontAwesomeIcon icon={faLinkedin} className="text-[#0077B5] h-[18px]" /> 
      }
    ];

    return (
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link, index) => 
          link.url ? (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-gray-900/70 rounded-lg border border-gray-800 hover:border-gray-600 transition-all hover:bg-gray-800/70"
            >
              {link.icon}
              <span className="text-sm">{link.name}</span>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-gray-500 h-[14px]" />
            </a>
          ) : null
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden bg-gradient-to-b from-gray-900 to-black shadow-xl">
      {/* Hero Section */}
      <div className="relative h-40 md:h-60 bg-gradient-to-r from-[#FF7171]/20 to-[#FF5C87]/20 overflow-hidden">
        {projectDetails?.image ? (
          <img 
            src={`https://ipfs.io/ipfs/${projectDetails?.image.substring(7)}`} 
            alt={projectDetails?.projectName} 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        
        <div className="absolute bottom-0 left-0 p-6 z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#FF7171] to-[#FF5C87] flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faBuilding} className="text-white h-[20px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{projectDetails?.projectName}</h1>
                {projectDetails?.projectStage && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-900/50 text-blue-200 rounded-full border border-blue-800/50">
                    {projectDetails?.projectStage}
                  </span>
                )}
              </div>
              {projectDetails?.location && (
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <FontAwesomeIcon icon={faLocationDot} className="mr-1 h-[14px]" />
                  {projectDetails?.location }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* General Information */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faCircleInfo} className="mr-2 text-[#FF7171] h-[18px]" />
            General Information
          </h2>
          
          <div className="space-y-6">
            {projectDetails?.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                  <FontAwesomeIcon icon={faStar} className="mr-1.5 text-yellow-500 h-[14px]" />
                  Description
                </h3>
                <p className="text-white text-sm leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  {projectDetails.description}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectDetails?.projectProblem && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faBullseye} className="mr-1.5 text-red-500 h-[14px]" />
                    Project Problem
                  </h3>
                  <p className="text-white text-sm leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    {projectDetails?.projectProblem}
                  </p>
                </div>
              )}
              
              {projectDetails?.projectSolution && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faLightbulb} className="mr-1.5 text-yellow-500 h-[14px]" />
                    Project Solution
                  </h3>
                  <p className="text-white text-sm leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                    {projectDetails?.projectSolution}
                  </p>
                </div>
              )}
            </div>
            
            {projectDetails?.projectMission && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                  <FontAwesomeIcon icon={faHeart} className="mr-1.5 text-[#FF5C87] h-[14px]" />
                  Project Mission
                </h3>
                <p className="text-white text-sm leading-relaxed bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  {projectDetails?.projectMission}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Social Media */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faGlobe} className="mr-2 text-[#FF7171] h-[18px]" />
            Connect & Follow
          </h2>
          
          {renderSocialLinks()}
        </section>

        {/* Project Stage */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faBullseye} className="mr-2 text-[#FF7171] h-[18px]" />
            Project Stage
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projectDetails?.projectType && (
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <h3 className="text-xs font-medium text-gray-400 mb-1">Path</h3>
                <p className="text-white font-medium">
                  {projectDetails?.projectType === 'path1' ? 'Product' :
                   projectDetails?.projectType === 'path2' ? 'Service' :
                   projectDetails?.projectType === 'path3' ? 'Community' : 
                   projectDetails?.projectType}
                </p>
              </div>
            )}
            
            {projectDetails?.businessModel && (
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <h3 className="text-xs font-medium text-gray-400 mb-1">Business Model</h3>
                <p className="text-white font-medium">{projectDetails?.businessModel}</p>
              </div>
            )}
            
            {/* {project?.totalRaised && (
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <h3 className="text-xs font-medium text-gray-400 mb-1">Funding Goal</h3>
                <p className="text-white font-medium flex items-center">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-0.5 text-green-500 h-[14px]" />
                  {project?.totalRaised} {projectDetails?.raisedCurrency}
                </p>
              </div>
            )} */}
          </div>
        </section>

        {/* Team & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-[#FF7171] h-[18px]" />
              Contact Information
            </h2>
            
            <div className="space-y-3">
              {projectDetails?.name && (
                <div className="flex flex-col px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-800">
                  <span className="text-xs text-gray-400">Full Name</span>
                  <span className="text-white">{projectDetails?.name}</span>
                </div>
              )}
              
              {projectDetails?.email && (
                <div className="flex flex-col px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-800">
                  <span className="text-xs text-gray-400">Email</span>
                  <a href={`mailto:${projectDetails?.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                    {projectDetails?.email}
                  </a>
                </div>
              )}
              
              {projectDetails?.telegram && (
                <div className="flex flex-col px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-800">
                  <span className="text-xs text-gray-400">Telegram</span>
                  <span className="text-white">@{projectDetails?.telegram}</span>
                </div>
              )}
              
              {projectDetails?.network && (
                <div className="flex flex-col px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-800">
                  <span className="text-xs text-gray-400">Network</span>
                  <span className="text-white capitalize">{projectDetails?.network}</span>
                </div>
              )}
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FontAwesomeIcon icon={faUsers} className="mr-2 text-[#FF7171] h-[18px]" />
              Team Members
            </h2>
            
            <div className="space-y-3">
              {projectDetails?.team?.members?.map((member, index) => (
                <div key={index} className="flex justify-between px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF7171] to-[#FF5C87] flex items-center justify-center text-white font-medium mr-3">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Milestones Accordion */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faList} className="mr-2 text-[#FF7171] h-[18px]" />
            Project Milestones
          </h2>
          
          {/* {project.milestones && project.milestones.length > 0 ? (
            <div className="space-y-4">
              {project.milestones.map((milestone, index) => (
                <MilestoneAccordion key={milestone.id || index} milestone={milestone} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-gray-400 text-center">
              No milestones have been added to this project yet.
            </div>
          )} */}
        </section>
        
        {/* Footer with dates */}
        {/* Commenting out date display as it's not available in the API yet */}
        {/* {(project.createdAt || project.updatedAt) && (
          <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-800 pt-4 mt-8">
            {project.createdAt && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarDay} className="mr-1 h-[12px]" />
                Created: {formatDate(project.createdAt)}
              </div>
            )}
            {project.updatedAt && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faArrowRight} className="mr-1 h-[12px]" />
                Last Updated: {formatDate(project.updatedAt)}
              </div>
            )}
          </div>
        )} */}
      </div>
          <AllMileStone projectId={id} mileStoneCount={fetchedProject?.milestoneCount?.toString() || "0"}/>
    </div>
  );
};

// Milestone Accordion Component
const MilestoneAccordion: React.FC<{ milestone: Milestone; index: number }> = ({ milestone, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheck} className="text-green-500 h-[14px]" />;
      case 'in-progress':
        return <FontAwesomeIcon icon={faSpinner} className="text-blue-500 h-[14px]" />;
      default: // pending
        return <FontAwesomeIcon icon={faClock} className="text-yellow-500 h-[14px]" />;
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-900/30 border-green-800/50 text-green-400';
      case 'in-progress':
        return 'bg-blue-900/30 border-blue-800/50 text-blue-400';
      default: // pending
        return 'bg-yellow-900/30 border-yellow-800/50 text-yellow-400';
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all bg-gradient-to-b from-gray-900/50 to-black/30">
      {/* Accordion Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full text-white font-medium">
            {index + 1}
          </div>
          <div>
            <h3 className="text-white font-medium">{milestone.title}</h3>
            <div className="flex items-center mt-1 space-x-3">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border flex items-center ${getStatusBadgeColor(milestone.status)}`}>
                {getStatusIcon(milestone.status)}
                <span className="ml-1 capitalize">{milestone.status.replace('-', ' ')}</span>
              </span>
              
              {milestone.targetDate && (
                <span className="text-xs text-gray-400 flex items-center">
                  <FontAwesomeIcon icon={faCalendarDay} className="mr-1 h-[12px]" />
                  Due: {formatDate(milestone.targetDate)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <FontAwesomeIcon 
          icon={isOpen ? faChevronUp : faChevronDown} 
          className="text-gray-400 h-[16px]" 
        />
      </div>
      
      {/* Accordion Content */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-800 space-y-4">
          {/* Description */}
          {milestone.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Description</h4>
              <p className="text-gray-400 text-sm bg-black/30 p-3 rounded-lg">
                {milestone.description}
              </p>
            </div>
          )}
          
          {/* Deliverables */}
          {milestone.deliverables && milestone.deliverables.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Deliverables</h4>
              <ul className="space-y-1.5">
                {milestone.deliverables.map((deliverable, i) => (
                  <li key={i} className="flex items-start">
                    <FontAwesomeIcon icon={faCheck} className="text-gray-500 mr-2 mt-1 h-[12px]" />
                    <span className="text-sm text-gray-400">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Budget if exists */}
          {milestone.budget && (
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <FontAwesomeIcon icon={faMoneyBill} className="text-green-500 mr-1 h-[14px]" />
              <span>Budget: {milestone.budget} {milestone.budgetCurrency || 'USD'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectView;
