import React, { useState, useEffect } from "react";
import Question from "../detailPage/Question.jsx";
import { useApi } from "../../api/apiClient.js";

export default function QuestionsPanel({ id }) {
  const [comment, setComment] = useState("");
  const fetchedRef = React.useRef(false);
  const [campaignData, setCampaignData] = useState([]);
  const api = useApi();

  const fetchQandAData = async () => {
    if (fetchedRef.current) return campaignData;
    fetchedRef.current = true;
    const res = await api(`/projects/${id}/comments`, {
      method: "GET",
    });
    console.log("Fetched Q&A data:", res);
    return await res;
  };
  useEffect(() => {
    fetchQandAData().then((data) => {
      setCampaignData(data);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api(`/projects/${id}/comments`, {
        method: "POST",
        body: comment,
      });

      // clear input
      setComment("");

      // update local state with the created comment (if API returns it)
      setCampaignData((prev) =>
        Array.isArray(prev) ? [...prev, result] : [result]
      );

      console.log("Backend response:", result);
    } catch (error) {
      console.error("Error submitting question:", error);
      throw error;
    }
  };

  const handleAnswerSubmit = async (e, qid) => {
    e.preventDefault();
    const text = (answersDrafts[qid] || "").trim();
    if (!text) return;
    //TODO: implement answer submission
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
                    author={question.authorId}
                    date={question.creationDate}
                  />
                  {/* form for this specific question */}
                  <form
                    onSubmit={(e) => handleAnswerSubmit(e, qid)}
                    className="mt-3"
                  >
                    <textarea
                      className="w-full border rounded-lg p-3 h-24"
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

          <div>
            <label className="block font-medium mb-2">Your Question</label>
            <textarea
              className="w-full border rounded-lg p-3 h-40"
              value={comment}
              required
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your content here"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            Post Question
          </button>
      </div>
    </>
  );
}
