import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import DetailPageHeader from "../components/detailPage/detailPageHeader.jsx";
import AboutPanel from "../components/detailPage/AboutPanel.jsx";
import QandA from "../components/detailPage/QandA.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import DonatePanel from "../components/detailPage/DonatePanel.jsx";

export default function DetailPage() {
    const {token} = useAuth();
    const {id} = useParams();
    const fetchDetailData = async () => {
        console.log(id)
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
            console.log(data)
        });

    }, [id]);
    //todo: change to actual goal state
    return (
        <div className="min-h-screen py-10 space-y-8">
            <GoBackButton/>
            <DonatePanel goal={detailData.goalAmount} currentState={detailData.goalAmount / 2}/>
            <DetailPageHeader/>
            <AboutPanel/>
            <QandA/>
        </div>
    );

}
