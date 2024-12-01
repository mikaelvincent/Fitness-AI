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
import {Link} from "react-router-dom";
import {LoginSchema} from "@/utils/schema/LoginSchema";
import {UseFormStatusReturn} from "@/hooks/useFormStatus";
import AuthErrorMessage from "../auth-ui/AuthErrorMessage";
import {UseFormReturn} from "react-hook-form";
import {z} from "zod";

interface LoginFormProps {
    status: string;
    formMessage: string;
    formStatus: UseFormStatusReturn;
    form: UseFormReturn<z.infer<typeof LoginSchema>>;
    onSubmit: (data: z.infer<typeof LoginSchema>) => void | Promise<void>;
    retryAfter: number | null;
}

const LoginForm = ({
                       status,
                       formMessage,
                       formStatus,
                       form,
                       onSubmit,
                       retryAfter,
                   }: LoginFormProps) => {
    // Determine the message to display
    const getMessage = () => {
        if (status === "error" && retryAfter === null) {
            return formMessage;
        }

        if (retryAfter !== null && retryAfter > 0) {
            return `Too many attempts. Please try again in ${retryAfter} second${
                retryAfter !== 1 ? "s" : ""
            }.`;
        }

        return "";
    };

    // Determine if there's a message to display
    const displayMessage =
        (status === "error" && retryAfter === null) ||
        (retryAfter !== null && retryAfter > 0);

    return (
        <CardWrapper
            label="Welcome to Fitness AI"
            title="Login"
            backLabel="Don't have an account?"
            backButtonHref="/register"
            backButtonLabel="Register here"
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
                        <FormDescription className="flex items-center justify-end w-full text-muted-foreground text-xs">
                            <Button
                                variant="link"
                                className="font-normal text-xs px-1s"
                                size="sm"
                                asChild
                            >
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </Button>
                        </FormDescription>
                    </div>

                    {displayMessage && <AuthErrorMessage formMessage={getMessage()}/>}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={formStatus.pending || !!retryAfter}
                    >
                        {status === "loading" ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default LoginForm;
