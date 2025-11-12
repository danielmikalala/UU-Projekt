import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import './index.css'
import Navigation from './components/Navigation.jsx'
import HomePage from './pages/HomePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import ManagedCampaignsPage from './pages/ManagedCampaignsPage.jsx'
import DetailPage from './pages/DetailPage.jsx'

function AppRouter() {
    return (
        <BrowserRouter>
            <Navigation/>
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/" replace/>}/>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/managed" element={<ManagedCampaignsPage/>}/>
                    <Route path="/detail/:id" element={<DetailPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppRouter/>
    </StrictMode>,
)
