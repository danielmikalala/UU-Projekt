import React, { useMemo, useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { FaRegUser, FaShieldAlt } from "react-icons/fa";
import PrimaryButton from "../buttons/PrimaryButton.jsx";
import AdminPanelModal from "./AdminPanelModal.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";
import ProjectApprovalPanel from "./ProjectApprovalPanel.jsx";
import { useApi } from "../../api/apiClient.js";

const TABS = [
  { id: "campaigns", label: "Campaigns" },
  { id: "categories", label: "Categories" },
  { id: "users", label: "Users" },
];

export default function AdminPanelList() {
  const api = useApi();
  const [activeTab, setActiveTab] = useState("categories");
  const [campaignSubTab, setCampaignSubTab] = useState("PendingApproval");
  const [categories, setCategories] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await api("/categories", { method: "GET" });
        setCategories(categoriesData || []);
        setError("");
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeTab === "campaigns") {
      const fetchCampaigns = async () => {
        try {
          setIsLoadingCampaigns(true);
          const campaignsData = await api("/projects", { method: "GET" });
          setCampaigns(campaignsData || []);
          setError("");
        } catch (err) {
          console.error("Error fetching campaigns:", err);
          setError("Failed to load campaigns");
        } finally {
          setIsLoadingCampaigns(false);
        }
      };
      fetchCampaigns();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "users") {
      const fetchUsers = async () => {
        try {
          setIsLoadingUsers(true);
          const usersData = await api("/users", { method: "GET" });
          setUsers(usersData || []);
          setError("");
        } catch (err) {
          console.error("Error fetching users:", err);
          setError("Failed to load users");
        } finally {
          setIsLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab]);

  const isAddDisabled = useMemo(
    () => newCategoryName.trim().length === 0 || isAdding,
    [newCategoryName, isAdding],
  );

  const handleAddCategory = async (event) => {
    event.preventDefault();
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        (category.name || "").toLowerCase() === trimmedName.toLowerCase(),
    );

    if (alreadyExists) {
      setError("Category with this name already exists");
      setNewCategoryName("");
      return;
    }

    try {
      setIsAdding(true);
      setError("");
      await api("/categories", {
        method: "POST",
        body: {
          name: trimmedName,
        },
      });

      const updatedCategories = await api("/categories", { method: "GET" });
      setCategories(updatedCategories || []);
      setNewCategoryName("");
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err.message || "Failed to create category");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    const categoryId = categoryToDelete._id || categoryToDelete.id;
    if (!categoryId) {
      setError("Category ID not found");
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      return;
    }

    try {
      setIsAdding(true);
      setError("");
      await api(`/categories/${categoryId}`, {
        method: "DELETE",
      });

      const updatedCategories = await api("/categories", { method: "GET" });
      setCategories(updatedCategories || []);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.message || "Failed to delete category");
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleRole = async (user, newRole) => {
    if (user.role === newRole) {
      return;
    }

    const userId = user._id || user.id;
    if (!userId) {
      setError("User ID not found");
      return;
    }

    try {
      setUpdatingUserId(userId);
      setError("");
      await api(`/users/update-role/${userId}`, {
        method: "PUT",
        body: { role: newRole },
      });

      const updatedUsers = await api("/users", { method: "GET" });
      setUsers(updatedUsers || []);
    } catch (err) {
      console.error("Error updating user role:", err);
      setError(err.message || "Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const refetchCampaigns = async () => {
    try {
      const campaignsData = await api("/projects", { method: "GET" });
      setCampaigns(campaignsData || []);
    } catch (err) {
      console.error("Error refetching campaigns:", err);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (updatedCategory) => {
    const categoryId = updatedCategory._id || updatedCategory.id;
    
    if (!categoryId) {
      setError("Category ID not found");
      return;
    }

    try {
      setIsAdding(true);
      setError("");
      
      // Make API call to update category on backend
      await api(`/categories/${categoryId}`, {
        method: "POST",
        body: {
          name: updatedCategory.name.trim(),
        },
      });

      // Fetch updated categories from backend to ensure consistency
      const updatedCategories = await api("/categories", { method: "GET" });
      setCategories(updatedCategories || []);
      
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.message || "Failed to update category");
    } finally {
      setIsAdding(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => campaign.status === campaignSubTab);
  }, [campaigns, campaignSubTab]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setError("");
              }}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "categories" && (
        <section className="mt-8 space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Category
            </h2>
            <form
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
              onSubmit={handleAddCategory}
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Category name"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <PrimaryButton
                type={isAddDisabled ? "button" : "submit"}
                icon={<Plus className="h-4 w-4" strokeWidth={2} />}
                disabled={isAddDisabled}
                className={`${isAddDisabled ? "pointer-events-none opacity-60" : ""} !bg-purple-600 !border-purple-600 hover:!bg-purple-700`}
              >
                {isAdding ? "Adding..." : "Add"}
              </PrimaryButton>
            </form>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 mb-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No categories yet. Create one above!
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id || category.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-5 py-4 shadow-sm"
                >
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {category.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditCategory(category)}
                      aria-label={`Edit ${category.name}`}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      aria-label={`Delete ${category.name}`}
                      className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === "campaigns" && (
        <section className="mt-8 space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Campaign Management
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Review and approve submitted campaigns. Campaigns with "Pending"
              status can be approved or rejected.
            </p>

            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => {
                  setCampaignSubTab("PendingApproval");
                  setError("");
                }}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  campaignSubTab === "PendingApproval"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => {
                  setCampaignSubTab("Approved");
                  setError("");
                }}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  campaignSubTab === "Approved"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Approved
              </button>
              <button
                type="button"
                onClick={() => {
                  setCampaignSubTab("Rejected");
                  setError("");
                }}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  campaignSubTab === "Rejected"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Rejected
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {isLoadingCampaigns ? (
              <div className="text-center text-gray-500 py-4">
                Loading campaigns...
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
                No{" "}
                {campaignSubTab === "PendingApproval"
                  ? "pending"
                  : campaignSubTab.toLowerCase()}{" "}
                campaigns.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCampaigns.map((campaign) => (
                  <ProjectApprovalPanel
                    key={campaign._id || campaign.id}
                    project={{
                      _id: campaign._id || campaign.id,
                      title: campaign.name || campaign.title,
                      description: campaign.description,
                      category: campaign.category,
                      categoryId: campaign.categoryId,
                      fundingGoal: campaign.goalAmount || campaign.fundingGoal,
                      currentAmount: campaign.currentAmount || 0,
                      deadLine: campaign.deadLine,
                      status: campaign.status,
                      createdAt: campaign.createdAt,
                    }}
                    onStatusChanged={refetchCampaigns}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "users" && (
        <section className="mt-8 space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              User Management
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Manage user roles and permissions.
            </p>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {isLoadingUsers ? (
                <div className="text-center text-gray-500 py-4">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No users found.
                </div>
              ) : (
                users.map((user) => {
                  const userId = user._id || user.id;
                  const isUpdating = updatingUserId === userId;
                  return (
                    <div
                      key={userId}
                      className={`flex items-center justify-between rounded-md border border-gray-200 bg-white px-5 py-4 shadow-sm ${isUpdating ? "opacity-60" : ""}`}
                    >
                      <div>
                        <p className="text-base font-semibold text-gray-900">
                          {user.name || user.email}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm flex items-center gap-1 ${user.role === "USER" ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                          <FaRegUser className="w-4 h-4" />
                          User
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={user.role === "ADMIN"}
                            onChange={() => handleToggleRole(user, user.role === "ADMIN" ? "USER" : "ADMIN")}
                            disabled={isUpdating}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:cursor-not-allowed"></div>
                        </label>
                        <span className={`text-sm flex items-center gap-1 ${user.role === "ADMIN" ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                          <FaShieldAlt className="w-4 h-4" />
                          Admin
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}

      <AdminPanelModal
        category={editingCategory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={categoryToDelete?.name || ""}
      />
    </>
  );
}
