import React, { useState, useEffect } from "react";
import { useApi } from "../../api/apiClient.js";
import Question from "./Question.jsx";

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
    return res;
  };
  useEffect(() => {
    // reset fetch guard when id changes so we load new data
    fetchedRef.current = false;
    fetchQandAData().then((data) => {
      setCampaignData(Array.isArray(data) ? data : []);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!comment.trim()) return;
    try {
      // backend expects { content: ... }
      const result = await api(`/projects/${id}/comments`, {
        method: "POST",
        body: { content: comment },
      });

      setComment("");

      setCampaignData((prev) =>
        Array.isArray(prev) ? [...prev, result] : [result]
      );

      console.log("Backend response:", result);
    } catch (error) {
      console.error("Error submitting question:", error);
      // don't re-throw to avoid uncaught promise in UI
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
          <Question
            key={index}
            content={question.content}
            author={question.authorId}
            date={question.creationDate}
          />
        ))}
      </div>
    </div>
  );
}
