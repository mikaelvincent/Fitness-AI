import {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import VerifyEmailCard from "@/components/authentication/forms/VerifyEmailForm.tsx";
import {resendVerificationEmail} from "@/services/auth/resendVerificationEmail";
import useStatus from "@/hooks/useStatus";

// Wrapper Component
const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {status, setLoading, setDone, setError} = useStatus();
    const [responseMessage, setResponseMessageMessage] = useState<string>("");

    const data = location.state as { fromRegister: boolean; token: string; email: string } | undefined;
    const email = data?.email;
    const token = data?.token;

    useEffect(() => {
        // Check both location.state and sessionStorage
        const fromRegister = data?.fromRegister || sessionStorage.getItem("fromRegister") === "true";

        if (!fromRegister) {
            // If user did not come from register page, redirect
            navigate("/auth/login", {replace: true});
        } else {
            // Remove the flag after verification
            sessionStorage.removeItem("fromRegister");
        }
    }, [data, navigate]);

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

    return (
        <VerifyEmailCard
            email={email}
            handleSubmit={handleSubmit}
            responseMessage={responseMessage}
        />
    );
};

export default VerifyEmail;
