"use client";

import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { useContract } from "../context/ContractContext";
import { DashboardContext } from "./generalComponents/Dashboard";
import { useAccount } from "wagmi";

const ProjectActions = () => {
  const { isConnected: isContractConnected, submitProject } = useContract();
  const { isConnected: isWagmiConnected } = useAccount();
  const { addNotification } = useContext(DashboardContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: "",
    milestones: [{ name: "", description: "", fundNeeded: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle milestone input changes
  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setFormData((prev) => ({ ...prev, milestones: updatedMilestones }));
  };

  // Add milestone
  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { name: "", description: "", fundNeeded: "" },
      ],
    }));
  };

  // Remove milestone
  const removeMilestone = (index) => {
    if (formData.milestones.length > 1) {
      const updatedMilestones = formData.milestones.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, milestones: updatedMilestones }));
    }
  };

  // Handle project submission
  const handleSubmitProject = async (e) => {
    e.preventDefault();

    // Check both Wagmi and contract connection status
    if (!isWagmiConnected) {
      addNotification("Please connect your wallet first", "error");
      return;
    }

    // If Wagmi says we're connected but contract doesn't, try to force a refresh
    if (!isContractConnected) {
      addNotification(
        "Wallet connected but contract not initialized. Please refresh the page.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      // Show pending notification
      addNotification("Preparing transaction...", "info", 0);

      // Validate milestone amounts match total
      const totalMilestonesFunding = formData.milestones.reduce(
        (sum, m) => sum + parseFloat(m.fundNeeded || 0),
        0
      );

      if (
        Math.abs(totalMilestonesFunding - parseFloat(formData.goal)) > 0.0001
      ) {
        addNotification(
          `Warning: Total milestones funding (${totalMilestonesFunding} ETH) doesn't match goal (${formData.goal} ETH). They should be equal.`,
          "warning",
          5000
        );
      }

      // Format milestones for the contract (convert to blockchain format)
      const formattedMilestones = formData.milestones.map((m) => ({
        milestoneName: m.name,
        milestoneDescription: m.description,
        fundNeeded: ethers.parseEther(m.fundNeeded.toString()), // Updated to ethers v6 syntax
        isComplete: false,
        voting: false,
        isApproved: false,
        totalVoters: 0,
        startDate: 0,
        endDate: 0,
      }));

      // Log transaction details
      console.log(
        `Creating project "${formData.name}" with ${formData.milestones.length} milestones`
      );

      // Send the notification to prepare user for wallet popup
      addNotification(
        "Creating project, please confirm in your wallet...",
        "info",
        0
      );

      // Submit the project with a direct approach
      try {
        const tx = await submitProject(
          formData.name,
          formData.description,
          ethers.parseEther(formData.goal.toString()), // Updated to ethers v6 syntax
          formattedMilestones
        );

        // Update notification while waiting for transaction
        addNotification(
          `Transaction submitted! Waiting for confirmation on blockchain...`,
          "info",
          0
        );

        // Wait for transaction confirmation
        await tx.wait(1); // Wait for 1 confirmation

        // Show success notification
        addNotification(
          `Project "${formData.name}" successfully created!`,
          "success"
        );

        // Reset form
        setFormData({
          name: "",
          description: "",
          goal: "",
          milestones: [{ name: "", description: "", fundNeeded: "" }],
        });
      } catch (txError) {
        console.error("Transaction failed:", txError);

        let errorMessage = "Transaction failed";

        // Handle specific wallet issues
        if (
          txError.code === 4001 ||
          (txError.message && txError.message.includes("user rejected"))
        ) {
          errorMessage = "Transaction was rejected in your wallet";
        }
        // Handle gas estimation errors
        else if (txError.code === "UNPREDICTABLE_GAS_LIMIT") {
          errorMessage =
            "Gas estimation failed. Contract rejected the transaction parameters.";
        }
        // Generic error
        else if (txError.message) {
          errorMessage = txError.message;
        }

        addNotification(`Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error in submission process:", error);
      addNotification(`Unexpected error: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Only check for wallet connection when not in dashboard
  if (!isWagmiConnected && !window.location.href.includes("dashboard")) {
    return (
      <div className="p-4">
        Please connect your wallet to interact with projects
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {message.text && (
        <div
          className={`p-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Project Creation Form */}
      <div className="bg-black p-6 rounded-lg shadow-md border border-gray-800">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Create New Project</h2>
        </div>
        <form onSubmit={handleSubmitProject}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-[#FF7171] focus:ring-[#FF7171]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-[#FF7171] focus:ring-[#FF7171]"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Fundraising Goal (ETH)
              </label>
              <input
                type="number"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-[#FF7171] focus:ring-[#FF7171]"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Milestones
              </label>
              {formData.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-600 bg-gray-800 rounded-md mb-4"
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium text-white">
                      Milestone {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-400"
                      disabled={formData.milestones.length === 1}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) =>
                          handleMilestoneChange(index, "name", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-[#FF7171] focus:ring-[#FF7171]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white">
                        Description
                      </label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) =>
                          handleMilestoneChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-[#FF7171] focus:ring-[#FF7171]"
                        rows="2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white">
                        Funds Needed (ETH)
                      </label>
                      <input
                        type="number"
                        value={milestone.fundNeeded}
                        onChange={(e) =>
                          handleMilestoneChange(
                            index,
                            "fundNeeded",
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-[#FF7171] focus:ring-[#FF7171]"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMilestone}
                className="text-[#FF7171] font-medium"
              >
                + Add Another Milestone
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !isWagmiConnected || !isContractConnected}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7171] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectActions;
