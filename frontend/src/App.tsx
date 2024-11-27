// src/App.jsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import {ThemeProvider} from './components/theme/theme-provider.tsx';

const App = () => {
    return (
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
            <Router>
                <Routes>
                    {/* Main layout routes */}
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<Dashboard/>}/>
                    </Route>

                    {/* Authentication layout routes */}
                    <Route path="/auth" element={<AuthLayout/>}>
                        <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Register/>}/>
                        <Route path="verify-email" element={<VerifyEmail/>}/>
                        <Route path="forgot-password" element={<ForgotPassword/>}/>
                    </Route>

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
