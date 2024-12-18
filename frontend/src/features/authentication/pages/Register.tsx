import RegisterForm from "@/features/authentication/components/forms/RegisterForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterSchema } from "@/shared/utils/schema/RegisterSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormStatus from "@/shared/hooks/useFormStatus";
import useStatus from "@/shared/hooks/useStatus";
import { registerUser } from "@/features/authentication/services/register";
import { z } from "zod";
import useTimer from "@/shared/hooks/useTimer";
import { toast } from "@/shared/hooks/use-toast";
import { validateRegistrationToken } from "@/features/authentication/services/validateRegistrationToken";
import { useUser } from "@/shared/hooks/context/UserContext";

const Register = () => {
  const { status, setLoading, setDone, setError } = useStatus();
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [invalidInput, setInvalidInput] = useState<
    "none" | "name" | "password" | "others" | string
  >("none");
  const [token, setToken] = useState<string>("");
  const { loginUser: contextLoginUser } = useUser();

  // Uncomment for development and comment for protected routes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");

    if (!tokenParam) {
      navigate("/login", { replace: true });
    } else {
      setToken(tokenParam);
    }
  }, [location.search, navigate]);

  const validateToken = async () => {
    try {
      const response = await validateRegistrationToken(token);
      if (!response?.success) {
        navigate("/verify-email", { replace: true });
        toast({
          title: "Invalid Token",
          description: "The token is invalid or expired.",
        });
      } else {
        toast({
          title: "You're good to go!",
          description: "You can now proceed with registration.",
        });
      }
    } catch (error) {
      console.error("Error validating token:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while validating the token.",
      });
    }
  };

  useEffect(() => {
    if (token) {
      validateToken().then((r) => r);
    }
  }, [token, navigate]);

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      password: "",
      password_confirmation: "",
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
    "registerCooldown",
  );

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    formStatus.startSubmission(data, "post", "/api/registration/complete");
    setLoading();
    try {
      // Await the registerUser call
      const response = await registerUser({ ...data, token });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

      if (!response?.success && response?.status === 429) {
        setInvalidInput("others");
        setError();
        setResponseMessage(
          response?.message || "Too many attempts. Please try again later.",
        );
        startCooldown(response?.retry_after || 60);
        return;
      }

      if (!response?.success) {
        setInvalidInput(response.errorKey ? response.errorKey : "others");
        setError();
        setResponseMessage(response?.message || "Registration failed.");
        return;
      }

      if (response?.success && response?.token) {
        setDone();
        setResponseMessage(response?.message || "Registration successful!");
        // Clear the 'setUpData' from SessionStorage
        sessionStorage.removeItem("setupData");
        sessionStorage.removeItem("currentStepIndex");

        toast({
          title: "Registration Successful",
          description: "You are now registered.",
        });
        contextLoginUser(response.token);
        navigate("/chat");
        return;
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setResponseMessage("An error occurred during registration.");
      setError();
    } finally {
      formStatus.endSubmission();
    }
  };

  const formStatus = useFormStatus();
  return (
    <>
      <RegisterForm
        status={status}
        formMessage={responseMessage}
        invalidInput={invalidInput}
        formStatus={formStatus}
        form={form}
        onSubmit={onSubmit}
        cooldown={cooldown}
      />
    </>
  );
};

export default Register;
