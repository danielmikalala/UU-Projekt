import React, { useState, useEffect } from "react";
import { useApi } from "../../api/apiClient.js";
import Question from "./Question.jsx";
import Answer from "./Answer.jsx";

const MAX_QUESTION_LENGTH = 500;

export default function QandA({ id }) {
  const api = useApi();
  const [items, setItems] = useState([]);
  const [comment, setComment] = useState("");

  const fetchAndBuild = async () => {
    const res = await api(`/projects/${id}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const payload = Array.isArray(res) ? res : (res?.payload ?? []);
    const list = (Array.isArray(payload) ? payload : []).filter(Boolean);

    const map = Object.create(null);
    list.forEach((it) => {
      const key = String(it._id ?? it.id ?? "");
      if (!key) return;
      map[key] = { ...it, answers: [] };
    });
    list.forEach((it) => {
      const pid = it.parentCommentId;
      if (pid && map[String(pid)]) map[String(pid)].answers.push(it);
    });
    const roots = Object.values(map).filter(
      (it) => !it.parentCommentId || !map[String(it.parentCommentId)]
    );
    setItems(roots);
  };

  useEffect(() => {
    if (id) fetchAndBuild();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = comment.trim();
    if (!text) return;
    try {
      const res = await api(`/projects/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const created = res?.payload ?? res ?? null;
      setComment("");
      if (!created) {
        await fetchAndBuild();
        return;
      }
      if (created.parentCommentId) {
        setItems((prev) =>
          prev.map((q) =>
            String(q._id ?? q.id) === String(created.parentCommentId)
              ? { ...q, answers: [...(q.answers || []), created] }
              : q
          )
        );
      } else {
        setItems((prev) => [...prev, { ...created, answers: [] }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>💬</span> Questions & Answers
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          placeholder="Ask a question..."
          className="w-full border rounded-lg p-3 h-20"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value.slice(0, MAX_QUESTION_LENGTH))
          }
          maxLength={MAX_QUESTION_LENGTH}
        />
        <div className="flex items-center justify-between mt-2">
          <small className="text-sm text-gray-500">
            {comment.length}/{MAX_QUESTION_LENGTH}
          </small>
          <button
            type="submit"
            disabled={!comment.trim()}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            Post Question
          </button>
        </div>
      </form>

      <div className="mt-6 border-t pt-4">
        {items.map((q, i) => (
          <div key={q._id ?? q.id ?? i} className="mb-6">
            <Question
              content={q.content}
              author={q.author?.email ?? q.author?.name ?? "anonymous"}
              date={q.creationDate}
            />
            {Array.isArray(q.answers) && q.answers.length > 0 && (
              <div className="ml-6 mt-2 space-y-2">
                {q.answers.map((a, idx) => (
                  <Answer
                    key={a._id ?? a.id ?? idx}
                    content={a.content}
                    author={a.author?.email ?? a.author?.name ?? "anonymous"}
                    date={a.creationDate}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
