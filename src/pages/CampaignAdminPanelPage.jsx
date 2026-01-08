import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBackButton from "../components/buttons/GoBackButton.jsx";
import CreateCampaignUpdatePostForm from "../components/forms/CreateCampaignUpdatePostForm.jsx";
import ProjectUpdateForm from "../components/adminPanel/ProjectUpdateForm.jsx";
import QuestionsPanel from "../components/managedCampains/QuestionsPanel.jsx";
import PostLog from "../components/detailPage/PostLog.jsx";


const TABS = [
  { id: "edit", label: "Edit details" },
  { id: "update", label: "Post Update" },
  { id: "qa", label: "Questions" },
];

export default function CampaignAdminPanelPage() {
  const [activeTab, setActiveTab] = useState("edit");
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(false);
  const [projectError, setProjectError] = useState("");

  const [postsReloadKey, setPostsReloadKey] = useState(0);

  useEffect(() => {
    if (activeTab !== "edit") return;

    let cancelled = false;

    async function loadProject() {
      setLoadingProject(true);
      setProjectError("");

      try {
        const res = await fetch(`/projects/${id}`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to load project (${res.status})`);
        }

        const data = await res.json();

        if (!cancelled) {
          setProject(data);
        }
      } catch (e) {
        if (!cancelled) {
          setProject(null);
          setProjectError(e?.message || "Failed to load project");
        }
      } finally {
        if (!cancelled) {
          setLoadingProject(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [id, activeTab]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <GoBackButton />
      <h3 className="text-2xl font-semibold mr-6">Manage Campaign {id}</h3>

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

      {activeTab === "edit" && (
        <section className="mt-8 space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Campaign Details
            </h2>

            {loadingProject && (
              <p className="text-sm text-gray-600">Loading project…</p>
            )}

            {projectError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
                {projectError}
              </div>
            )}

            {!loadingProject && project && (
              <ProjectUpdateForm projectId={id} initialValues={project} />
            )}
          </div>
        </section>
      )}

      {activeTab === "update" && (
            <section className="mt-8 space-y-6">
              <CreateCampaignUpdatePostForm
                  id={id}
                  onSuccess={() => setPostsReloadKey((k) => k + 1)}
              />

              <PostLog id={id} reloadKey={postsReloadKey} />
            </section>
        )}

      {activeTab === "qa" && (
        <section className="mt-8 space-y-6">
          <QuestionsPanel id={id} />
        </section>
      )}
    </div>
  );
}
