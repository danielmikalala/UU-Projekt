import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import { GearIcon, CollectionIcon, PlusIcon, LogoutIcon } from "./buttons/icons";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="top-0 left-0 right-0 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-auto items-center justify-between px-3 py-3">
        <div className="text-xl font-extrabold">
          <Link to="/home" className="text-gray-900 no-underline">CrowdFund</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 mr-1">{user?.name || user?.email || "User"}</span>

          <Link to="/admin" className="no-underline">
            <PrimaryButton icon={<GearIcon />}>Admin</PrimaryButton>
          </Link>

          <Link to="/managed" className="no-underline">
            <PrimaryButton icon={<CollectionIcon />}>My Campaigns</PrimaryButton>
          </Link>

          <Link to="/admin" className="no-underline">
            <PrimaryButton icon={<PlusIcon />}>Create</PrimaryButton>
          </Link>

          <PrimaryButton onClick={handleLogout} aria-label="Logout" icon={<LogoutIcon />}>
            Logout
          </PrimaryButton>
        </div>
      </div>
    </nav>
  );
}
