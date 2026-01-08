import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../api/apiClient.js";
import ProjectUpdateForm from "../components/adminPanel/ProjectUpdateForm.jsx";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api(`/projects/${id}`, { method: "GET" });
        setProject(data);
      } catch (err) {
        console.error("Failed to load project:", err);
        setError(err?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProject();
  }, [api, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Project
          </h1>

          <ProjectUpdateForm
            projectId={id}
            initialValues={project}
            onSuccess={() => navigate(`/detail/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
