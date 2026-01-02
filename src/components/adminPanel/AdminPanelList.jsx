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
  const [users, setUsers] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addError, setAddError] = useState("");
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
  const api = useApi();

  const fetchCategories = async () => {
    const res = await api("/categories", { method: "GET" });
    const list = res?.data ?? res?.result ?? res ?? [];
    setCategories(list.filter((c) => c && c.name));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
    const fetchUsers = async () => {
      if (activeTab !== "users") return;
      
      try {
        setIsLoadingUsers(true);
        const usersData = await api("/users", { method: "GET" });
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

    setAddError("");

    const exists = categories.some(
      (c) => c?.name?.toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      setAddError("Category already exists");
      return;
    }

    try {
      await api("/categories", {
        method: "POST",
        body: JSON.stringify({ name: trimmedName }),
      });

      await fetchCategories();
      setNewCategoryName("");
    } catch (error) {
      if (error?.message?.includes("409")) {
        setAddError("Category already exists");
      } else {
        console.error("Failed to create category", error);
      }
    }
  };


    //refetch update
    setNewCategoryName("");
  } catch (error) {
    console.error("Failed to create category", error);
  }
};

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await api(`/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      await fetchCategories();
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Failed to delete category", error);
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

  const handleSaveCategory = async () => {
    await fetchCategories();
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
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
              onSubmit={handleAddCategory}
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    setAddError("");
                  }}
                  placeholder="Category name"
                  className={`w-full rounded-md border px-3 py-2 text-sm ${
                    addError
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {addError && (
                  <div className="absolute left-0 top-full mt-2 z-10">
                    <div className="relative rounded-md bg-red-500 px-3 py-1.5 text-xs text-white shadow-lg">
                      {addError}
                      <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-red-500" />
                    </div>
                  </div>
                )}
              </div>

              <PrimaryButton
                type={isAddDisabled ? "button" : "submit"}
                icon={<Plus className="h-4 w-4" />}
                className={`${
                  isAddDisabled ? "pointer-events-none opacity-60" : ""
                } !bg-purple-600 !border-purple-600`}
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
            {categories
              .filter((category) => category && category.name)
              .map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-5 py-4 shadow-sm"
                >
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {category.name}
                    </p>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditCategory(category)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
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
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const isAdmin = user.role === "Admin" || user.role === "admin";
                return (
                  <div
                    key={user._id || user.id}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-5 py-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">
                        {user.name || user.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Shield
                          className={`h-4 w-4 ${
                            isAdmin ? "text-purple-600" : "text-gray-400"
                          }`}
                          strokeWidth={2}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isAdmin ? "text-purple-600" : "text-gray-600"
                          }`}
                        >
                          {isAdmin ? "Admin" : "User"}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAdmin}
                          onChange={async (e) => {
                            const newRole = e.target.checked ? "Admin" : "User";
                            try {
                              setIsAdding(true);
                              await api(`/users/${user._id || user.id}`, {
                                method: "PATCH",
                                body: { role: newRole },
                              });
                              const updatedUsers = await api("/users", {
                                method: "GET",
                              });
                              setUsers(updatedUsers || []);
                            } catch (err) {
                              console.error("Error updating user role:", err);
                              setError(
                                err.message || "Failed to update user role"
                              );
                            } finally {
                              setIsAdding(false);
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
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
