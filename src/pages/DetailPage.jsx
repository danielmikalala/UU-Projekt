import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import DetailPageHeader from "../components/detailPage/DetailPageHeader.jsx";
import AboutPanel from "../components/detailPage/AboutPanel.jsx";
import QandA from "../components/detailPage/QandA.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DonatePanel from "../components/detailPage/DonatePanel.jsx";
import PostLog from "../components/detailPage/PostLog.jsx";

export default function DetailPage() {
    const { token } = useAuth();
    const { id } = useParams();

    const [detailData, setDetailData] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    const fetchDetailData = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`/projects/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Failed to load project (${res.status})`);
            }

            const data = await res.json();
            setDetailData(data);
        } catch (e) {
            setError(e?.message || "Failed to load detail.");
            setDetailData({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id || !token) return;
        fetchDetailData();
    }, [id, token]);

    const goal = detailData?.goalAmount ?? 0;
    const current = detailData?.currentAmount ?? 0;

    return (
        <div className="min-h-screen py-10 space-y-8">
            <GoBackButton />

            {error && (
                <div className="max-w-6xl mx-auto border rounded-xl p-4 bg-white">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {!loading && (
                <DonatePanel
                    projectId={id}
                    token={token}
                    goal={goal}
                    currentState={current}
                    onDonated={(createdDonation, value) => {
                        const added =
                            Number(createdDonation?.amount) ||
                            Number(value) ||
                            0;

                        setDetailData((prev) => ({
                            ...prev,
                            currentAmount: (prev?.currentAmount || 0) + added,
                        }));
                    }}

                />
            )}

            <DetailPageHeader
                name={detailData?.name}
                category={detailData?.categoryName ?? "Category not found"}
            />

            <AboutPanel content={detailData?.description} />

            <PostLog id={id} />

            <QandA id={id} />
        </div>
    );
    //todo: update when category implemented on be
}
