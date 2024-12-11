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
import Chat from "./pages/Chat.tsx";
import Profile from "./pages/Main/Profile/Profile.tsx";

import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import ResetPassword from "@/pages/Auth/ResetPassword.tsx";
import { Toaster } from "@/components/ui/toaster";

import SetupLayout from "./layout/SetupLayout.tsx";
import { SetupProvider } from "./pages/setup/SetupContext";
import SetupWizard from "./pages/setup/SetupWizard";
import { UpdateProfile } from "@/pages/Main/Profile/UpdateProfile.tsx";
import { ChangePassword } from "@/pages/Main/Profile/ChangePassword.tsx";
import { TwoFactorAuthentication } from "@/pages/Main/Profile/TwoFactorAuthentication.tsx";

import ChatPage from "./pages/ChatPage.tsx";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <Router>
        <Toaster />
        {/*Uncomment for protected routes*/}
        {/*<Routes>*/}
        {/*    /!* Main layout routes *!/*/}
        {/*<Route*/}
        {/*  path="/"*/}
        {/*  element={*/}
        {/*    <ProtectedRoute>*/}
        {/*      <MainLayout />*/}
        {/*    </ProtectedRoute>*/}
        {/*  }*/}
        {/*>*/}
        {/*  /!* Root Route *!/*/}
        {/*  <Route index element={<Home />} />*/}

        {/*  /!* Progress Route *!/*/}
        {/*  <Route path="progress" element={<Progress />} />*/}

        {/*  /!* Profile Routes *!/*/}
        {/*  <Route path="profile">*/}
        {/*    /!* Default Profile Page *!/*/}
        {/*    <Route index element={<Profile />} />*/}

        {/*    /!* Nested Profile Actions *!/*/}
        {/*    <Route path="update-profile" element={<UpdateProfile />} />*/}
        {/*    <Route path="change-password" element={<ChangePassword />} />*/}
        {/*    <Route*/}
        {/*      path="two-factor-authentication"*/}
        {/*      element={<TwoFactorAuthentication />}*/}
        {/*    />*/}
        {/*  </Route>*/}
        {/*</Route>*/}

        {/*<Route path="chat" element={<ProtectedRoute><Chat/></ProtectedRoute>}>}/>*/}

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
            {/* Root Route */}
            <Route index element={<Home />} />

            {/* Other Top-Level Routes */}
            <Route path="progress" element={<Progress />} />

            {/* Profile Routes */}
            <Route path="profile">
              {/* Default Profile Page */}
              <Route index element={<Profile />} />

              {/* Nested Profile Actions */}
              <Route path="update-profile" element={<UpdateProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route
                path="two-factor-authentication"
                element={<TwoFactorAuthentication />}
              />
            </Route>
          </Route>

          <Route path="/chat" element={<Chat />} />

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

          <Route path="/initial-chat" element={<ChatPage />} />

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
