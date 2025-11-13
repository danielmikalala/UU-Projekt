import React from "react";
import { useNavigate } from "react-router-dom";
import { BackIcon } from "./icons";

export default function GoBackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/home")}
      aria-label="Back"
      className="inline-flex m-4 items-center gap-2 text-gray-800 hover:text-gray-900"
    >
      <BackIcon className="h-4 w-4" />
      <span className="text-sm font-semibold">Back to Home</span>
    </button>
  );
}
