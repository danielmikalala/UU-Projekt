import React, { useState, useEffect } from "react";
import { useApi } from "../../api/apiClient.js";
import Question from "./Question.jsx";
import Answer from "./Answer.jsx"; // use your Answers component

export default function QandA({ id }) {
  const api = useApi();
  const fetchedRef = React.useRef(false);
  const [campaignData, setCampaignData] = useState([]);
  const [comment, setComment] = useState("");

  const fetchQandAData = async () => {
    if (fetchedRef.current) return campaignData;
    fetchedRef.current = true;
    const res = await api(`/projects/${id}/comments`, { method: "GET" });
    const payload = Array.isArray(res) ? res : (res?.payload ?? []);
    const list = Array.isArray(payload) ? payload.filter(Boolean) : [];

    // build map and attach children by parentCommentId
    const byId = new Map();
    list.forEach((item) => {
      const key = item._id ?? item.id;
      if (!key) return;
      byId.set(key, { ...item, answers: [] });
    });
    // attach children
    byId.forEach((item) => {
      const pid = item.parentCommentId;
      if (pid && byId.has(pid)) {
        byId.get(pid).answers.push(item);
      }
    });
    // collect roots (comments without parent or where parent missing)
    const roots = [];
    byId.forEach((item) => {
      if (!item.parentCommentId || !byId.has(item.parentCommentId))
        roots.push(item);
    });

    return roots;
  };

  useEffect(() => {
    fetchedRef.current = false;
    fetchQandAData().then((data) => {
      setCampaignData(Array.isArray(data) ? data : []);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const result = await api(`/projects/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment.trim() }),
      });

      const created = result?.payload ?? result ?? null;
      setComment("");

      if (created) {
        // if created is an answer, attach to its parent in-place so Answers renders immediately
        if (created.parentCommentId) {
          setCampaignData((prev) =>
            prev.map((q) => {
              if ((q._id ?? q.id) === created.parentCommentId) {
                const answers = Array.isArray(q.answers)
                  ? [...q.answers, created]
                  : [created];
                return { ...q, answers };
              }
              return q;
            })
          );
        } else {
          // new root question -> add as a root (ensure answers array exists)
          setCampaignData((prev) => [...prev, { ...created, answers: [] }]);
        }
      } else {
        // backend returned null -> fallback refresh to keep tree consistent
        fetchedRef.current = false;
        const refreshed = await fetchQandAData();
        setCampaignData(Array.isArray(refreshed) ? refreshed : []);
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>💬</span> Questions & Answers
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            placeholder="Ask a question..."
            className="w-full border rounded-lg p-3 h-20 focus:outline-none focus:ring focus:ring-purple-300"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Post Question
        </button>
      </form>

      <div className="mt-6 border-t pt-4">
        {campaignData.map((question, index) => (
          <div key={question._id ?? index} className="mb-6">
            <Question
              content={question.content}
              author={question.author?.name ?? "anonymous"}
              date={question.creationDate}
            />
            <div className="ml-6 mt-2 space-y-2">
              {Array.isArray(question.answers) &&
                question.answers.length > 0 &&
                question.answers.map((a, i) => (
                  <Answer
                    key={a._id ?? a.id ?? i}
                    content={a.content}
                    author={a.author?.name ?? "anonymous"}
                    date={a.creationDate}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
