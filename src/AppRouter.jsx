import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import HomePage from "./pages/HomePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import CampaignAdminPanelPage from "./pages/CampaignAdminPanelPage.jsx";
import ManagedCampaignsPage from "./pages/ManagedCampaignsPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navigation/>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace/>}/>
          <Route path="/auth" element={<AuthPage/>}/>
          <Route path="/home" element={<RequireAuth><HomePage/></RequireAuth>}/>
          <Route path="/admin" element={<RequireAuth><AdminPage/></RequireAuth>}/>
          <Route path="/managed" element={<RequireAuth><ManagedCampaignsPage/></RequireAuth>}/>
          <Route path="/campaign-admin/:id" element={<RequireAuth><CampaignAdminPanelPage/></RequireAuth>}/>
          <Route path="/detail/:id" element={<RequireAuth><DetailPage/></RequireAuth>}/>
          <Route path="*" element={<Navigate to="/auth" replace/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
