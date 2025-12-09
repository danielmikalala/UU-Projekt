import React from "react";
import AdminPanelPage from "../components/adminPanel/AdminPanelPage.jsx";
import ProjectApprovalPanel from "../components/adminPanel/ProjectApprovalPanel.jsx";

export default function AdminPage() {

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {/* tvoje původní admin UI */}
      <AdminPanelPage />
    </div>
  );
}
