import { useEffect, useState } from "react";
import VerifyEmailForm from "@/features/authentication/components/forms/VerifyEmailForm";
import useStatus from "@/shared/hooks/useStatus";
import useTimer from "@/shared/hooks/useTimer";
import { toast } from "@/shared/hooks/use-toast";
import { VerifyEmailSchema } from "@/shared/utils/schema/VerifyEmailSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormStatus from "@/shared/hooks/useFormStatus";
import { initiateVerifyEmail } from "@/features/authentication/services/initiateVerifyEmail";
import { z } from "zod";
import { resendVerificationEmail } from "@/features/authentication/services/resendVerificationEmail";
import { useNavigate } from "react-router-dom";

// Wrapper Component
const VerifyEmail = () => {
  const { status, setLoading, setDone, setError } = useStatus();
  const [responseMessage, setResponseMessage] = useState<string>("");
  const formStatus = useFormStatus();
  const [verificationEmailSent, setVerificationEmailSent] =
    useState<boolean>(false);
  const [userAttributes, setUserAttributes] = useState<Object>({});

  const form = useForm({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();

  // Effect to retrieve setupData from sessionStorage
  useEffect(() => {
    const setupData = sessionStorage.getItem("setupData");
    if (setupData) {
      try {
        const parsedData = JSON.parse(setupData) as {
          [key: string]: string | number;
        };
        setUserAttributes(parsedData);
      } catch (error) {
        console.error("Error parsing setupData from sessionStorage:", error);
        // Optionally, handle the error by setting an error state or notifying the user
      }
    } else {
      console.warn("No setupData found in sessionStorage.");
      // Optionally, handle the absence of setupData
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // New useEffect to check if setupData is empty and redirect to /login
  useEffect(() => {
    const setupData = sessionStorage.getItem("setupData");
    if (!setupData) {
      navigate("/login");
    }
  }, []);

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
        ? await initiateVerifyEmail({ data, userAttributes })
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
      console.error("Error during Registration Initiation", error);
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
