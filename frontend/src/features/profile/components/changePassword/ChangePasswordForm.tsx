import ProfileCardWrapper from "@/features/profile/components/ProfileCardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import AuthErrorMessage from "@/features/authentication/components/auth-ui/AuthErrorMessage";
import { Button } from "@/shared/components/ui/button";
import { UseFormStatusReturn } from "@/shared/hooks/useFormStatus";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ChangePasswordSchema } from "@/shared/utils/schema/ChangePasswordSchema";

interface ChangePasswordFormProps {
  status: string;
  formMessage: string;
  formStatus: UseFormStatusReturn;
  form: UseFormReturn<z.infer<typeof ChangePasswordSchema>>;
  onSubmit: (
    data: z.infer<typeof ChangePasswordSchema>,
  ) => void | Promise<void>;
  cooldown: number;
}

export const ChangePasswordForm = ({
  status,
  formMessage,
  formStatus,
  form,
  onSubmit,
  cooldown,
}: ChangePasswordFormProps) => {
  // Determine the message to display
  const getMessage = () => {
    if (status === "error" && cooldown <= 0) {
      return formMessage;
    }

    if (cooldown > 0) {
      return `Too many attempts. Please try again in ${cooldown} second${cooldown !== 1 ? "s" : ""
        }.`;
    }

    return "";
  };

  // Determine if there's a message to display
  const displayMessage = (status === "error" && cooldown <= 0) || cooldown > 0;

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <ProfileCardWrapper title="Change Password" backButtonHref="/profile">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="******"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="******"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="******"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {displayMessage && (
                <AuthErrorMessage formMessage={getMessage()} />
              )}
              <Button
                type="submit"
                className="mb-4 w-full"
                disabled={cooldown > 0 || formStatus.pending}
              >
                {cooldown > 0
                  ? `Please Wait (${cooldown}s)`
                  : status === "loading"
                    ? "Changing Password..."
                    : "Change Password"}
              </Button>
            </form>
          </Form>
        </ProfileCardWrapper>
      </div>
    </>
  );
};
