import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/forms/LoginForm";
import { LoginSchema } from "@/utils/schema/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormStatus from "@/hooks/useFormStatus";
import useStatus from "@/hooks/useStatus";
import { loginUser } from "@/services/auth/login";
import useTimer from "@/hooks/useTimer";

const Login = () => {
  const { status, setLoading, setDone, setError } = useStatus();
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState<string>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formStatus = useFormStatus();

  const {
    timeLeft: retryAfter,
    start: startRetryTimer,
    reset: resetRetryTimer,
  } = useTimer(
    0,
    () => {
      // Callback when timer expires
      setFormMessage("");
    },
    "loginRetryTimer"
  );

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    formStatus.startSubmission(data, "post", "/api/login");
    setLoading();

    try {
      // Await the loginUser call
      const response = await loginUser(data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

      if (!response?.success && response?.status !== 429) {
        setError();
        setFormMessage(response?.message || "Login failed.");
      }

      if (!response?.success && response?.status === 429) {
        setError();
        setFormMessage(
          response?.message || "Too many attempts. Please try again later."
        );
        const retrySeconds = response?.retry_after || 60; // Default to 60 seconds if not provided
        // Start the retry timer with the specified duration
        startRetryTimer(retrySeconds);
      }

      if (response?.success) {
        setDone();
        setFormMessage(response?.message || "Login successful!");
        navigate("/");
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
      <LoginForm
        status={status}
        formMessage={formMessage}
        formStatus={formStatus}
        form={form}
        onSubmit={onSubmit}
        retryAfter={retryAfter > 0 ? retryAfter : null}
      />
    </>
  );
};

export default Login;
