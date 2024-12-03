// src/App.jsx
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import Home from './pages/Home.tsx';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import {ThemeProvider} from './components/theme/theme-provider.tsx';
import ProtectedRoute from "@/components/protected-routes/ProtectedRoute.tsx";
import PublicRoute from "@/components/protected-routes/PublicRoute.tsx";
import ResetPassword from "@/pages/ResetPassword.tsx";
import {Toaster} from "@/components/ui/toaster";

const App = () => {
    return (
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
            <Router>
                <Toaster/>
                {/*Uncomment for protected routes*/}
                {/*<Routes>*/}
                {/*    /!* Main layout routes *!/*/}
                {/*    <Route path="/" element={<ProtectedRoute><MainLayout/> </ProtectedRoute>}>*/}
                {/*        <Route index element={<Home/>}/>*/}
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
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<Home/>}/>
                    </Route>

                    {/* Authentication layout routes */}
                    <Route path="/" element={<AuthLayout/>}>
                        <Route path="login" element={<Login/>}/>
                        <Route path="complete-registration" element={<Register/>}/>
                        <Route path="verify-email" element={<VerifyEmail/>}/>
                        <Route path="forgot-password" element={<ForgotPassword/>}/>
                        <Route path="reset-password" element={<ResetPassword/>}/>
                    </Route>

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>

            </Router>
        </ThemeProvider>
    );
};

export default App;
