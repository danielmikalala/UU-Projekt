import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useApi } from "../../api/apiClient.js";

export default function ProjectApprovalPanel({ project, onStatusChanged }) {
  const api = useApi();
  const initialStatus = project?.status || "PendingApproval";

  const [status, setStatus] = useState(initialStatus);
  const [working, setWorking] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    if (project?.status) {
      setStatus(project.status);
      setSuccess("");
      setError("");
    }
  }, [project?.status]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
        setPendingStatus(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const isPending = status === "PendingApproval";

  if (!project) {
    return <p className="p-4 text-red-800">Missing campaign data.</p>;
  }

  const handleButtonClick = (newStatus) => {
    setPendingStatus(newStatus);
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    handleChangeStatus(pendingStatus);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPendingStatus(null);
  };

  async function handleChangeStatus(newStatus) {

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
      let successMessage = "";
      if (newStatus === "Approved") {
        successMessage = "Campaign was approved successfully.";
      } else if (newStatus === "Rejected") {
        successMessage = "Campaign was rejected.";
      } else if (newStatus === "PendingApproval") {
        successMessage = "Campaign returned to pending.";
      }
      setSuccess(successMessage);

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
                : status === "PendingApproval"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {success}
          </div>
        ) : error ? (
          <div className="p-2 rounded bg-red-100 text-red-800 border border-red-200 text-xs whitespace-nowrap">
            {error}
          </div>
        ) : isPending ? (
          <>
            <button
              type="button"
              disabled={working}
              onClick={() => handleButtonClick("Approved")}
              className={`w-full px-3 py-1.5 rounded text-xs font-semibold text-white ${
                working
                  ? "bg-gray-400 cursor-default"
                  : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
              }`}
            >
              Approve
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() => handleButtonClick("Rejected")}
              className={`w-full px-3 py-1.5 rounded text-xs font-semibold text-white ${
                working
                  ? "bg-gray-400 cursor-default"
                  : "bg-red-600 hover:bg-red-700 cursor-pointer"
              }`}
            >
              Reject
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={working}
            onClick={() => handleButtonClick("PendingApproval")}
            className={`w-full px-3 py-1.5 rounded text-xs font-semibold text-white ${
              working
                ? "bg-gray-400 cursor-default"
                : "bg-gray-600 hover:bg-gray-700 cursor-pointer"
            }`}
          >
            Set to pending
          </button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleModalCancel}
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleModalCancel}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Confirm Action
            </h2>
            <p className="mb-6 text-gray-700">
              {pendingStatus === "Approved"
                ? "Are you sure you want to approve this campaign?"
                : pendingStatus === "Rejected"
                  ? "Are you sure you want to reject this campaign?"
                  : "Are you sure you want to return this campaign to pending?"}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleModalCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalConfirm}
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
                  pendingStatus === "Rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : pendingStatus === "Approved"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
