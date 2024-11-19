  import React from "react";
  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  import MainLayout from "./layout/MainLayout";
  import AuthLayout from "./layout/AuthLayout";
  import Dashboard from "./pages/Dashboard";
  import Login from "./pages/Login";
  import NotFound from "./pages/NotFound";

  const App: React.FC = () => {
    return (
      <Router>
        <Routes>
          {/* Main layout routes */}
          <Route element={<MainLayout />}>
            {/* Root path ("/") loads the Dashboard */}
            <Route path="/" element={<Dashboard />} />
          </Route>

          {/* Authentication layout routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  };

  export default App;
