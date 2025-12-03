import React from "react";

export default function QandA() {
  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>💬</span> Questions & Answers
      </h2>

      <div className="mb-4">
        <textarea
          placeholder="Ask a question..."
          className="w-full border rounded-lg p-3 h-20 focus:outline-none focus:ring focus:ring-purple-300"
        ></textarea>
      </div>

      <button className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition">
        Post Question
      </button>

      <div className="mt-6 border-t pt-4">
        <div className="mb-4">
          <p className="font-semibold">Eva</p>
          <p className="text-sm text-gray-500">22/10/2025</p>
          <p className="mt-1">A proc ne redbull?</p>
        </div>
      </div>
    </div>
  );
}
