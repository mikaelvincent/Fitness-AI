import { UpdateProfileForm } from "@/components/profile/updateProfile/UpdateProfileForm.tsx";
import useStatus from "@/hooks/useStatus.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useFormStatus from "@/hooks/useFormStatus.tsx";
import { useUser } from "@/hooks/context/UserContext.tsx";
import useTimer from "@/hooks/useTimer.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema } from "@/utils/schema/UpdateProfileSchema.ts";

export const UpdateProfile = () => {
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
    "updateProfileCooldown",
  );

  const form = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: "Jericho",
      nickname: "Jecoy",
      date_of_birth: new Date("2000-12-31"),
      gender: "Male",
      weight: 65,
      height: 1.7,
      physical_activity_level: "Beginner",
    },
  });

  const onSubmit = async (data: z.infer<typeof UpdateProfileSchema>) => {
    console.log("Updated Profile", data);
    // try {
    //   setLoading();
    //   const response = await ChangePasswordRequest({ token, data });
    //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay
    //
    //   if (!response?.success) {
    //     setError();
    //     setFormMessage(response?.message || "Change password failed");
    //     startCooldown(response?.retry_after || 0);
    //     return;
    //   }
    //
    //   if (response?.success) {
    //     setDone();
    //     setFormMessage("");
    //     toast({
    //       title: response?.message || "Change password successful",
    //       description: "Your password has been updated",
    //     });
    //     resetCooldown();
    //     navigate("/profile");
    //     return;
    //   }
    // } catch (error) {
    //   setError();
    //   setFormMessage("An unexpected error occurred");
    // }
  };
  return (
    <>
      <UpdateProfileForm
        status={status}
        formMessage={formMessage}
        formStatus={formStatus}
        form={form}
        onSubmit={onSubmit}
        cooldown={cooldown}
      />
    </>
  );
};
