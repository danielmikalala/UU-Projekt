import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import HomePage from "./pages/HomePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import CampaignAdminPanelPage from "./pages/CampaignAdminPanelPage.jsx";
import ManagedCampaignsPage from "./pages/ManagedCampaignsPage.jsx";


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Navigation/>
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route path="*" element={<Navigate to="/home" replace/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/managed" element={<ManagedCampaignsPage/>}/>
                    <Route path="/campaign-admin/:id" element={<CampaignAdminPanelPage/>}/>
                    <Route path="/detail/:id" element={<DetailPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}
