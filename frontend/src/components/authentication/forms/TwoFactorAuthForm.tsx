import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { LoginSchema } from "@/utils/schema/LoginSchema";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import AuthErrorMessage from "@/components/authentication/auth-ui/AuthErrorMessage.tsx";
import { UseFormStatusReturn } from "@/hooks/useFormStatus.tsx";

interface TwoFactorAuthFormProps {
  status: string;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  onSubmit: (data: z.infer<typeof LoginSchema>) => void | Promise<void>;
  form: UseFormReturn<z.infer<typeof LoginSchema>>;
  cooldown: number;
  formStatus: UseFormStatusReturn;
  formMessage: string;
}

const TwoFactorAuthForm = ({
  status,
  isModalOpen,
  setIsModalOpen,
  onSubmit,
  form,
  cooldown,
  formStatus,
  formMessage,
}: TwoFactorAuthFormProps) => {
  const displayMessage =
    (status === "error" && cooldown === 0) ||
    cooldown > 0 ||
    status === "loading";

  const getMessage = () => {
    if (status === "error" && cooldown === 0) {
      return formMessage;
    }

    if (cooldown > 0) {
      return `Too many attempts. Please try again in ${cooldown} second${
        cooldown !== 1 ? "s" : ""
      }.`;
    }

    return "";
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Enter your Verification Code</DialogTitle>
          <DialogDescription>
            You can enter your recovery codes if you do not have access to your
            2FA
          </DialogDescription>
        </DialogHeader>
        <div className="self-center py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="two_factor_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your 2FA code"
                          maxLength={6}
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
                className="w-full"
                disabled={formStatus.pending || cooldown > 0}
              >
                {formStatus.pending
                  ? "Logging in..."
                  : cooldown > 0
                    ? `Please wait (${cooldown}s)`
                    : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthForm;
