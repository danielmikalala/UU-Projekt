import React from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import DetailPageHeader from "../components/detailPage/detailPageHeader.jsx";
import AboutPanel from "../components/detailPage/AboutPanel.jsx";
import QandA from "../components/detailPage/QandA.jsx";
import ProgressBar from "../components/detailPage/ProgressBar.jsx";
export default function DetailPage() {
  return (
    <div className="min-h-screen py-10 space-y-8">
      <GoBackButton />
      <DetailPageHeader />
      <ProgressBar />
      <AboutPanel />
      <QandA />
    </div>
  );
}
