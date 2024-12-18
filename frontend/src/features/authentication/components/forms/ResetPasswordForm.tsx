import CardWrapper from "../auth-ui/CardWrapper";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { ResetPasswordSchema } from "@/shared/utils/schema/ResetPasswordSchema";
import AuthErrorMessage from "../auth-ui/AuthErrorMessage";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { UseFormStatusReturn } from "@/shared/hooks/useFormStatus";


interface ResetPasswordFormProps {
    status: string;
    formMessage: string;
    formStatus: UseFormStatusReturn;
    form: UseFormReturn<z.infer<typeof ResetPasswordSchema>>;
    onSubmit: (data: z.infer<typeof ResetPasswordSchema>) => void | Promise<void>;
    email: string;
    cooldown: number;
}

const ResetPasswordForm = ({
    status,
    formMessage,
    formStatus,
    form,
    onSubmit,
    email,
    cooldown,
}: ResetPasswordFormProps) => {
    // Determine the message to display
    const getMessage = () => {
        if (status === "error" && cooldown === 0) {
            return formMessage;
        }

        if (cooldown > 0) {
            return `Too many attempts. Please try again in ${cooldown} second${cooldown !== 1 ? "s" : ""
                }.`;
        }

        return "";
    };

    // Determine if there's a message to display
    const displayMessage =
        (status === "error" && cooldown === 0) ||
        cooldown > 0;

    return (
        <CardWrapper
            label="Please Enter Your New Password with Reset Code"
            title="Reset Password"
            backLabel="Remembered your password?"
            backButtonHref="/login"
            backButtonLabel="Go back to login"
            logo="none"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    <div className="space-y-4">
                        <FormField
                            name="email_display"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="example@email.com"
                                            defaultValue={email}
                                            value={email}
                                            readOnly
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

                    {displayMessage && <AuthErrorMessage formMessage={getMessage()} />}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={formStatus.pending || cooldown > 0}
                    >
                        {formStatus.pending
                            ? "Resetting..."
                            : cooldown > 0
                                ? `Please wait (${cooldown}s)`
                                : "Reset"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default ResetPasswordForm;
