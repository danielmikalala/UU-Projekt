import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AdminPanelModal({ category, isOpen, onClose, onSave }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim() && slug.trim()) {
      onSave({
        ...category,
        name: name.trim(),
        slug: slug.trim(),
      });
      onClose();
    }
  };

  const handleNameChange = (value) => {
    setName(value);
    // Auto-generate slug from name
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">Edit Category</h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Category name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label
              htmlFor="category-slug"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Slug
            </label>
            <input
              id="category-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="category-slug"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || !slug.trim()}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
              !name.trim() || !slug.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
