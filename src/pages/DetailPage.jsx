import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import DetailPageHeader from "../components/detailPage/detailPageHeader.jsx";
import AboutPanel from "../components/detailPage/AboutPanel.jsx";
import QandA from "../components/detailPage/QandA.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

export default function DetailPage() {
    const {token} = useAuth();
    const {id} = useParams();
    const fetchDetailData = async () => {
        const res = await fetch(`/project/${id}`, {
            method: "GET",
            headers: {"Content-Type": "application/json", 'Authorization': `Bearer ${token}`},
        });

        return res.body;
    }
    const [detailData, setDetailData] = React.useState(fetchDetailData());
    useEffect(() => {
        setDetailData(fetchDetailData());
    }, [id]);
    return (
        <div className="min-h-screen py-10 space-y-8">
            <GoBackButton/>
            <ProgressBar goal={detailData.goalAmount} status={0}></ProgressBar>
            <DetailPageHeader/>
            <AboutPanel/>
            <QandA/>
        </div>
    );

}
