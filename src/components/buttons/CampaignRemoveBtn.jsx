import { Trash2 } from "lucide-react";

export default function CampaignRemoveButton({ campaignId }) {

    const handleDelete = () => {
        // TODO: implement deletion logic
    }
    return (
        <button
            onClick={handleDelete}
            className="
        flex items-center gap-2
        rounded-lg bg-red-600 px-4 py-2
        text-white
        hover:bg-red-700
        transition
      "
        >
            <Trash2 className="w-5 h-5" />
            <span>Delete Campaign</span>
        </button>
    );
}