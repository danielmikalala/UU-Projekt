import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import { useCampaigns } from "../hooks/useCampaigns.js";
import { useApi } from "../api/apiClient.js";

export default function CampaignCreate() {
  const navigate = useNavigate();
  const { addCampaign } = useCampaigns();
  const api = useApi();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    fundingGoal: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api("/categories", { method: "GET" });
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([
          { _id: "1", name: "Technology" },
          { _id: "2", name: "Arts & Culture" },
          { _id: "3", name: "Community" },
          { _id: "4", name: "Education" },
          { _id: "5", name: "Environment" },
          { _id: "6", name: "Health & Medical" },
          { _id: "7", name: "Sports & Recreation" },
          { _id: "8", name: "Business & Entrepreneurship" },
          { _id: "9", name: "Charity & Fundraising" },
          { _id: "10", name: "Other" },
        ]);
      }
    };
    fetchCategories();
  }, [api]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const goalAmount = Number(formData.fundingGoal);
      if (isNaN(goalAmount) || goalAmount <= 0) {
        setError("Please enter a valid funding goal greater than 0.");
        setIsSubmitting(false);
        return;
      }

      let categoryId = undefined;
      if (formData.category) {
        const selectedCategory = categories.find(
          (cat) => cat.name === formData.category,
        );
        if (selectedCategory?._id) {
          categoryId = selectedCategory._id;
        }
      }

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30);

      const campaignData = {
        name: formData.title.trim(),
        description: formData.description.trim(),
        goalAmount: goalAmount,
        deadLine: deadline.toISOString(),
      };

      if (categoryId) {
        campaignData.categoryId = categoryId;
      }

      console.log(
        "Sending campaign data to backend:",
        JSON.stringify(campaignData, null, 2),
      );
      console.log("Data types:", {
        name: typeof campaignData.name,
        description: typeof campaignData.description,
        goalAmount: typeof campaignData.goalAmount,
        categoryId: campaignData.categoryId
          ? typeof campaignData.categoryId
          : "undefined",
      });

      try {
        const result = await api("/projects", {
          method: "POST",
          body: campaignData,
        });
        console.log("Backend response:", result);
      } catch (apiError) {
        console.error("API Error details:", apiError);
        throw apiError;
      }

      addCampaign(formData);

      setFormData({
        title: "",
        description: "",
        category: "",
        fundingGoal: "",
      });

      navigate("/home");
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError(err.message || "Failed to create campaign. Please try again.");
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

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 bg-white"
              >
                <option value="">Select a category (optional)</option>
                {categories.map((category) => (
                  <option
                    key={category._id || category.id}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

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

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

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
