import {Link, useNavigate, useLocation} from "react-router-dom";
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import {
    GearIcon,
    CollectionIcon,
    PlusIcon,
    LogoutIcon,
} from "./buttons/icons";
import {useAuth} from "../context/AuthContext.jsx";

export default function Navigation() {
    const {isAuthenticated, user, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname.startsWith("/auth")) return null;
    if (!isAuthenticated) return null;

    const handleLogout = () => {
        logout();
        navigate("/auth", {replace: true});
    };

    const handleCreateCampaign = () => {
        navigate("/create");
    };

    return (
        <nav className="top-0 left-0 right-0 w-full border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-auto px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-xl font-extrabold text-gray-900 flex justify-center items-center align-middle">
                        <Link to="/">
                            CrowdFund
                        </Link>
                    </div>

                    <div className="flex flex-col items-end gap-2 lg:flex-row lg:items-center lg:gap-3">
                        <div className="flex items-center gap-3">
                            <span className="mr-1 text-sm text-gray-500">
                                {user?.name || user?.email || "User"}
                            </span>
                            <PrimaryButton
                                onClick={handleLogout}
                                aria-label="Logout"
                                icon={<LogoutIcon/>}
                            />
                            {user?.role.toLowerCase() === "admin" && (
                                <Link to="/admin" className="no-underline">
                                    <PrimaryButton
                                        icon={<GearIcon/>}
                                        aria-label="Admin panel"
                                    />
                                </Link>
                            )}
                        </div>

                        <div className="flex w-full items-center gap-3 lg:w-auto lg:justify-end">
                            <Link
                                to="/managed"
                                className="no-underline flex-1 lg:flex-none"
                            >
                                <PrimaryButton
                                    icon={<CollectionIcon/>}
                                    aria-label="My campaigns"
                                    className="w-full lg:w-auto"
                                >
                                    Manage
                                </PrimaryButton>
                            </Link>
                            <PrimaryButton
                                onClick={handleCreateCampaign}
                                icon={<PlusIcon/>}
                                className="flex-1 w-full lg:w-auto lg:flex-none"
                            >
                                Create
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
