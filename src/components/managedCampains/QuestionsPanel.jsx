import React, { useState, useEffect, useRef } from "react";
import Question from "../detailPage/Question.jsx";
import Answer from "../detailPage/Answer.jsx";
import { useApi } from "../../api/apiClient.js";

export default function QuestionsPanel({ id }) {
  const fetchedRef = useRef(false);
  const [campaignData, setCampaignData] = useState([]);
  const [answersDrafts, setAnswersDrafts] = useState({});
  const api = useApi();

  const fetchQandAData = async () => {
    if (fetchedRef.current) return campaignData;
    fetchedRef.current = true;
    const res = await api(`/projects/${id}/comments`, { method: "GET" });
    const payload = Array.isArray(res) ? res : (res?.payload ?? []);
    const list = Array.isArray(payload) ? payload.filter(Boolean) : [];

    // nest answers under their parentCommentId so answers persist across navigation
    const byId = new Map();
    list.forEach((item) => {
      const idKey = item._id ?? item.id;
      if (!idKey) return;
      byId.set(idKey, { ...item, answers: [] });
    });

    // attach children to parents
    byId.forEach((item) => {
      const pid = item.parentCommentId;
      if (pid && byId.has(pid)) {
        byId.get(pid).answers.push(item);
      }
    });

    // roots = items without a parent or whose parent is missing
    const roots = [];
    byId.forEach((item) => {
      if (!item.parentCommentId || !byId.has(item.parentCommentId))
        roots.push(item);
    });

    return roots;
  };

  useEffect(() => {
    fetchedRef.current = false; // reset when id changes
    fetchQandAData().then((data) => {
      setCampaignData(Array.isArray(data) ? data : []);
    });
  }, [id]);

  const handleAnswerSubmit = async (e, qid) => {
    e.preventDefault();
    const text = (answersDrafts[qid] || "").trim();
    if (!text) return;

    try {
      const result = await api(`/projects/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, parentCommentId: qid }),
      });

      const created = result?.payload ?? result;
      if (!created) throw new Error("Empty create response");

      setAnswersDrafts((prev) => ({ ...prev, [qid]: "" }));

      setCampaignData((prev) =>
        prev.map((q) => {
          if ((q._id ?? q.id) === qid) {
            const answers = Array.isArray(q.answers)
              ? [...q.answers, created]
              : [created];
            return { ...q, answers };
          }
          return q;
        }),
      );

      console.log("Posted answer:", result);
    } catch (err) {
      console.error("Error posting answer (saved locally):", err);
      const local = {
        _id: `local-${Date.now()}`,
        content: text,
        author: { name: "You" },
        creationDate: new Date().toISOString(),
        _local: true,
        parentCommentId: qid,
      };

      setAnswersDrafts((prev) => ({ ...prev, [qid]: "" }));

      setCampaignData((prev) =>
        prev.map((q) => {
          if ((q._id ?? q.id) === qid) {
            const answers = Array.isArray(q.answers)
              ? [...q.answers, local]
              : [local];
            return { ...q, answers };
          }
          return q;
        }),
      );
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Answer Questions</h2>
        <div className="mt-6 border-t pt-4">
          {campaignData.filter(Boolean).map((question, index) => {
            const qid = question?._id ?? question?.id ?? `local-${index}`;
            return (
              <div key={qid} className="mb-6">
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

                <form
                  onSubmit={(e) => handleAnswerSubmit(e, qid)}
                  className="mt-3"
                >
                  <textarea
                    className="w-full border rounded-lg p-3 h-24"
                    value={answersDrafts[qid] || ""}
                    onChange={(e) =>
                      setAnswersDrafts((prev) => ({
                        ...prev,
                        [qid]: e.target.value,
                      }))
                    }
                    placeholder="Write your answer here"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
                    >
                      Post Answer
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAnswersDrafts((prev) => ({ ...prev, [qid]: "" }))
                      }
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
