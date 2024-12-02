import {Button} from "@/components/ui/button";
import AuthErrorMessage from "../auth-ui/AuthErrorMessage";
import CardWrapper from "@/components/authentication/auth-ui/CardWrapper.tsx";
import {Input} from "@/components/ui/input.tsx"; // Import AuthErrorMessage if needed
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {UseFormStatusReturn} from "@/hooks/useFormStatus.tsx";
import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {VerifyEmailSchema} from "@/utils/schema/VerifyEmailSchema.ts";

interface VerifyEmailProps {
    status: string;
    formMessage: string;
    formStatus: UseFormStatusReturn;
    form: UseFormReturn<z.infer<typeof VerifyEmailSchema>>;
    onSubmit: (data: z.infer<typeof VerifyEmailSchema>) => void | Promise<void>;
    cooldown: number;
}

const VerifyEmailForm = ({
                             status,
                             formMessage,
                             formStatus,
                             form,
                             onSubmit,
                             cooldown,
                         }: VerifyEmailProps) => {
    return (
        <>
            <CardWrapper
                label="Don't have an account?"
                title="Enter your email for verification"
                backLabel="Already have an account?"
                backButtonHref="/login"
                backButtonLabel="Login here"
                logo="none"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 " noValidate>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="example@email.com"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                        {status == "error" && (
                                            <AuthErrorMessage formMessage={formMessage}/>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
                        {status == "error" && (
                            <AuthErrorMessage formMessage={formMessage}/>
                        )}
                        <Button
                            type="submit"
                            className="mb-4 w-full"
                            disabled={cooldown > 0 || formStatus.pending}
                        >
                            {cooldown > 0 ? `Please Wait (${cooldown}s)` : status == "loading" ? "Sending" : "Send Email"}
                        </Button>
                        {cooldown > 0 && (
                            <p className="text-sm text-muted-foreground">
                                You can resend the verification email in {cooldown} seconds.
                            </p>
                        )}
                    </form>
                </Form>
            </CardWrapper>
        </>
    );
};

export default VerifyEmailForm;
