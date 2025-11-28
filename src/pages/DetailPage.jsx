import React from "react";
import { useParams } from "react-router-dom";
import GoBackButton from "../components/buttons/GoBackButton.jsx";
import DetailPageHeader from "../components/detailPage/detailPageHeader.jsx";
import AboutPanel from "../components/detailPage/AboutPanel.jsx";
import QandA from "../components/detailPage/QandA.jsx";
export default function DetailPage() {
  return (
    <div className="min-h-screen py-10 space-y-8">
      <GoBackButton />
      <DetailPageHeader />
      <AboutPanel />
      <QandA />
    </div>
  );
}
