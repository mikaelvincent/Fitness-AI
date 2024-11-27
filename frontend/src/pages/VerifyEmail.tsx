import {useState} from "react";
import {useLocation, Navigate, useNavigate} from "react-router-dom";
import VerifyEmailCard from "@/components/auth/forms/VerifyEmailCard";
import {resendVerificationEmail} from "@/services/auth/resendVerificationEmail";
import useStatus from "@/hooks/useStatus";
import {RegisterLoginResponseData} from "@/types/react-router"; // Import the shared type
import {useUser} from "@/hooks/context/UserContext"; // Import useUser from UserContext

// Wrapper Component
const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {status, setLoading, setDone, setError} = useStatus();
    const [responseMessage, setResponseMessageMessage] = useState<string>("");

    const state = location.state as { data: RegisterLoginResponseData } | undefined;
    const email = state?.data?.email;
    const token = state?.data?.token;

    const {loginUser: contextLoginUser} = useUser(); // Destructure loginUser from UserContext


    const handleLogin = () => {
        // Set user data and token in UserContext before navigating
        if (state?.data && token) {
            contextLoginUser(
                {
                    id: state.data.id,
                    name: state.data.name,
                    email: state.data.email,
                },
                token
            );
        }
        navigate("/");
    };

    const handleSubmit = async () => {
        setLoading();
        console.log(token)
        try {
            // Await the registerUser call
            const response = await resendVerificationEmail(token);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            if (!response?.success) {
                setResponseMessageMessage(response?.message);
            }

            if (response?.success) {
                setResponseMessageMessage(response?.message);
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
    if (!email) {
        return <Navigate to="/auth/login" replace/>;
    }

    return (
        <VerifyEmailCard
            email={email}
            handleLogin={handleLogin}
            handleSubmit={handleSubmit}
            responseMessage={responseMessage}
        />
    );
};

export default VerifyEmail;
