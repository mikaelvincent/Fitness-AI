// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout.tsx';
import AuthLayout from './layout/AuthLayout.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import NotFound from './pages/NotFound.tsx';
import Register from './pages/Register.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import VerifyEmail from './pages/VerifyEmail.tsx';
import Progress from './pages/Progress.tsx';
import Chat from './pages/Chat.tsx';
import Profile from './pages/Profile.tsx';
import { ThemeProvider } from './components/theme/theme-provider.tsx';
import ProtectedRoute from "@/components/protected-routes/ProtectedRoute.tsx";
import PublicRoute from "@/components/protected-routes/PublicRoute.tsx";
import ResetPassword from "@/pages/ResetPassword.tsx";
import { Toaster } from "@/components/ui/toaster";

import SetupLayout from './layout/SetupLayout.tsx';
import { SetupProvider } from './pages/setup/SetupContext';
import SetupWizard from './pages/setup/SetupWizard';

const App = () => {
    return (
        <ThemeProvider defaultTheme="light" storageKey="app-theme">

            <Router>
                <Toaster />
                {/*Uncomment for protected routes*/}
                {/*<Routes>*/}
                {/*    /!* Main layout routes *!/*/}
                {/*    <Route path="/" element={<ProtectedRoute><MainLayout/> </ProtectedRoute>}>*/}
                {/*        <Route index element={<Home/>}/>*/}
                {/*<Route path="progress" element={<Progress/>}/>*/}
                {/*<Route path="chat" element={<Chat/>}/>*/}
                {/*<Route path="profile" element={<Profile/>}/>*/}
                {/*    </Route>*/}

                {/*    /!* Authentication layout routes *!/*/}
                {/*    <Route path="/" element={<PublicRoute> <AuthLayout/> </PublicRoute>}>*/}
                {/*        <Route path="login" element={<Login/>}/>*/}
                {/*        <Route path="complete-registration" element={<Register/>}/>*/}
                {/*        <Route path="verify-email" element={<VerifyEmail/>}/>*/}
                {/*        <Route path="forgot-password" element={<ForgotPassword/>}/>*/}
                {/*        <Route path="reset-password" element={<ResetPassword/>}/>*/}
                {/*    </Route>*/}

                {/*    /!* Catch-all route for 404 *!/*/}
                {/*    <Route path="*" element={<ProtectedRoute> <NotFound/> </ProtectedRoute>}/>*/}
                {/*</Routes>*/}

                {/*For development to remove protected routes*/}

                <Routes>
                    {/* Main layout routes */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="progress" element={<Progress />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>

                    {/* Setup process with its own context and layout */}
                    {/* Single route for setup wizard */}
                    <Route
                        path="/setup"
                        element={
                            <SetupProvider>
                                <SetupLayout />
                            </SetupProvider>
                        }
                    >
                        <Route index element={<SetupWizard />} />
                    </Route>

                    {/* Authentication layout routes */}
                    <Route path="/" element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="complete-registration" element={<Register />} />
                        <Route path="verify-email" element={<VerifyEmail />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                    </Route>

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>

            </Router>
        </ThemeProvider>
    );
};

export default App;
