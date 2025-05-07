import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FormData {
  // General Info
  projectName: string;
  description: string;
  problem: string;
  solution: string;
  mission: string;
  location: string;
  
  // Social Media
  socialMedia: {
    twitter: string;
    github: string;
    discord: string;
    website: string;
    linkedin: string;
  };
  
  // Project Stage
  projectStage: {
    path: string;
    businessModel: string;
    stage: string;
    raisedAmount: string;
    raisedCurrency: string;
  };
  
  // Contact Info
  contactInfo: {
    fullName: string;
    email: string;
    telegram: string;
    network: string;
  };
  team: {
    members: Array<{
      name: string;
      role: string;
    }>;
  };
}

interface MultiStepProjectFormProps {
  onClose: () => void;
  onSubmit?: (data: FormData) => void;
}

const MultiStepProjectForm: React.FC<MultiStepProjectFormProps> = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    description: '',
    problem: '',
    solution: '',
    mission: '',
    location: '',
    socialMedia: {
      twitter: '',
      github: '',
      discord: '',
      website: '',
      linkedin: ''
    },
    projectStage: {
      path: '',
      businessModel: '',
      stage: '',
      raisedAmount: '',
      raisedCurrency: 'USD'
    },
    contactInfo: {
      fullName: '',
      email: '',
      telegram: '',
      network: ''
    },
    team: {
      members: [{ name: '', role: '' }]
    }
  });

  const steps = [
    "General Information",
    "Social Media",
    "Project Stage",
    "Contact Information",
    "Team"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // If the user is typing a value without http/https prefix, add it
    if (value && !value.match(/^https?:\/\//)) {
      if (name === 'twitter') {
        formattedValue = value.startsWith('@') 
          ? `https://twitter.com/${value.substring(1)}` 
          : `https://twitter.com/${value}`;
      } else if (name === 'github') {
        formattedValue = `https://github.com/${value}`;
      } else if (name === 'discord') {
        // For Discord, if it's an invite code or full URL
        if (value.includes('discord.gg') || value.includes('discord.com')) {
          formattedValue = value;
        } else {
          formattedValue = `https://discord.gg/${value}`;
        }
      } else if (name === 'linkedin') {
        formattedValue = `https://linkedin.com/in/${value}`;
      } else if (name === 'website' && value.trim() !== '') {
        formattedValue = `https://${value}`;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: formattedValue
      }
    }));
  };
  
  // Function to validate if a URL is properly formatted
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (not required)
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleProjectStageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      projectStage: {
        ...prev.projectStage,
        [name]: value
      }
    }));
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...formData.team.members];
    updatedMembers[index] = { 
      ...updatedMembers[index], 
      [field]: value 
    };
    
    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: updatedMembers
      }
    }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: [...prev.team.members, { name: '', role: '' }]
      }
    }));
  };

  const removeTeamMember = (index: number) => {
    if (formData.team.members.length > 1) {
      const updatedMembers = formData.team.members.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        team: {
          ...prev.team,
          members: updatedMembers
        }
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    switch (currentStep) {
      case 0: // General Info
        return formData.projectName.trim() !== '' && 
               formData.description.trim() !== '' && 
               formData.problem.trim() !== '' && 
               formData.solution.trim() !== '' && 
               formData.mission.trim() !== '' && 
               formData.location.trim() !== '';
      case 1: // Social Media
        return (
          // Ensure all provided social media links are valid URLs
          (formData.socialMedia.twitter === '' || isValidUrl(formData.socialMedia.twitter)) &&
          (formData.socialMedia.github === '' || isValidUrl(formData.socialMedia.github)) &&
          (formData.socialMedia.discord === '' || isValidUrl(formData.socialMedia.discord)) &&
          (formData.socialMedia.website === '' || isValidUrl(formData.socialMedia.website)) &&
          (formData.socialMedia.linkedin === '' || isValidUrl(formData.socialMedia.linkedin))
        )
      case 2: // Project Stage
        return true; // All fields are optional
      case 3: // Contact Info
        return formData.contactInfo.fullName.trim() !== '' && 
               formData.contactInfo.email.trim() !== '' && 
               formData.contactInfo.telegram.trim() !== '';
      case 4: // Team
        return formData.team.members.every(member => 
               member.name.trim() !== '' && 
               member.role.trim() !== '');
      default:
        return true;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    
    if (currentStep < steps.length - 1) {
      if (validateForm()) {
        setCurrentStep(prevStep => prevStep + 1);
      } else {
        setError('Please fill in all required fields.');
      }
    } else {
      if (validateForm()) {
        try {
          // Simulate API call to create project
          setIsSubmitting(true);
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Call onSubmit if provided
          if (onSubmit) {
            onSubmit(formData);
          }
          
          // Project created successfully
          setShowSuccessMessage(true);
          setIsSubmitting(false);
          
          // Reset form data and close modal after a delay
          setTimeout(() => {
            onClose();
            setFormData({
              projectName: '',
              description: '',
              problem: '',
              solution: '',
              mission: '',
              location: '',
              socialMedia: {
                twitter: '',
                github: '',
                discord: '',
                website: '',
                linkedin: ''
              },
              projectStage: {
                path: '',
                businessModel: '',
                stage: '',
                raisedAmount: '',
                raisedCurrency: 'USD'
              },
              contactInfo: {
                fullName: '',
                email: '',
                telegram: '',
                network: ''
              },
              team: {
                members: [{ name: '', role: '' }]
              }
            });
            setCurrentStep(0);
            setShowSuccessMessage(false);
          }, 2000);
        } catch (error) {
          setError('An error occurred while creating the project. Please try again.');
          setIsSubmitting(false);
        }
      } else {
        setError('Please fill in all required fields.');
      }
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // General Info
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1.5">
                Project name<span className="text-red-500">*</span>
              </label>
              <input
                id="projectName"
                name="projectName"
                type="text"
                value={formData.projectName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                placeholder="Enter your project Name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 resize-none focus:shadow-inner-lg"
                placeholder="Describe your project..."
                required
              />
            </div>

            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-300 mb-1">
                Project Problem<span className="text-red-500">*</span>
              </label>
              <textarea
                id="problem"
                name="problem"
                value={formData.problem}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 resize-none focus:shadow-inner-lg"
                placeholder="E.g. Lack of Interactive Features: Users are seeking more engaging content and activities."
                required
              />
            </div>
            
            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-300 mb-1">
                Project Solution<span className="text-red-500">*</span>
              </label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 resize-none focus:shadow-inner-lg"
                placeholder="Describe the solution to the problem..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="mission" className="block text-sm font-medium text-gray-300 mb-1">
                Project Mission<span className="text-red-500">*</span>
              </label>
              <textarea
                id="mission"
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 resize-none focus:shadow-inner-lg"
                placeholder="What is your project's mission?"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                Location<span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                placeholder="Location"
                required
              />
            </div>
          </div>
        );
      
      case 1: // Social Media
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-1">
                Twitter
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-[#FF7171] transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <input
                  id="twitter"
                  name="twitter"
                  type="url"
                  value={formData.socialMedia.twitter}
                  onChange={handleSocialMediaChange}
                  className="w-full pl-11 px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg"
                  placeholder="@username or profile URL"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1">
                Github
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-[#FF7171] transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <input
                  id="github"
                  name="github"
                  type="url"
                  value={formData.socialMedia.github}
                  onChange={handleSocialMediaChange}
                  className="w-full pl-11 px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg"
                  placeholder="username or profile URL"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="discord" className="block text-sm font-medium text-gray-300 mb-1">
                Discord
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-[#FF7171] transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </div>
                <input
                  id="discord"
                  name="discord"
                  type="url"
                  value={formData.socialMedia.discord}
                  onChange={handleSocialMediaChange}
                  className="w-full pl-11 px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg"
                  placeholder="server invite or profile URL"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                Website
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-[#FF7171] transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.socialMedia.website}
                  onChange={handleSocialMediaChange}
                  className="w-full pl-11 px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
                Linkedin
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-[#FF7171] transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={formData.socialMedia.linkedin}
                  onChange={handleSocialMediaChange}
                  className="w-full pl-11 px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg"
                  placeholder="username or profile URL"
                />
              </div>
            </div>
          </div>
        );
      
      case 2: // Project Stage
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">
              Answer the more questions below and we can help you tailor your project to meet local & other recommendations.
            </p>

            <div>
              <label htmlFor="path" className="block text-sm font-medium text-gray-300 mb-1">
                What path do you want to take? (Optional)
              </label>
              <select
                id="path"
                name="path"
                value={formData.projectStage.path}
                onChange={handleProjectStageChange}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
              >
                <option value="">Select</option>
                <option value="path1">Product</option>
                <option value="path2">Service</option>
                <option value="path3">Community</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="businessModel" className="block text-sm font-medium text-gray-300 mb-1">
                What is your business model? (Optional)
              </label>
              <input
                id="businessModel"
                name="businessModel"
                type="text"
                value={formData.projectStage.businessModel}
                onChange={handleProjectStageChange}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                placeholder="Describe your business model"
              />
            </div>
            
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-300 mb-1">
                What stage is your business? (Optional)
              </label>
              <input
                id="stage"
                name="stage"
                type="text"
                value={formData.projectStage.stage}
                onChange={handleProjectStageChange}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                placeholder="e.g. MVP stage, Series A, Series B, Series C"
              />
            </div>

            <div>
              <label htmlFor="raisedAmount" className="block text-sm font-medium text-gray-300 mb-1">
                What is your funding goal amount? <span className="text-[#FF7171]">*</span>
              </label>
              <div className="flex shadow-md">
                <input
                  id="raisedAmount"
                  name="raisedAmount"
                  type="text"
                  value={formData.projectStage.raisedAmount}
                  onChange={handleProjectStageChange}
                  className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-l-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                  placeholder="0"
                  required
                />
                <select
                  id="raisedCurrency"
                  name="raisedCurrency"
                  value={formData.projectStage.raisedCurrency}
                  onChange={handleProjectStageChange}
                  className="px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 border-l-0 rounded-r-lg text-white focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 focus:shadow-inner-lg relative"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 3: // Contact Info
        return (
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-800/40 rounded-lg p-4 mb-6 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent rounded-lg pointer-events-none"></div>
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2 shadow-lg animate-pulse-slow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-center text-lg font-bold text-blue-100 mb-1">WE need at least ONE contact!</h3>
              <p className="text-center text-sm text-blue-200/80">
                We'll notify your team members if anything changes to your project. Provide at least one contact for updates and decisions.
              </p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name<span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.contactInfo.fullName}
                onChange={handleContactInfoChange}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.contactInfo.email}
                onChange={handleContactInfoChange}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-300 mb-1">
                Telegram<span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <input
                  id="telegram"
                  name="telegram"
                  type="text"
                  value={formData.contactInfo.telegram}
                  onChange={handleContactInfoChange}
                  className="w-full pl-9 px-4 py-2.5 bg-gray-800/70 border border-gray-700 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                  placeholder="username"
                  required
                />
                <span className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-[#FF7171] transition-colors duration-200">@</span>
              </div>
            </div>

            <div>
              <label htmlFor="network" className="block text-sm font-medium text-gray-300 mb-1">
                Choose a network to create your project?
              </label>
              <select
                id="network"
                name="network"
                value={formData.contactInfo.network}
                onChange={handleContactInfoChange}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
              >
                <option value="">Select the network</option>
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="solana">Solana</option>
                <option value="ton">TON</option>
                <option value="bsc">BSC</option>
              </select>
            </div>
          </div>
        );
      
      case 4: // Team
        return (
          <div className="space-y-6">
              <div className="space-y-5">
              {formData.team.members.map((member, index) => (
                <div key={index} className="p-4 border border-gray-800 rounded-lg bg-[#0A0A0A] shadow-md hover:shadow-lg transition-all duration-200 hover:border-gray-600 overflow-hidden">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-medium">Team Member {index + 1}</h3>
                    {formData.team.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                        placeholder="Member name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Role<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 focus:shadow-inner-lg relative"
                        placeholder="Member role"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addTeamMember}
              className="text-[#FF7171] hover:text-[#ff8f8f] text-sm font-medium flex items-center transition-all duration-200 hover:translate-x-0.5 group"
            >
              <svg className="w-4 h-4 mr-1.5 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg> Add Another Team Member
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-2xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800/50 animate-fadeIn relative">
        <div className="border-b border-gray-800/30 p-5 flex justify-between items-center sticky top-0 bg-black z-10 shadow-md">
          <h2 className="text-xl font-semibold text-white">Create New Project</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
            disabled={isSubmitting}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress steps */}
        <div className="px-5 pt-5 pb-2 sticky top-[68px] bg-black z-10 shadow-sm">
          <div className="flex mb-5 justify-between relative">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-800 -z-10"></div>
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center group transition-all duration-300 ease-in-out ${index <= currentStep ? 'text-[#FF7171]' : 'text-gray-500'}`}
              >
                <div 
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 shadow-md
                  ${index < currentStep ? 'bg-[#FF7171] text-white' : ''}
                  ${index === currentStep ? 'bg-[#FF7171] text-white ring-2 ring-[#FF7171]/30 ring-offset-1 ring-offset-black' : ''}
                  ${index > currentStep ? 'bg-gray-900 text-gray-500 border border-gray-700' : ''}`}
                >
                  {index < currentStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-2 opacity-90 font-medium hidden sm:block group-hover:scale-105 transition-transform duration-200">{step}</span>
              </div>
            ))}
          </div>
          <div className="relative w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-1 bg-[#FF7171] rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Success message */}
        {showSuccessMessage && (
          <div className="mx-5 mt-5 p-4 bg-green-900/20 border border-green-800/70 text-green-200 rounded-lg shadow-lg animate-fadeIn relative overflow-hidden">
            <div className="flex items-center">
              <div className="rounded-full bg-green-700/50 p-1 mr-3 shadow-inner">
                <svg className="h-5 w-5 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium text-green-100">Project created successfully!</span>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mx-5 mt-5 p-4 bg-red-900/20 border border-red-800/70 text-red-200 rounded-lg shadow-lg animate-fadeIn relative overflow-hidden">
            <div className="flex items-center">
              <div className="rounded-full bg-red-700/50 p-1 mr-3 shadow-inner">
                <svg className="h-5 w-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium text-red-100">{error}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-5">
          <h3 className="text-xl font-semibold text-white mb-5 tracking-tight">{steps[currentStep]}</h3>
          <div className="animate-slideUp relative overflow-hidden">
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#FF7171]/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#333]/5 blur-[100px] rounded-full pointer-events-none"></div>
            {renderStepContent()}
          </div>
          
          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => { setCurrentStep(prevStep => prevStep - 1); setError(null); }}
                className="px-5 py-2.5 border border-gray-800 text-white rounded-lg bg-gradient-to-b from-[#111] to-black hover:from-[#181818] hover:to-[#050505] focus:outline-none transition-all duration-200 shadow-md hover:shadow-lg hover:border-gray-600"
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-[#FF7171] to-[#FF6B6B] hover:from-[#FF8585] hover:to-[#FF7F7F] focus:outline-none flex items-center transition-all duration-200 shadow-md hover:shadow-glow transform hover:-translate-y-0.5 relative before:absolute before:inset-0 before:rounded-lg before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1),transparent)] before:pointer-events-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  currentStep === steps.length - 1 ? 'Submit' : 'Next'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepProjectForm;
