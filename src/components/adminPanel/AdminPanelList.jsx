import React, { useMemo, useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Shield } from "lucide-react";
import PrimaryButton from "../buttons/PrimaryButton.jsx";
import AdminPanelModal from "./AdminPanelModal.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";
import ProjectApprovalPanel from "./ProjectApprovalPanel.jsx";
import { useCampaigns } from "../../hooks/useCampaigns.js";
import { useApi } from "../../api/apiClient.js";

const TABS = [
  { id: "campaigns", label: "Campaigns" },
  { id: "categories", label: "Categories" },
  { id: "users", label: "Users" },
];

export default function AdminPanelList() {
  const api = useApi();

  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const { campaigns } = useCampaigns();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await api("/categories");
        setCategories(data || []);
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
    const fetchUsers = async () => {
      if (activeTab !== "users") return;

      try {
        setIsLoadingUsers(true);
        const usersData = await api("/users");
        setUsers(usersData || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  const isAddDisabled = useMemo(
    () => newCategoryName.trim().length === 0 || isAdding,
    [newCategoryName, isAdding],
  );

  const handleAddCategory = async (event) => {
    event.preventDefault();
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

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
        body: { name: trimmedName },
      });

      const data = await api("/categories");
      setCategories(data || []);
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
    if (!categoryToDelete?._id) return;

    try {
      setIsAdding(true);
      setError("");

      await api(`/categories/${categoryToDelete._id}`, {
        method: "DELETE",
      });

      const data = await api("/categories");
      setCategories(data || []);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.message || "Failed to delete category");
    } finally {
      setIsAdding(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
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
  const categoryId = updatedCategory?.id || updatedCategory?._id;

  if (!categoryId) {
    setError("Category ID not found");
    return;
  }

  try {
    setIsAdding(true);
    setError("");

    await api(`/categories/${categoryId}`, {
      method: "POST",
      body: JSON.stringify({
        name: updatedCategory.name,
      }),
    });

    const data = await api("/categories");
    setCategories(data || []);
    setIsModalOpen(false);
    setEditingCategory(null);
  } catch (err) {
    console.error("Error updating category:", err);
    setError(err.message || "Failed to update category");
  } finally {
    setIsAdding(false);
  }
};

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
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              />
              <PrimaryButton
                type={isAddDisabled ? "button" : "submit"}
                icon={<Plus className="h-4 w-4" />}
                disabled={isAddDisabled}
              >
                {isAdding ? "Adding..." : "Add"}
              </PrimaryButton>
            </form>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
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
                No categories yet.
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between rounded-md border bg-white px-5 py-4 shadow-sm"
                >
                  <p className="font-semibold">{category.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="rounded-md bg-blue-500 px-3 py-2 text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="rounded-md bg-red-500 px-3 py-2 text-white"
                    >
                      <Trash2 className="h-4 w-4" />
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
            {campaigns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
                No campaigns submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <ProjectApprovalPanel
                    key={campaign.id}
                    project={{
                      _id: campaign.id,
                      title: campaign.title,
                      description: campaign.description,
                      category: campaign.category,
                      fundingGoal: campaign.fundingGoal,
                      status: campaign.status,
                      createdAt: campaign.createdAt,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "users" && (
        <section className="mt-8 space-y-4">
          {isLoadingUsers ? (
            <div className="text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500">No users found.</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const isAdmin = user.role === "Admin" || user.role === "admin";
                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between rounded-md border bg-white px-5 py-4 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">
                        {user.name || user.email}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield
                        className={`h-4 w-4 ${
                          isAdmin ? "text-purple-600" : "text-gray-400"
                        }`}
                      />
                      <span>{isAdmin ? "Admin" : "User"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
