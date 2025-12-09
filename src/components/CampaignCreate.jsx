import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import { useCampaigns } from "../hooks/useCampaigns.js";

export default function CampaignCreate() {
  const navigate = useNavigate();
  const { addCampaign } = useCampaigns();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    fundingGoal: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Technology",
    "Arts & Culture",
    "Community",
    "Education",
    "Environment",
    "Health & Medical",
    "Sports & Recreation",
    "Business & Entrepreneurship",
    "Charity & Fundraising",
    "Other",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Add campaign to context
      const newCampaign = addCampaign(formData);
      console.log("Campaign submitted for approval:", newCampaign);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        fundingGoal: "",
      });

      // Navigate back to managed campaigns page
      navigate("/managed");
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Campaign
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Campaign Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="Enter your campaign title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-vertical"
                placeholder="Describe your campaign in detail..."
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Funding Goal */}
            <div className="space-y-2">
              <label
                htmlFor="fundingGoal"
                className="block text-sm font-medium text-gray-700"
              >
                Funding Goal ($)
              </label>
              <input
                id="fundingGoal"
                type="number"
                required
                min="1"
                step="1"
                value={formData.fundingGoal}
                onChange={(e) =>
                  handleInputChange("fundingGoal", e.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="Enter funding goal amount"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <PrimaryButton
                type="submit"
                className="w-full !bg-purple-600 !border-purple-600 hover:!bg-purple-700 py-3"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Campaign for Approval"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
