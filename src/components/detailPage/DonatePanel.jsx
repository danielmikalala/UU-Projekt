import React, { useState } from "react";
import ProgressBar from "../ProgressBar.jsx";

export default function DonatePanel({ goal, currentState }) {
  const [amount, setAmount] = useState("");
  const handleNewTransaction = () => {};

  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm space-y-4">
      <ProgressBar goal={goal} status={currentState} />

      <form className="flex gap-3" onSubmit={handleNewTransaction}>
        <input
          type="number"
          className="flex-1 border rounded-lg p-2"
          placeholder="Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Donate
        </button>
      </form>
    </div>
  );
}
