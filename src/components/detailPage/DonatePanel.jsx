import React, { useState } from "react";
import ProgressBar from "../ProgressBar.jsx";

export default function DonatePanel({
  goal,
  currentState,
  projectId,
  token,
  onDonated,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNewTransaction = async (e) => {
    e.preventDefault();
    setError("");

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Zadej kladnou částku.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId, amount: value }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const text = await res.text();
      const createdDonation = text ? JSON.parse(text) : null;

      setAmount("");
      onDonated?.(createdDonation, value);
    } catch (err) {
      setError(err?.message || "Nepodařilo se odeslat příspěvek.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm space-y-4">
      <ProgressBar goal={goal} status={currentState} />

      <form className="flex gap-3" onSubmit={handleNewTransaction}>
        <input
          type="number"
          min="1"
          step="1"
          className="flex-1 border rounded-lg p-2"
          placeholder="Amount (USD)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Sending..." : "Donate"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
