import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/authentication/forms/LoginForm";
import { LoginSchema, LoginSchemaWith2FA } from "@/utils/schema/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormStatus from "@/hooks/useFormStatus";
import useStatus from "@/hooks/useStatus";
import { loginUser } from "@/services/auth/login";
import useTimer from "@/hooks/useTimer";
import { useUser } from "@/hooks/context/UserContext"; // Import useUser from UserContext
import { z } from "zod";
import TwoFactorAuthForm from "@/components/authentication/forms/TwoFactorAuthForm.tsx";

const Login = () => {
  const { status, setLoading, setDone, setError } = useStatus();
  const navigate = useNavigate();
  const { loginUser: contextLoginUser } = useUser(); // Destructure loginUser from UserContext
  const [formMessage, setFormMessage] = useState<string>("");
  const [isOpen2FAModal, setIsOpen2FAModal] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      two_factor_code: "",
    },
  });

  const formStatus = useFormStatus();

  const {
    timeLeft: cooldown,
    start: startCooldown,
    reset: resetCooldown,
  } = useTimer(
    0,
    () => {
      setFormMessage("");
      setDone();
    },
    "loginRetryTimer",
  );

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading();
    formStatus.startSubmission(data, "post", "/api/login");
    try {
      // Check if two_factor_code is present to determine the type of submission
      const is2FASubmission = !!data.two_factor_code;

      // Use appropriate schema based on submission type
      const schema = is2FASubmission ? LoginSchemaWith2FA : LoginSchema;

      // Validate data with the selected schema
      const validatedData = schema.parse(data);

      // Call loginUser with validated data
      const response = await loginUser(validatedData);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay
      console.log(response.status);
      if (
        !response?.success &&
        response?.status !== 429 &&
        response?.status !== 422
      ) {
        setError();
        setFormMessage(response?.message || "Login failed.");
        return;
      }

      if (!response?.success && response?.status === 429) {
        setError();
        setFormMessage(
          response?.message || "Too many attempts. Please try again later.",
        );
        const retrySeconds = response?.retry_after || 60; // Default to 60 seconds if not provided
        // Start the retry timer with the specified duration
        startCooldown(retrySeconds);
        return;
      }

      if (!response?.success && response?.status === 422 && !isOpen2FAModal) {
        setLoading();
        setFormMessage("Two-Factor Authentication is required.");
        setIsOpen2FAModal(true);
        return;
      }

      if (!response?.success && response?.status === 422 && isOpen2FAModal) {
        setError();
        setFormMessage("Two-Factor Authentication is required.");
        setIsOpen2FAModal(true);
        return;
      }

      // Ensure response.success, response.token, and response.data are all present
      if (response?.success && response?.token) {
        setDone();
        setFormMessage(response?.message || "Login successful!");
        // Set user data and token in UserContext
        contextLoginUser(response.token);

        // Navigate to the dashboard
        navigate("/");
        return;
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
        cooldown={cooldown}
      />
      <TwoFactorAuthForm
        form={form}
        setIsModalOpen={setIsOpen2FAModal}
        isModalOpen={isOpen2FAModal}
        onSubmit={onSubmit}
        cooldown={cooldown}
        status={status}
        formStatus={formStatus}
        formMessage={formMessage}
      />
    </>
  );
};

export default Login;
