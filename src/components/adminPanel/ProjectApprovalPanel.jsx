import React, { useState } from "react";

/**
 * ProjectApprovalPanel
 *
 * Režimy:
 * - TEĎ (mock):  <ProjectApprovalPanel project={mockProject} />
 *   → jen mění lokální state, loguje do konzole a ukazuje hlášku
 *
 * - POZDĚJI (backend): <ProjectApprovalPanel projectId={id} apiBaseUrl="/api" />
 *   → zavolá API (PATCH /projects/:id/status) s { status: "Approved" | "Rejected" }
 */
export default function ProjectApprovalPanel({
                                                 project,
                                                 projectId,
                                                 apiBaseUrl = "/api",
                                             }) {
    const initialStatus = project?.status || "PendingApproval";

    const [status, setStatus] = useState(initialStatus);
    const [working, setWorking] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const isPending = status === "PendingApproval";

    if (!project && !projectId) {
        return (
            <p style={{ padding: 16, color: "#991b1b" }}>
                Chybí data projektu (ani <code>project</code>, ani <code>projectId</code>).
            </p>
        );
    }

    async function handleChangeStatus(newStatus) {
        const label =
            newStatus === "Approved"
                ? "schválit"
                : newStatus === "Rejected"
                    ? "zamítnout"
                    : "změnit";

        const confirmText =
            newStatus === "Approved"
                ? "Opravdu chceš projekt schválit?"
                : "Opravdu chceš projekt zamítnout?";

        if (!window.confirm(confirmText)) return;

        setWorking(true);
        setSuccess("");
        setError("");

        const id = project?._id ?? projectId;
        const payload = { projectId: id, status: newStatus };

        // MOCK režim – zatím nemáme backend
        if (!projectId) {
            console.log("PROJECT APPROVAL (mock, bez backendu):", payload);
            setStatus(newStatus);
            setSuccess(
                newStatus === "Approved"
                    ? "Projekt byl (mock) schválen."
                    : "Projekt byl (mock) zamítnut."
            );
            setWorking(false);
            return;
        }

        // BACKEND režim – až bude API připravené
        try {
            const res = await fetch(`${apiBaseUrl}/projects/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Nepodařilo se změnit status projektu.");

            setStatus(newStatus);
            setSuccess(
                newStatus === "Approved"
                    ? "Projekt byl schválen."
                    : "Projekt byl zamítnut."
            );
        } catch (e) {
            setError(e?.message || "Chyba při změně statusu projektu.");
        } finally {
            setWorking(false);
        }
    }

    return (
        <div
            style={{
                maxWidth: 800,
                margin: "16px auto",
                padding: 16,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#F9FAFB",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                }}
            >
                <div>
                    <div style={{ fontSize: 14, color: "#6b7280" }}>Aktuální status</div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{status}</div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        type="button"
                        disabled={!isPending || working}
                        onClick={() => handleChangeStatus("Approved")}
                        style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: !isPending || working ? "#9ca3af" : "#16a34a",
                            color: "#fff",
                            fontWeight: 600,
                            cursor: !isPending || working ? "default" : "pointer",
                        }}
                    >
                        Schválit
                    </button>
                    <button
                        type="button"
                        disabled={!isPending || working}
                        onClick={() => handleChangeStatus("Rejected")}
                        style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: !isPending || working ? "#9ca3af" : "#dc2626",
                            color: "#fff",
                            fontWeight: 600,
                            cursor: !isPending || working ? "default" : "pointer",
                        }}
                    >
                        Zamítnout
                    </button>
                </div>
            </div>

            {success && (
                <div
                    style={{
                        marginTop: 8,
                        padding: 8,
                        borderRadius: 8,
                        background: "#dcfce7",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                        fontSize: 13,
                    }}
                >
                    {success}
                </div>
            )}

            {error && (
                <div
                    style={{
                        marginTop: 8,
                        padding: 8,
                        borderRadius: 8,
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                        fontSize: 13,
                    }}
                >
                    {error}
                </div>
            )}

            {isPending ? (
                <p style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                    Projekt je ve stavu <strong>PendingApproval</strong>. Můžeš ho
                    schválit nebo zamítnout.
                </p>
            ) : (
                <p style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                    Projekt už není v&nbsp;PendingApproval, změnu statusu můžeš
                    případně udělat v editaci projektu.
                </p>
            )}
        </div>
    );
}
