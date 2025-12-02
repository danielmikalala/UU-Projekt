import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import DetailPageHeader from "../components/detailPage/detailPageHeader.jsx";
import AboutPanel from "../components/detailPage/AboutPanel.jsx";
import QandA from "../components/detailPage/QandA.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import DonatePanel from "../components/detailPage/DonatePanel.jsx";
import PostLog from "../components/detailPage/PostLog.jsx";

export default function DetailPage() {
    const fetchedRef = React.useRef(false);
    const {token} = useAuth();
    const {id} = useParams();
    const fetchDetailData = async () => {
        if (fetchedRef.current) return detailData;
        fetchedRef.current = true;
        const res = await fetch(`/projects/${id}`, {
            method: "GET",
            headers: {"Content-Type": "application/json", 'Authorization': `Bearer ${token}`},
        });
        return await res.json();
    }

    const [detailData, setDetailData] = React.useState({});
    useEffect(() => {
        fetchDetailData().then(data => {
            setDetailData(data);
        });

    }, [id]);

    return (
        <div className="min-h-screen py-10 space-y-8">
            <GoBackButton/>
            <DonatePanel goal={detailData.goalAmount} currentState={detailData.goalAmount / 2}/>
            <DetailPageHeader name={detailData.name} category={/*detailData.category*/ "<category>"} />
            <AboutPanel content={detailData.description} />
            <PostLog id={id}/>
            <QandA/>
        </div>
    );
    //todo: change to actual goal state
    //todo: update when category implemented on be
}
