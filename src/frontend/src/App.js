// Routes are defined here for access to pages
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './themes/Themes'; // Import the custom theme
import Inactivity from './pages/InactivityPage';
import Home from './pages/Home';
import PurgePage from './pages/PurgePage';
import UserActivityPage from './pages/UserActivityPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BlacklistPage from "./pages/BlacklistPage";
import AccountPage from "./pages/AccountPage";
import FAQPage from "./pages/FAQPage";
import RolesPage from "./pages/RolesPage";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/useractivity" element={<UserActivityPage />} />
                    <Route path="/inactivity" element={<Inactivity />} />
                    <Route path="/purge" element={<PurgePage />} />
                    <Route path="/blacklist" element={<BlacklistPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/roles" element={<RolesPage />} />

                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
