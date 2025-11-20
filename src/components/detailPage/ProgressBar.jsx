import React, { useEffect, useState } from "react";

export default function ProgressBar() {
  const goal = 50;
  const [amountRaised, setAmountRaised] = useState(0);
  const [donations, setDonations] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const percent = Math.min((amountRaised / goal) * 100, 100);

  const handleDonate = () => {
    const value = Number(inputValue);
    if (!value || value <= 0) return alert("Please enter a valid donation amount.");
    setAmountRaised((prev) => prev + value);
    setDonations((prev) => prev + 1);
    setInputValue("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm">
      <div className="w-full h-3 bg-gray-200 rounded-full mb-3">
        <div
          className="h-full bg-purple-600 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm font-semibold mb-1">
        <span>${amountRaised}</span>
        <span>${goal}</span>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        {percent.toFixed(1)}% funded • {donations} donations
      </p>

      <div className="flex gap-3">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Amount ($)"
          className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring focus:ring-purple-300"
        />

        <button
          onClick={handleDonate}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Donate
        </button>
      </div>
    </div>
  );
}
