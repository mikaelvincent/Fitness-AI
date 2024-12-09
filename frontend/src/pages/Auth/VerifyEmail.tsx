import { useState } from "react";
import VerifyEmailForm from "@/components/authentication/forms/VerifyEmailForm.tsx";
import useStatus from "@/hooks/useStatus";
import useTimer from "@/hooks/useTimer";
import { toast } from "@/hooks/use-toast";
import { VerifyEmailSchema } from "@/utils/schema/auth/VerifyEmailSchema.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormStatus from "@/hooks/useFormStatus";
import { initiateVerifyEmail } from "@/services/auth/initiateVerifyEmail.ts";
import { z } from "zod";
import { resendVerificationEmail } from "@/services/auth/resendVerificationEmail.ts";

// Wrapper Component
const VerifyEmail = () => {
  const { status, setLoading, setDone, setError } = useStatus();
  const [responseMessage, setResponseMessage] = useState<string>("");
  const formStatus = useFormStatus();
  const [verificationEmailSent, setVerificationEmailSent] =
    useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Initialize the timer with a 60-second cooldown
  const {
    timeLeft: cooldown,
    start: startCooldown,
    reset: resetCooldown,
  } = useTimer(
    0,
    () => {
      setDone();
    },
    "verifyEmailCooldown",
  );

  const handleVerifyEmail = async (data: z.infer<typeof VerifyEmailSchema>) => {
    setLoading();
    try {
      const response = !verificationEmailSent
        ? await initiateVerifyEmail(data)
        : await resendVerificationEmail(data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

      if (!response?.success) {
        setError();
        setResponseMessage(
          response?.message || "Registration Initiation failed.",
        );
        return;
      }

      if (!response?.success && response?.status === 429) {
        setError();
        setResponseMessage(
          response?.message || "Too many attempts. Please try again later.",
        );
        startCooldown(response?.retry_after || 60);
        return;
      }

      if (response?.success) {
        setDone();
        setResponseMessage(
          response?.message ||
            "Registration Initiation successful. Please check your email.",
        );
        toast({
          title: "Success",
          description:
            response?.message ||
            "Registration Initiation successful. Please check your email.",
        });
        startCooldown(60);
        setVerificationEmailSent(true);
        return;
      }
    } catch (error) {
      console.error("Error during Registration Initation", error);
      setError();
      setResponseMessage("An unexpected error occurred.");
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
    <VerifyEmailForm
      status={status}
      formMessage={responseMessage}
      form={form}
      formStatus={formStatus}
      onSubmit={handleVerifyEmail}
      cooldown={cooldown}
      isResend={verificationEmailSent}
    />
  );
};

export default VerifyEmail;
