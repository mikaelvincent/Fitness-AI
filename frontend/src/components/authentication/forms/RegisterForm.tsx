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
}

const RegisterForm = ({
                          status,
                          formMessage,
                          invalidInput,
                          formStatus,
                          form,
                          onSubmit,
                      }: RegisterFormProps) => {
    return (
        <>
            <CardWrapper
                label="Don't have an account?"
                title="Create Account"
                backLabel="Already have an account?"
                backButtonHref="/auth/login"
                backButtonLabel="Login here"
                logo="none"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                        {status == "error" && invalidInput == "name" && (
                                            <AuthErrorMessage formMessage={formMessage}/>
                                        )}
                                    </FormItem>
                                )}
                            />
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
                                        {status == "error" && invalidInput == "email" && (
                                            <AuthErrorMessage formMessage={formMessage}/>
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
                                        {status == "error" && invalidInput == "password" && (
                                            <AuthErrorMessage formMessage={formMessage}/>
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
                        {status == "error" && invalidInput == "others" && (
                            <AuthErrorMessage formMessage={formMessage}/>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={formStatus.pending}
                        >
                            {status == "loading" ? "Creating Account..." : "Register"}
                        </Button>
                    </form>
                </Form>
            </CardWrapper>
        </>
    );
};

export default RegisterForm;
