import React, { useState, useEffect } from "react";
import Question from "../detailPage/Question.jsx";
import { useApi } from "../../api/apiClient.js";

export default function QuestionsPanel({ id }) {
  const fetchedRef = React.useRef(false);
  const [campaignData, setCampaignData] = useState([]);
  const [answersDrafts, setAnswersDrafts] = useState({});
  const api = useApi();

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

  const handleAnswerSubmit = async (e, qid) => {
    e.preventDefault();
    const text = (answersDrafts[qid] || "").trim();
    if (!text) return;

    try {
      const result = await api(`/projects/${id}/comments`, {
        method: "POST",
        body: { content: text, parentCommentId: qid },
      });

      const created = result?.payload ?? result;

      setAnswersDrafts((prev) => ({ ...prev, [qid]: "" }));

      setCampaignData((prev) =>
        prev.map((q) => {
          if (q._id === qid) {
            const answers = Array.isArray(q.answers)
              ? [...q.answers, created]
              : [created];
            return { ...q, answers };
          }
          return q;
        })
      );

      console.log("Posted answer:", result);
    } catch (err) {
      console.error("Error posting answer (saved locally):", err);
      setAnswersDrafts((prev) => ({ ...prev, [qid]: text }));
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Answer Questions</h2>
        <div className="mt-6 border-t pt-4">
          {campaignData.map((question) => {
            const qid = question._id;
            return (
              <div key={qid} className="mb-6">
                <Question
                  content={question.content}
                  author={question.author?.name ?? "anonymous"}
                  date={question.creationDate}
                />
                {Array.isArray(question.answers) &&
                  question.answers.length > 0 && (
                    <div className="ml-6 mt-2 space-y-2">
                      {question.answers.map((a, i) => (
                        <div key={i} className="text-sm text-gray-700">
                          <div className="font-medium">
                            {a.author?.name ?? "Anonymous"}
                          </div>
                          <div>{a.content}</div>
                        </div>
                      ))}
                    </div>
                  )}

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
