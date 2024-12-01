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
import {ResetPasswordSchema} from "@/utils/schema/ResetPasswordSchema.ts";
import {UseFormStatusReturn} from "@/hooks/useFormStatus";
import AuthErrorMessage from "../auth-ui/AuthErrorMessage";
import {UseFormReturn} from "react-hook-form";
import {z} from "zod";

interface ResetPasswordFormProps {
    status: string;
    formMessage: string;
    formStatus: UseFormStatusReturn;
    form: UseFormReturn<z.infer<typeof ResetPasswordSchema>>;
    onSubmit: (data: z.infer<typeof ResetPasswordSchema>) => void | Promise<void>;
    email: string;
}

const LoginForm = ({
                       status,
                       formMessage,
                       formStatus,
                       form,
                       onSubmit,
                       email,
                   }: ResetPasswordFormProps) => {
    // Determine the message to display
    const getMessage = () => {
        return formMessage;
    };

    // Determine if there's a message to display
    const displayMessage = (status === "error");

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 " noValidate>
                    <div className="space-y-4">
                        <FormField
                            name="email_display"
                            render={({field}) => (
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="******"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="******"/>
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
                        {status === "loading" ? "Resetting..." : "Reset"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default LoginForm;
