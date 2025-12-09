// src/components/adminPanel/ProjectUpdateForm.jsx
import React, { useState } from "react";

const CATEGORY_OPTIONS = ["Health", "Education", "Emergency", "Other"];

export default function ProjectUpdateForm({ campaignId, initialValues }) {
  const [form, setForm] = useState({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    category: initialValues?.category ?? "Health",
    goalAmount: initialValues?.goalAmount ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "goalAmount" ? Number(value) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    const payload = {
      campaignId,
      title: form.title,
      description: form.description,
      category: form.category,
      goalAmount: form.goalAmount,
    };

    // MOCK – backend zatím neběží → jen log + hláška
    console.log("CAMPAIGN UPDATE (mock payload):", payload);

    setTimeout(() => {
      setSaving(false);
      setSuccess("Changes have been saved (mock, backend is not running yet).");
    }, 400);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="mb-2 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Funding Goal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Funding Goal ($)
        </label>
        <input
          type="number"
          min={0}
          name="goalAmount"
          value={form.goalAmount}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* SAVE BUTTON */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
