import React from "react";
import AdminPanelPage from "../components/adminPanel/AdminPanelPage.jsx";
import ProjectApprovalPanel from "../components/adminPanel/ProjectApprovalPanel.jsx";

export default function AdminPage() {
    // MOCK projekt – dokud neběží backend
    const mockProject = {
        _id: "admin-demo-id-001",
        name: "Ukázkový projekt",
        description: "Toto je testovací projekt v adminu, backend zatím neběží.",
        ownerId: "owner-123",
        creationDate: "2025-11-05T15:02:40.949Z",
        lastUpdatedDate: "2025-11-05T15:02:40.949Z",
        goalAmount: 50,
        deadLine: "2025-11-05T14:51:54.670Z",
        status: "PendingApproval",
    };

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            {/* tvoje původní admin UI */}
            <AdminPanelPage />
        </div>
    );
}
