// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import Home from "./pages/Main/Home.tsx";
import Login from "./pages/Auth/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import Register from "./pages/Auth/Register.tsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.tsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.tsx";
import Progress from "./pages/Main/Progress.tsx";
import Profile from "./pages/Main/Profile/Profile.tsx";

import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import ResetPassword from "@/pages/Auth/ResetPassword.tsx";
import { Toaster } from "@/components/ui/toaster";

import SetupLayout from "./layout/SetupLayout.tsx";
import { SetupProvider } from "./components/setup/SetupContext.tsx";
import SetupWizard from "./pages/setup/SetupWizard";
import { ChangePassword } from "@/pages/Main/Profile/ChangePassword.tsx";
import { TwoFactorAuthentication } from "@/pages/Main/Profile/TwoFactorAuthentication.tsx";

import ChatPage from "./pages/ChatPage.tsx";

// Import ProtectedRoute and PublicRoute components
import ProtectedRoute from "@/components/protected-routes/ProtectedRoute";
import PublicRoute from "@/components/protected-routes/PublicRoute";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <Router>
        <Toaster />
        <Routes>
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

          {/* Initial Chat Route */}
          <Route
            path="/initial-chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

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
