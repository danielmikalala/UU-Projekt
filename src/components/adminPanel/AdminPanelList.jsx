/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addError, setAddError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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

  const isAddDisabled = useMemo(
    () => newCategoryName.trim().length === 0,
    [newCategoryName]
  );

  const handleAddCategory = async (event) => {
    event.preventDefault();

    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    setAddError("");

<<<<<<< HEAD
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

=======
  try {
    const createdCategory = await api("/categories", {
      method: "POST",
      body: JSON.stringify({
        name: trimmedName,
      }),
    });

    //refetch update
    setNewCategoryName("");
  } catch (error) {
    console.error("Failed to create category", error);
  }
};
>>>>>>> 9d1a2c9e924ed9adb1e1bf152b1f7b932a0c8f8b
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
              onClick={() => setActiveTab(tab.id)}
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
                Add
              </PrimaryButton>
            </form>
          </div>

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
        <section className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
          User management is coming soon.
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
