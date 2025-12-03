import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./AppRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CampaignProvider } from "./context/CampaignContext.jsx"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CampaignProvider>
        <AppRouter />
      </CampaignProvider>
    </AuthProvider>
  </React.StrictMode>
);
