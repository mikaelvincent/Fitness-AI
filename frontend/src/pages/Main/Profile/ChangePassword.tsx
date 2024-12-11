import { ChangePasswordForm } from "@/components/profile/changePassword/ChangePasswordForm.tsx";
import useStatus from "@/hooks/useStatus.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useFormStatus from "@/hooks/useFormStatus.tsx";
import { useUser } from "@/hooks/context/UserContext.tsx";
import useTimer from "@/hooks/useTimer.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChangePasswordSchema } from "@/utils/schema/ChangePasswordSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordRequest } from "@/services/ChangePassword.ts";
import { toast } from "@/hooks/use-toast";

export const ChangePassword = () => {
  const { status, setLoading, setDone, setError } = useStatus();
  const navigate = useNavigate();
  const [formMessage, setFormMessage] = useState<string>("");
  const formStatus = useFormStatus();
  const { token } = useUser();

  // Initialize the timer with a 60-second cooldown
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
    "changePasswordCooldown",
  );

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ChangePasswordSchema>) => {
    try {
      setLoading();
      const response = await ChangePasswordRequest({ token, data });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

      if (!response?.success) {
        setError();
        setFormMessage(response?.message || "Change password failed");
        startCooldown(response?.retry_after || 0);
        return;
      }

      if (response?.success) {
        setDone();
        setFormMessage("");
        toast({
          title: response?.message || "Change password successful",
          description: "Your password has been updated",
        });
        resetCooldown();
        navigate("/profile");
        return;
      }
    } catch (error) {
      setError();
      setFormMessage("An unexpected error occurred");
    }
  };

  return (
    <>
      <ChangePasswordForm
        form={form}
        status={status}
        formMessage={formMessage}
        formStatus={formStatus}
        onSubmit={onSubmit}
        cooldown={cooldown}
      />
    </>
  );
};
