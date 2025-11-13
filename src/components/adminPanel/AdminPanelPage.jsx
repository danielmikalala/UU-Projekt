import React from "react";
import GoBackButton from "../buttons/GoBackButton.jsx";
import AdminPanelList from "./AdminPanelList.jsx";

export default function AdminPanelPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <GoBackButton />
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage campaigns, categories, and users from one place.
          </p>
        </div>
      </header>
      <AdminPanelList />
    </div>
  );
}
