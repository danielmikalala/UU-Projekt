import React, { useState } from "react";
import { useApi } from "../../api/apiClient.js";

export default function ProjectApprovalPanel({ project, onStatusChanged }) {
  const api = useApi();
  const initialStatus = project?.status || "PendingApproval";

  const [status, setStatus] = useState(initialStatus);
  const [working, setWorking] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const isPending = status === "PendingApproval";

  if (!project) {
    return <p className="p-4 text-red-800">Missing campaign data.</p>;
  }

  async function handleChangeStatus(newStatus) {
    const confirmText =
      newStatus === "Approved"
        ? "Are you sure you want to approve this campaign?"
        : "Are you sure you want to reject this campaign?";

    if (!window.confirm(confirmText)) return;

    setWorking(true);
    setSuccess("");
    setError("");

    const id = project?._id || project?.id;

    try {
      const updateData = {
        name: project.title,
        description: project.description,
        goalAmount: project.fundingGoal || 0,
        currentAmount: project.currentAmount || 0,
        deadLine: project.deadLine || new Date(),
        status: newStatus,
      };

      if (project.categoryId) {
        updateData.categoryId = project.categoryId;
      }

      await api(`/projects/${id}`, {
        method: "POST",
        body: updateData,
      });

      setStatus(newStatus);
      setSuccess(
        newStatus === "Approved"
          ? "Campaign was approved successfully."
          : "Campaign was rejected.",
      );

      if (onStatusChanged) {
        onStatusChanged();
      }
    } catch (err) {
      console.error("Error changing campaign status:", err);
      setError(err.message || "Failed to change campaign status.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto my-4 p-4 rounded-xl border border-gray-200 bg-gray-50 flex justify-between items-start">
      <div className="flex-1 mr-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 m-0 mb-1">
            {project?.title || "Campaign"}
          </h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              status === "PendingApproval"
                ? "bg-yellow-100 text-yellow-800"
                : status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {status === "PendingApproval" ? "Pending" : status}
          </span>
        </div>

        {project?.description && (
          <p className="text-sm text-gray-700 leading-relaxed m-0">
            {project.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-shrink-0 items-end">
        {success ? (
          <div
            className={`p-2 rounded text-xs whitespace-nowrap ${
              status === "Rejected"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {success}
          </div>
        ) : error ? (
          <div className="p-2 rounded bg-red-100 text-red-800 border border-red-200 text-xs whitespace-nowrap">
            {error}
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={!isPending || working}
              onClick={() => handleChangeStatus("Approved")}
              className={`px-3 py-1.5 rounded text-xs font-semibold text-white ${
                !isPending || working
                  ? "bg-gray-400 cursor-default"
                  : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
              }`}
            >
              Approve
            </button>
            {isPending && (
              <button
                type="button"
                disabled={working}
                onClick={() => handleChangeStatus("Rejected")}
                className={`px-3 py-1.5 rounded text-xs font-semibold text-white ${
                  working
                    ? "bg-gray-400 cursor-default"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                }`}
              >
                Reject
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
