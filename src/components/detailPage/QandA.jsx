import React, { useState, useEffect } from "react";
import { useApi } from "../../api/apiClient.js";
import Question from "./Question.jsx";
import Answer from "./Answer.jsx";

export default function QandA({ id }) {
  const api = useApi();
  const fetchedRef = React.useRef(false);
  const [campaignData, setCampaignData] = useState([]);
  const [comment, setComment] = useState("");

  const fetchQandAData = async () => {
    if (fetchedRef.current) return campaignData;
    fetchedRef.current = true;
    const res = await api(`/projects/${id}/comments`, {
      method: "GET",
    });
    console.log(res);
    return await res;
  };
    useEffect(() => {
      fetchQandAData().then((data) => {
        setCampaignData(Array.isArray(data) ? data.filter(Boolean) : []);
      });
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const result = await api(`/projects/${id}/comments`, {
        method: "POST",
        body: { content: comment.trim() },
      });
      const created = result?.payload ?? result ?? null;
      console.log(created);
      setComment("");

      if (created) {
        setCampaignData((prev) =>
          Array.isArray(prev) ? [...prev, created] : [created]
        );
      } else {
        fetchedRef.current = false;
        const refreshed = await fetchQandAData();
        setCampaignData(Array.isArray(refreshed) ? refreshed : []);
      }

      console.log("Backend response (normalized):", created);
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
        {campaignData.filter(Boolean).map((question, index) => (
          <div key={index}>
            <Question
              content={question.content}
              author={question.author?.name ?? "anonymous"}
              date={question.creationDate}
            />

            {/* only show Answer(s) when they exist */}
            {Array.isArray(question.answers) && question.answers.length > 0 && (
              <div className="mt-4 space-y-3">
                {question.answers.map((a, i) => (
                  <Answer
                    key={a._id ?? i}
                    content={a.content}
                    author={a.author?.name ?? a.author?.email ?? "anonymous"}
                    date={a.creationDate ?? a.date}
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
