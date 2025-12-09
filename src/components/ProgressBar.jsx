import React from "react";

export default function ProgressBar({ goal, status }) {
  const percentage = goal > 0 ? (status / goal) * 100 : 0;
  const formattedPercentage = percentage.toFixed(2) + "%";

  return (
    <>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-purple-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm font-medium mt-1">
        <span>${status}</span>
        <span>${goal}</span>
      </div>

      <p className="text-sm text-gray-700">{formattedPercentage} funded</p>
    </>
  );
}
