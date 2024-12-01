import {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import VerifyEmailCard from "@/components/authentication/forms/VerifyEmailForm.tsx";
import {resendVerificationEmail} from "@/services/auth/resendVerificationEmail";
import useStatus from "@/hooks/useStatus";
import useTimer from "@/hooks/useTimer";
import {toast} from "@/hooks/use-toast";

// Wrapper Component
const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {status, setLoading, setDone, setError} = useStatus();
    const [responseMessage, setResponseMessage] = useState<string>("");

    const data = location.state as { fromRegister: boolean; token: string; email: string } | undefined;
    const email = data?.email;
    const token = data?.token;

    // Initialize the timer with a 60-second cooldown
    const {
        timeLeft: cooldown,
        start: startCooldown,
        reset: resetCooldown,
    } = useTimer(0, () => {
        // Optional: Notify the user when cooldown ends
        toast({
            title: "Cooldown Ended",
            description: "You can now resend the verification email.",
        });
    }, "verifyEmailCooldown");

    useEffect(() => {
        // Check both location.state and sessionStorage
        const fromRegister = data?.fromRegister || sessionStorage.getItem("fromRegister") === "true";

        if (!fromRegister) {
            // If user did not come from register page, redirect
            navigate("/login", {replace: true});
        } else {
            // Remove the flag after verification
            sessionStorage.removeItem("fromRegister");
        }
    }, [data, navigate]);

    const handleResend = async () => {
        setLoading();
        try {
            const response = await resendVerificationEmail(token);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            if (!response?.success) {
                setError();
                setResponseMessage(response?.message || "Failed to resend verification email.");
                toast({
                    title: "Error",
                    description: response?.message || "Failed to resend verification email.",
                    variant: "destructive",
                });
                return;
            }

            if (response?.success) {
                setDone();
                setResponseMessage(response?.message || "Verification email resent successfully.");
                toast({
                    title: "Success",
                    description: response?.message || "Verification email resent successfully.",
                });
                // Start the cooldown timer
                startCooldown(60);
            }
        } catch (error) {
            console.error("Error during resending verification email:", error);
            setError();
            setResponseMessage("An unexpected error occurred.");
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setLoading();
        }
    };

    return (
        <VerifyEmailCard
            email={email}
            handleSubmit={handleResend}
            responseMessage={responseMessage}
            cooldown={cooldown}
        />
    );
};

export default VerifyEmail;
