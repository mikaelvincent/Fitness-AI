import RegisterForm from "@/components/auth/forms/RegisterForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterSchema } from "@/utils/schema/RegisterSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFormStatus from "@/hooks/useFormStatus";
import useStatus from "@/hooks/useStatus";
import { registerUser } from "@/services/auth/register";

const Register = () => {
  const { status, setLoading, setDone, setError } = useStatus();
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState<string>("");
  const [usedEmail, setUsedEmail] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    formStatus.startSubmission(data, "post", "/api/register");
    setLoading();
    try {
      // Await the registerUser call
      const response = await registerUser(data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay
      console.log(response);
      if (!response?.success) {
        setUsedEmail(true);
        setError();
        setFormMessage(response?.errors);
      }

      if (response?.success) {
        setDone();
        setFormMessage(response?.message);
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setFormMessage("An error occurred during registration.");
      setError();
    } finally {
      formStatus.endSubmission();
    }

    console.log(formMessage);
  };

  const formStatus = useFormStatus();
  return (
    <>
      <RegisterForm
        status={status}
        formMessage={formMessage}
        usedEmail={usedEmail}
        formStatus={formStatus}
        form={form}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default Register;
