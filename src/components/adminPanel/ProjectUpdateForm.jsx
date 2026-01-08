import React, { useEffect, useState } from "react";
import { useApi } from "../../api/apiClient.js";

const STATUS_OPTIONS = ["PendingApproval", "Approved", "Rejected", "Closed"];

function toDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function toIsoOrEmpty(datetimeLocalValue) {
  if (!datetimeLocalValue) return "";
  return new Date(datetimeLocalValue).toISOString();
}

export default function ProjectUpdateForm({
  projectId,
  initialValues,
  onSuccess,
}) {
  const api = useApi();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    goalAmount: "",
    deadLine: "",
    status: "PendingApproval",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Load categories from backend ONCE
  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await api("/categories", { method: "GET" });

        if (!mounted) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);

        if (!mounted) return;
        setCategories([]);
      } finally {
        if (mounted) setCategoriesLoading(false);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []); // ✅ IMPORTANT: [] to prevent infinite loop

  // ✅ init form with project data
  useEffect(() => {
    if (!initialValues) return;

    setForm({
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      category: initialValues?.category ?? "", // string (name)
      goalAmount: initialValues?.goalAmount ?? "",
      deadLine: toDatetimeLocal(initialValues?.deadLine),
      status: initialValues?.status ?? "PendingApproval",
    });
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    const goalAmountNumber = Number(form.goalAmount);

    if (!form.name.trim()) {
      setError("Name is required.");
      setSaving(false);
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      setSaving(false);
      return;
    }

    if (isNaN(goalAmountNumber) || goalAmountNumber < 0) {
      setError("Goal amount must be a number >= 0.");
      setSaving(false);
      return;
    }

    if (form.status && !STATUS_OPTIONS.includes(form.status)) {
      setError(`Unsupported status. Allowed: ${STATUS_OPTIONS.join(", ")}`);
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      goalAmount: goalAmountNumber,
      deadLine: toIsoOrEmpty(form.deadLine),
      category: form.category || undefined,
      status: form.status,
    };

    try {
      // ✅ Swagger says POST /projects/{projectId}
      await api(`/projects/${projectId}`, {
        method: "POST",
        body: payload,
      });

      setSuccess("Saved successfully ✅");

      if (onSuccess) {
        setTimeout(() => onSuccess(), 500);
      }
    } catch (err) {
      console.error("Update failed:", err);

      if (err?.status === 401) {
        setError("Unauthorized (401). Please login again.");
      } else {
        setError(err?.message || "Failed to update project.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 whitespace-pre-wrap">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
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
          required
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category (optional)
        </label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={categoriesLoading}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100"
        >
          <option value="">-- none --</option>

          {categories.map((cat) => (
            <option key={cat._id || cat.id || cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {categoriesLoading && (
          <p className="text-xs text-gray-500 mt-1">Loading categories...</p>
        )}

        {!categoriesLoading && categories.length === 0 && (
          <p className="text-xs text-red-600 mt-1">
            No categories loaded. Check backend /categories.
          </p>
        )}
      </div>

      {/* Goal Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Goal Amount
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

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <input
          type="datetime-local"
          name="deadLine"
          value={form.deadLine}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

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
