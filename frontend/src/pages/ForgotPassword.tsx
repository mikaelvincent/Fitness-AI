import ForgotPasswordForm from "@/components/authentication/forms/ForgotPasswordForm.tsx";
import useStatus from "@/hooks/useStatus.tsx";
import {useState} from "react";
import useFormStatus from "@/hooks/useFormStatus.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {ForgotPasswordSchema} from "@/utils/schema/ForgotPasswordSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {ForgotPasswordSendEmail} from "@/services/auth/forgotPassword.ts";
import useTimer from "@/hooks/useTimer";
import {toast} from "@/hooks/use-toast";

const ForgotPassword = () => {
    const {status, setLoading, setDone, setError} = useStatus();
    const [formMessage, setFormMessage] = useState<string>("");
    const formStatus = useFormStatus();

    // Initialize the timer with a 60-second cooldown
    const {
        timeLeft: cooldown,
        start: startCooldown,
        reset: resetCooldown,
    } = useTimer(0, () => {
        // Optional: Notify the user when cooldown ends
        toast({
            title: "Cooldown Ended",
            description: "You can now request another password reset.",
        });
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
                                onSubmit={onSubmit} cooldown={cooldown}/>

        </>
    );
};

export default ForgotPassword;
