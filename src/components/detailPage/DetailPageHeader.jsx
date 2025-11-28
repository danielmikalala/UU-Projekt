import GoBackButton from "../buttons/GoBackButton.jsx";
import { useParams } from "react-router-dom";

export default function DetailPageHeader() {
  const { id } = useParams();
  return (
    <div className="w-full max-w-6xl mx-auto  py-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detail of {id}</h1>
          <p className="mt-1 text-sm text-gray-500">kategorie kampaně</p>
        </div>
      </header>
    </div>
  );
}
