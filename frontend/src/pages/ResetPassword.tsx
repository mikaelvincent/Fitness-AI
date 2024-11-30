import ResetPasswordForm from "@/components/authentication/forms/ResetPasswordForm.tsx";
import useStatus from "@/hooks/useStatus.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import useFormStatus from "@/hooks/useFormStatus.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {ResetPasswordSchema} from "@/utils/schema/ResetPasswordSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {SendResetPasswordRequest} from "@/services/auth/resetPassword.ts";
import {toast} from "@/hooks/use-toast";

const ResetPassword = () => {
    const location = useLocation();
    const {status, setLoading, setDone, setError} = useStatus();
    const navigate = useNavigate();
    const [formMessage, setFormMessage] = useState<string>("");
    const formStatus = useFormStatus();
    const [email, setEmail] = useState<string>("");
    const [token, setToken] = useState<string>("");

    // Uncomment for development and comment for protected routes
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get("token");
        const emailParam = queryParams.get("email");

        if (tokenParam && emailParam) {
            setToken(tokenParam);
            setEmail(emailParam);
        } else {
            // If token or email is missing, redirect to login
            navigate("/login", {replace: true});
        }
    }, [location.search, navigate]);

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
        formStatus.startSubmission(data, "post", "/api/reset-password");
        setLoading();

        try {
            // Await the loginUser call
            const response = await SendResetPasswordRequest({...data, token, email});
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            if (!response?.success) {
                setError();
                setFormMessage(response?.errors || response?.message || "Reset password failed.");
            }


            // Ensure response.success, response.token, and response.data are all present
            if (response?.success) {
                setDone();
                setFormMessage(response?.message);
                // Navigate to the login page
                toast({
                    title: "Password Reset Successful",
                    description: "Your password has been reset. Please log in with your new password.",
                });
                navigate("/login");
            }

        } catch (error) {
            console.error("Error during submission:", error);
            setError();
            setFormMessage("An unexpected error occurred.");
        } finally {
            formStatus.endSubmission();
        }
    };


    return (
        <>
            <ResetPasswordForm form={form} onSubmit={onSubmit} formStatus={formStatus} formMessage={formMessage}
                               status={status} email={email}/>
        </>
    );
};

export default ResetPassword;