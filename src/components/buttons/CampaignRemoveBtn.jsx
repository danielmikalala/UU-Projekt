import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../../api/apiClient";
import ConfirmDeleteModal from "../adminPanel/ConfirmDeleteModal.jsx";

export default function CampaignRemoveBtn({ campaignId, campaignName }) {
  const api = useApi();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    try {          
      setLoading(true);
      await api(`/projects/${campaignId}`, {
        method: "DELETE",
      });
      navigate("/my-campaigns");
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
