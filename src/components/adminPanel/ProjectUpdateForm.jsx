import React, { useEffect, useState } from "react";

const CATEGORY_OPTIONS = ["Health", "Education", "Emergency", "Other"];

function toDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function toIsoOrEmpty(datetimeLocalValue) {
  if (!datetimeLocalValue) return "";
  return new Date(datetimeLocalValue).toISOString();
}

export default function ProjectUpdateForm({ projectId, initialValues }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Health",
    goalAmount: 0,
    deadLine: "",
  });

  // ✅ když se načte project z GET, naplníme form
  useEffect(() => {
    setForm({
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      category: initialValues?.category ?? "Health",
      goalAmount: initialValues?.goalAmount ?? 0,
      deadLine: toDatetimeLocal(initialValues?.deadLine),
    });
  }, [initialValues]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      goalAmount: form.goalAmount,
      deadLine: toIsoOrEmpty(form.deadLine),
      category: form.category,
    };

    try {
      const res = await fetch(`/projects/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        let details = "";

        if (contentType.includes("application/json")) {
          const json = await res.json().catch(() => null);
          details = json ? JSON.stringify(json, null, 2) : "";
        } else {
          details = await res.text().catch(() => "");
        }

        throw new Error(details || `Failed to update (${res.status})`);
      }

      setSuccess("Saved successfully ✅");
    } catch (err) {
      setError(err?.message || "Failed to update");
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

        {/* Title -> name */}
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
            Funding Goal
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
