import CardWrapper from "../auth-ui/CardWrapper";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {RegisterSchema} from "@/utils/schema/RegisterSchema";
import {UseFormStatusReturn} from "@/hooks/useFormStatus";
import AuthErrorMessage from "../auth-ui/AuthErrorMessage";
import {z} from "zod";
import {UseFormReturn} from "react-hook-form";

interface RegisterFormProps {
    status: string;
    formMessage: string;
    invalidInput: string;
    formStatus: UseFormStatusReturn;
    form: UseFormReturn<z.infer<typeof RegisterSchema>>;
    onSubmit: (data: z.infer<typeof RegisterSchema>) => void | Promise<void>;
    cooldown: number;
}

const RegisterForm = ({
                          status,
                          formMessage,
                          invalidInput,
                          formStatus,
                          form,
                          onSubmit,
                          cooldown,
                      }: RegisterFormProps) => {

    // Determine the message to display
    const getMessage = () => {
        if (status === "error" && cooldown <= 0) {
            return formMessage;
        }

        if (cooldown > 0) {
            return `Too many attempts. Please try again in ${cooldown} second${
                cooldown !== 1 ? "s" : ""
            }.`;
        }

        return "";
    };

    // Determine if there's a message to display
    const displayMessage =
        (status === "error" && cooldown <= 0) ||
        cooldown > 0;

    return (
        <>
            <CardWrapper
                label="Don't have an account?"
                title="Create Account"
                backLabel="Already have an account?"
                backButtonHref="/login"
                backButtonLabel="Login here"
                logo="none"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" placeholder="John Doe"/>
                                        </FormControl>
                                        <FormMessage/>
                                        {status === "error" && invalidInput === "name" && (
                                            <AuthErrorMessage formMessage={getMessage()}/>
                                        )}
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
                                            <Input {...field} type="password" placeholder="******"/>
                                        </FormControl>
                                        <FormMessage/>
                                        {displayMessage && invalidInput === "password" && (
                                            <AuthErrorMessage formMessage={getMessage()}/>
                                        )}
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
                        {displayMessage && invalidInput === "others" && (
                            <AuthErrorMessage formMessage={getMessage()}/>
                        )}
                        <Button
                            type="submit"
                            className="mb-4 w-full"
                            disabled={cooldown > 0 || formStatus.pending}
                        >
                            {cooldown > 0
                                ? `Please Wait (${cooldown}s)`
                                : status === "loading"
                                    ? "Registering..."
                                    : "Register"}
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </>
    );
};

export default RegisterForm;
