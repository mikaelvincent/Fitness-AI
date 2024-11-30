import ForgotPasswordForm from "@/components/authentication/forms/ForgotPasswordForm.tsx";
import useStatus from "@/hooks/useStatus.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import useFormStatus from "@/hooks/useFormStatus.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {ForgotPasswordSchema} from "@/utils/schema/ForgotPasswordSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {ForgotPasswordSendEmail} from "@/services/auth/forgotPassword.ts";

const ForgotPassword = () => {
    const {status, setLoading, setDone, setError} = useStatus();
    const navigate = useNavigate();
    const [formMessage, setFormMessage] = useState<string>("");
    const formStatus = useFormStatus();


    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
        formStatus.startSubmission(data, "post", "/api/forgot-password");
        setLoading();

        try {
            // Await the loginUser call
            const response = await ForgotPasswordSendEmail(data);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            if (!response?.success) {
                setError();
                setFormMessage(response?.errors || response?.message || "Failed to send password reset link.");
            }


            // Ensure response.success, response.token, and response.data are all present
            if (response?.success) {
                setDone();
                setFormMessage(response?.message);
                // Navigate to the reset-password page
                sessionStorage.setItem("fromForgotPassword", "true");
                navigate("/auth/reset-password", {state: {fromForgotPassword: true, email: data.email}});
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
            <ForgotPasswordForm status={status} formMessage={formMessage} formStatus={formStatus} form={form}
                                onSubmit={onSubmit}/>

        </>
    );
};

export default ForgotPassword;
