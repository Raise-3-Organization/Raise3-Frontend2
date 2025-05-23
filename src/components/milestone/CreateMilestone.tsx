'use client'
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useRoles } from "@/hooks/useRoles";
import { useAccount, useWriteContract } from 'wagmi';
import { mileStoneMetadata } from '@/helper/UploadPinta';
import Raise3Abi from "@/abis/Raise3MileStone.json";
import { contractAddress } from '@/contants';
// import { useParams } from 'next/navigation';
interface MilestoneItem {
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliverables: string[];
  budget?: string;
  budgetCurrency?: string;
}

interface MilestoneFormData {
  milestones: MilestoneItem[];
}

interface CreateMilestoneProps {
  onClose: () => void;
  projectId: string;
}

const CreateMilestone = ({ 
  onClose, 
  projectId 
}: CreateMilestoneProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const { isFounderRole } = useRoles(address as `0x${string}`)
  
  const [formData, setFormData] = useState<MilestoneFormData>({
    milestones: [
      {
        title: '',
        description: '',
        targetDate: '',
        status: 'pending',
        deliverables: [''],
        budget: '',
        budgetCurrency: 'USD'
      }
    ]
  });

  const handleMilestoneChange = (
    index: number, 
    field: keyof MilestoneItem, 
    value: string | string[]
  ) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index] = { 
      ...updatedMilestones[index], 
      [field]: value 
    };
    
    setFormData(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
  };

  const handleDeliverableChange = (
    milestoneIndex: number,
    deliverableIndex: number,
    value: string
  ) => {
    const updatedMilestones = [...formData.milestones];
    const updatedDeliverables = [...updatedMilestones[milestoneIndex].deliverables];
    updatedDeliverables[deliverableIndex] = value;
    
    updatedMilestones[milestoneIndex] = {
      ...updatedMilestones[milestoneIndex],
      deliverables: updatedDeliverables
    };
    
    setFormData(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
  };

  const addDeliverable = (milestoneIndex: number) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[milestoneIndex].deliverables.push('');
    
    setFormData(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    if (formData.milestones[milestoneIndex].deliverables.length > 1) {
      const updatedMilestones = [...formData.milestones];
      updatedMilestones[milestoneIndex].deliverables = 
        updatedMilestones[milestoneIndex].deliverables.filter((_, i) => i !== deliverableIndex);
      
      setFormData(prev => ({
        ...prev,
        milestones: updatedMilestones
      }));
    }
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones, 
        {
          title: '',
          description: '',
          targetDate: '',
          status: 'pending',
          deliverables: [''],
          budget: '',
          budgetCurrency: 'USD'
        }
      ]
    }));
  };

  const removeMilestone = (index: number) => {
    if (formData.milestones.length > 1) {
      const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
      
      setFormData(prev => ({
        ...prev,
        milestones: updatedMilestones
      }));
    }
  };

  const validateForm = () => {
    return formData.milestones.every(milestone => 
      milestone.title.trim() !== '' && 
      milestone.description.trim() !== '' && 
      milestone.targetDate.trim() !== '' &&
      milestone.deliverables.every(deliverable => deliverable.trim() !== '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        

        if (!isFounderRole) {
          setError('You do not have permission to create milestones.');
          setIsSubmitting(false);
          return;
        }

        const response = await mileStoneMetadata({
          title: formData.milestones[0].title,
          description: formData.milestones[0].description,
          targetDate: formData.milestones[0].targetDate,
          status: formData.milestones[0].status,
          deliverables: formData.milestones[0].deliverables,
          budget: formData.milestones[0].budget ?? "",
          budgetCurrency: formData.milestones[0].budgetCurrency ?? "USD"
        })

        if (response) {
          const responseContract = await writeContractAsync({
            abi: Raise3Abi,
            address: contractAddress,
            functionName: 'addMilestone',
            args: [projectId, response, formData.milestones[0].budget]
          })
        }
        
        // Milestones created successfully
        setShowSuccessMessage(true);
        setIsSubmitting(false);
        
        // Reset form data and close modal after a delay
        setTimeout(() => {
          onClose();
          setFormData({
            milestones: [
              {
                title: '',
                description: '',
                targetDate: '',
                status: 'pending',
                deliverables: [''],
                budget: '',
                budgetCurrency: 'USD'
              }
            ]
          });
          setShowSuccessMessage(false);
        }, 2000);
      } catch (error) {
        setError('An error occurred while creating the milestones. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 overflow-y-auto">
      <div className="relative w-full max-w-3xl mx-auto p-6 my-8">
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-xl border border-gray-800 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create Project Milestones</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            {showSuccessMessage && (
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 mb-4 text-green-200 text-sm">
                Milestones created successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {formData.milestones.map((milestone, milestoneIndex) => (
                <div 
                  key={milestoneIndex} 
                  className="p-4 border border-gray-800 rounded-lg bg-[#0A0A0A] shadow-md hover:shadow-lg transition-all duration-200 hover:border-gray-600"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-medium">Milestone {milestoneIndex + 1}</h3>
                    {formData.milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(milestoneIndex)}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`milestone-title-${milestoneIndex}`} className="block text-sm font-medium text-gray-300 mb-1.5">
                        Title<span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`milestone-title-${milestoneIndex}`}
                        type="text"
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(milestoneIndex, 'title', e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                        placeholder="Milestone Title"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={`milestone-description-${milestoneIndex}`} className="block text-sm font-medium text-gray-300 mb-1.5">
                        Description<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id={`milestone-description-${milestoneIndex}`}
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(milestoneIndex, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500 resize-none"
                        placeholder="Describe this milestone..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`milestone-target-date-${milestoneIndex}`} className="block text-sm font-medium text-gray-300 mb-1.5">
                          Target Completion Date<span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`milestone-target-date-${milestoneIndex}`}
                          type="date"
                          value={milestone.targetDate}
                          onChange={(e) => handleMilestoneChange(milestoneIndex, 'targetDate', e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor={`milestone-status-${milestoneIndex}`} className="block text-sm font-medium text-gray-300 mb-1.5">
                          Status
                        </label>
                        <select
                          id={`milestone-status-${milestoneIndex}`}
                          value={milestone.status}
                          onChange={(e) => handleMilestoneChange(
                            milestoneIndex, 
                            'status', 
                            e.target.value as 'pending' | 'in-progress' | 'completed'
                          )}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor={`milestone-budget-${milestoneIndex}`} className="block text-sm font-medium text-gray-300 mb-1.5">
                          Budget (Optional)
                        </label>
                        <input
                          id={`milestone-budget-${milestoneIndex}`}
                          type="text"
                          value={milestone.budget}
                          onChange={(e) => handleMilestoneChange(milestoneIndex, 'budget', e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label htmlFor={`milestone-currency-${milestoneIndex}`} className="block text-sm font-medium text-gray-300 mb-1.5">
                          Currency
                        </label>
                        <select
                          id={`milestone-currency-${milestoneIndex}`}
                          value={milestone.budgetCurrency}
                          onChange={(e) => handleMilestoneChange(milestoneIndex, 'budgetCurrency', e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Deliverables<span className="text-red-500">*</span>
                      </label>
                      
                      {milestone.deliverables.map((deliverable, deliverableIndex) => (
                        <div key={deliverableIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={deliverable}
                            onChange={(e) => handleDeliverableChange(
                              milestoneIndex, 
                              deliverableIndex, 
                              e.target.value
                            )}
                            className="flex-1 px-4 py-2.5 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white shadow-inner focus:ring-2 focus:ring-[#FF7171]/50 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
                            placeholder="Deliverable item"
                            required
                          />
                          
                          {milestone.deliverables.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDeliverable(milestoneIndex, deliverableIndex)}
                              className="text-red-400 hover:text-red-300 transition-colors p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addDeliverable(milestoneIndex)}
                        className="mt-2 inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Plus size={16} className="mr-1" /> Add Deliverable
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMilestone}
                className="w-full py-3 border border-dashed border-gray-700 rounded-lg hover:border-gray-500 transition-colors flex items-center justify-center text-gray-400 hover:text-gray-300"
              >
                <Plus size={18} className="mr-2" /> Add Another Milestone
              </button>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FF7171] to-[#FF5C87] hover:from-[#FF5C87] hover:to-[#FF7171] rounded-lg text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Milestones'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMilestone;
