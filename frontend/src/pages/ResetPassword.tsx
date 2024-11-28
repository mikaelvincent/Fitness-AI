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

const ResetPassword = () => {
    const location = useLocation();
    const {status, setLoading, setDone, setError} = useStatus();
    const navigate = useNavigate();
    const [formMessage, setFormMessage] = useState<string>("");
    const formStatus = useFormStatus();

    const data = location.state as { fromForgotPassword: boolean; email: string } | undefined;
    const email = data?.email;

    // Uncomment for development and comment for protected routes
    // useEffect(() => {
    //     // Check both location.state and sessionStorage
    //     const fromForgotPassword = data?.fromForgotPassword || sessionStorage.getItem("fromForgotPassword") === "true";
    //
    //     if (!fromForgotPassword) {
    //         // If user did not come from forgot password page, redirect
    //         navigate("/auth/login", {replace: true});
    //     } else {
    //         // Remove the flag after verification
    //         sessionStorage.removeItem("fromForgotPassword");
    //     }
    // }, [data, navigate]);

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            token: "",
            email: email || "",
            password: "",
            password_confirmation: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
        formStatus.startSubmission(data, "post", "/api/reset-password");
        setLoading();

        try {
            // Await the loginUser call
            const response = await SendResetPasswordRequest(data);
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
                navigate("/auth/login");
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
                               status={status}/>
        </>
    );
};

export default ResetPassword;