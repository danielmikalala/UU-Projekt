import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ConfirmDeleteModal from "../adminPanel/ConfirmDeleteModal.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

export default function CampaignRemoveBtn({ campaignId, campaignName }) {
  const {token} = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    try {          
      setLoading(true);
        await fetch(`/projects/${campaignId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        navigate(`/home`);
    } catch (e) {
      alert(e.message || "Failed to delete campaign");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className="
          flex items-center gap-2
          rounded-lg bg-red-600 px-4 py-2
          text-white
          hover:bg-red-700
          transition
          disabled:opacity-50
        "
      >
        <Trash2 className="h-5 w-5" />
        <span>Delete Campaign</span>
      </button>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={campaignName || campaignId}
      />
    </>
  );
}
