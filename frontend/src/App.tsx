// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./features/profile/MainLayout.tsx";
import AuthLayout from "./features/authentication/AuthLayout.tsx";
import Home from "./features/profile/pages/Main/Home.tsx";
import Login from "./features/authentication/pages/Login.tsx";
import NotFound from "./shared/pages/NotFound.tsx";
import Register from "./features/authentication/pages/Register.tsx";
import ForgotPassword from "./features/authentication/pages/ForgotPassword.tsx";
import VerifyEmail from "./features/authentication/pages/VerifyEmail.tsx";
import Progress from "./features/profile/pages/Main/Progress.tsx";
import Profile from "./features/profile/pages/Main/Profile/Profile.tsx";
import { ThemeProvider } from "./shared/components/theme/theme-provider.tsx";
import ResetPassword from "@/features/authentication/pages/ResetPassword.tsx";
import { Toaster } from "@/shared/components/ui/toaster.tsx";
import SetupLayout from "./features/setup/SetupLayout.tsx";
import { SetupProvider } from "./features/setup/components/SetupContext.tsx";
import SetupWizard from "./features/setup/pages/SetupWizard.tsx";
import { ChangePassword } from "@/features/profile/pages/Main/Profile/ChangePassword.tsx";
import { TwoFactorAuthentication } from "@/features/profile/pages/Main/Profile/TwoFactorAuthentication.tsx";
import ChatPage from "./features/chat/pages/ChatPage.tsx";
import ProtectedRoute from "@/shared/components/protected-routes/ProtectedRoute.tsx";
import PublicRoute from "@/shared/components/protected-routes/PublicRoute.tsx";
import LandingPage from "./shared/pages/LandingPage.tsx";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <Router>
        <Toaster />
        <Routes>
          <Route index element={<LandingPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Root Route */}
            <Route path="dashboard" element={<Home />} />

            {/* Progress Route */}
            <Route path="progress" element={<Progress />} />

            {/* Profile Routes */}
            <Route path="profile">
              {/* Default Profile Page */}
              <Route index element={<Profile />} />

              {/* Nested Profile Actions */}
              <Route path="change-password" element={<ChangePassword />} />
              <Route
                path="two-factor-authentication"
                element={<TwoFactorAuthentication />}
              />
            </Route>
          </Route>

          {/* Chat Route */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Setup Routes */}
          <Route
            path="/setup/*"
            element={
              <PublicRoute>
                <SetupProvider>
                  <SetupLayout />
                </SetupProvider>
              </PublicRoute>
            }
          >
            <Route index element={<SetupWizard />} />
            {/* Add more nested setup routes here if needed */}
          </Route>

          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }
          >
            <Route path="login" element={<Login />} />
            <Route path="complete-registration" element={<Register />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* Catch-all Route for 404 */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
