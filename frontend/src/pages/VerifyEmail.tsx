import { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import VerifyEmailCard from "@/components/auth/forms/VerifyEmailCard";
import { resendVerificationEmail } from "@/services/auth/resendVerificationEmail";
import useStatus from "@/hooks/useStatus";

// Wrapper Component
const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();
  const { status, setLoading, setDone, setError } = useStatus();
  const [responseMessage, setResponseMessageMessage] = useState<string>("");

  const handleRouteLogin = () => {
    navigate("/auth/login");
  };

  const handleSubmit = async () => {
    setLoading();

    try {
      // Await the registerUser call
      const response = await resendVerificationEmail();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

      if (!response?.success) {
        setResponseMessageMessage(response?.message);
      }

      if (response?.success) {
        setResponseMessageMessage(response?.message);
        navigate("/");
      }
    } catch (error) {
      setError();
      console.error("Error during submission:", error);
      setResponseMessageMessage("Error during sending, please try again.");
    } finally {
      setDone();
    }
  };

  // // Redirect if no email is provided
  // if (!email) {
  //   return <Navigate to="/auth/register" />;
  // }

  return (
    <VerifyEmailCard
      email={email}
      handleRouteLogin={handleRouteLogin}
      handleSubmit={handleSubmit}
    />
  );
};

export default VerifyEmail;
