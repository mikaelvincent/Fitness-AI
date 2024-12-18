import ForgotPasswordForm from "@/features/authentication/components/forms/ForgotPasswordForm";
import useStatus from "@/shared/hooks/useStatus";
import { useState } from "react";
import useFormStatus from "@/shared/hooks/useFormStatus";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ForgotPasswordSchema } from "@/shared/utils/schema/ForgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSendEmail } from "@/features/authentication/services/forgotPassword";
import useTimer from "@/shared/hooks/useTimer";
import { toast } from "@/shared/hooks/use-toast";

const ForgotPassword = () => {
    const { status, setLoading, setDone, setError } = useStatus();
    const [formMessage, setFormMessage] = useState<string>("");
    const formStatus = useFormStatus();

    // Initialize the timer with a 60-second cooldown
    const {
        timeLeft: cooldown,
        start: startCooldown,
        reset: resetCooldown,
    } = useTimer(0, () => {
        setFormMessage("");
        setDone();
    }, "forgotPasswordCooldown");

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
        formStatus.startSubmission(data, "post", "/api/password/forgot");
        setLoading();

        try {
            // Await the ForgotPasswordSendEmail call
            const response = await ForgotPasswordSendEmail(data);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            if (!response?.success && response?.status === 429) {
                setError();
                setFormMessage(response?.message || "Please try again after a while.");
                startCooldown(response.retry_after || 60);
                return;
            }

            if (!response?.success) {
                setError();
                setFormMessage(response?.message || "Failed to send password reset link.");
                return;
            }

            if (response?.success) {
                setDone();
                setFormMessage(response?.message || "Password reset link sent successfully.");
                toast({
                    title: "Success",
                    description: response?.message || "Password reset link sent to your email.",
                });
                // Start the cooldown timer
                startCooldown(60);
                return;
            }

        } catch (error) {
            console.error("Error during submission:", error);
            setError();
            setFormMessage("An unexpected error occurred.");
            toast({
                title: "Error",
                description: "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            formStatus.endSubmission();
        }
    };

    return (
        <>
            <ForgotPasswordForm status={status} formMessage={formMessage} formStatus={formStatus} form={form}
                onSubmit={onSubmit} cooldown={cooldown} />

        </>
    );
};

export default ForgotPassword;
