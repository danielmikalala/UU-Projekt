import React from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../ProgressBar.jsx";
import PrimaryButton from "../buttons/PrimaryButton.jsx";

export default function CampaignCard({
  title,
  description,
  goal,
  status,
  id,
  manageable,
}) {
  const navigate = useNavigate();

  const shortDescription =
    description.length > 70 ? description.slice(0, 70) + "..." : description;

  return (
    <div className="flex flex-col">
      <div
        className="p-4 m-2 rounded-2xl shadow flex flex-col gap-3 cursor-pointer hover:shadow-md transition bg-white"
        onClick={() => navigate(`/detail/${id}`)}
      >
        <h2 className="text-xl font-semibold">{title}</h2>

        <p className="text-sm text-gray-600 leading-snug">{shortDescription}</p>
        <ProgressBar status={status} goal={goal} />
      </div>
      {manageable && (
        <PrimaryButton
          className="m-2"
          onClick={() => {
            navigate(`/campaign-admin/${id}`);
          }}
        >
          Manage
        </PrimaryButton>
      )}
    </div>
  );
}
