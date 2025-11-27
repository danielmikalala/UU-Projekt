import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

const DEFAULT_STATUS = "Draft";

export default function CampaignsModal({
  campaign,
  isOpen,
  onClose,
  onSave,
  statusOptions = [],
}) {
  const [formValues, setFormValues] = useState({
    name: "",
    status: DEFAULT_STATUS,
    description: "",
    goalAmount: "",
    currentAmount: "",
    createdAt: "",
  });

  useEffect(() => {
    if (campaign) {
      setFormValues({
        name: campaign.name || "",
        status: campaign.status || DEFAULT_STATUS,
        description: campaign.description || "",
        goalAmount: campaign.goalAmount?.toString() ?? "",
        currentAmount: campaign.currentAmount?.toString() ?? "",
        createdAt: campaign.createdAt || new Date().toISOString().split("T")[0],
      });
    }
  }, [campaign]);

  const canSave = useMemo(() => {
    const trimmedName = formValues.name.trim();
    const trimmedDescription = formValues.description.trim();
    const goal = Number(formValues.goalAmount);
    const current = Number(formValues.currentAmount);

    return (
      trimmedName &&
      trimmedDescription &&
      !Number.isNaN(goal) &&
      goal > 0 &&
      !Number.isNaN(current) &&
      current >= 0 &&
      formValues.createdAt
    );
  }, [formValues]);

  if (!isOpen || !campaign) return null;

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [field]:
        field.includes("Amount") && value
          ? value.replace(/[^\d.]/g, "")
          : value,
    }));
  };

  const handleSave = () => {
    if (!canSave) return;

    onSave({
      ...campaign,
      name: formValues.name.trim(),
      status: formValues.status,
      description: formValues.description.trim(),
      goalAmount: Number(formValues.goalAmount),
      currentAmount: Number(formValues.currentAmount),
      createdAt: formValues.createdAt,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Edit Campaign
        </h2>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Campaign Name
              </label>
              <input
                type="text"
                value={formValues.name}
                onChange={handleChange("name")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formValues.status}
                onChange={handleChange("status")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                {(statusOptions.length ? statusOptions : [DEFAULT_STATUS]).map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={formValues.description}
              onChange={handleChange("description")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Goal Amount
              </label>
              <input
                type="number"
                min="1"
                value={formValues.goalAmount}
                onChange={handleChange("goalAmount")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Current Amount
              </label>
              <input
                type="number"
                min="0"
                value={formValues.currentAmount}
                onChange={handleChange("currentAmount")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Created At
              </label>
              <input
                type="date"
                value={formValues.createdAt}
                onChange={handleChange("createdAt")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
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
            disabled={!canSave}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
              !canSave
                ? "cursor-not-allowed bg-gray-400"
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

