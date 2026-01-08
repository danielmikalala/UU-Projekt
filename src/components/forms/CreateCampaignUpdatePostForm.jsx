import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CreateCampaignUpdatePostForm({ id, onSuccess }) {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      setSaving(false);
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/projects/${id}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: title.trim(),
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        let msg = "Failed to create update post.";
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch (e) {}
        throw new Error(msg);
      }

      setTitle("");
      setContent("");
      setSuccess("Update created successfully ✅");

      if (onSuccess) {
        setTimeout(() => onSuccess(), 300);
      }
    } catch (err) {
      console.error("Create post failed:", err);

      if (err?.status === 401) {
        setError("Unauthorized (401). Please login again.");
      } else {
        setError(err?.message || "Failed to create update post.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Create Update Post</h2>

        {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800">
              {success}
            </div>
        )}

        {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 whitespace-pre-wrap">
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Update Title</label>
            <input
                type="text"
                className="w-full border rounded-lg p-3"
                value={title}
                required
                disabled={saving}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter update title"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Content</label>
            <textarea
                className="w-full border rounded-lg p-3 h-40"
                value={content}
                required
                disabled={saving}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content here"
            ></textarea>
          </div>

          <button
              type="submit"
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white py-3 rounded-lg"
          >
            {saving ? "Posting..." : "Post Update"}
          </button>
        </form>
      </div>
  );
}
