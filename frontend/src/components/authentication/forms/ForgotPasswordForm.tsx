import CardWrapper from "../auth-ui/CardWrapper";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {ForgotPasswordSchema} from "@/utils/schema/ForgotPasswordSchema.ts";
import {UseFormStatusReturn} from "@/hooks/useFormStatus";
import AuthErrorMessage from "../auth-ui/AuthErrorMessage";
import {UseFormReturn} from "react-hook-form";
import {z} from "zod";

interface ForgotPasswordFormProps {
    status: string;
    formMessage: string;
    formStatus: UseFormStatusReturn;
    form: UseFormReturn<z.infer<typeof ForgotPasswordSchema>>;
    onSubmit: (data: z.infer<typeof ForgotPasswordSchema>) => void | Promise<void>;
}

const ForgotPasswordForm = ({
                                status,
                                formMessage,
                                formStatus,
                                form,
                                onSubmit,
                            }: ForgotPasswordFormProps) => {
    // Determine the message to display
    const getMessage = () => {
        return formMessage;
    };

    // Determine if there's a message to display
    const displayMessage = (status === "error");
    return (
        <CardWrapper
            label="Please enter your email address"
            title="Forgot Your Password?"
            backLabel="Remembered your password?"
            backButtonHref="/login"
            backButtonLabel="Go back to login"
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
                                </FormItem>
                            )}
                        />
                    </div>

                    {displayMessage && <AuthErrorMessage formMessage={getMessage()}/>}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={formStatus.pending}
                    >
                        {status === "loading" ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default ForgotPasswordForm;
