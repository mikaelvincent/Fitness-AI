import RegisterForm from "@/components/auth/forms/RegisterForm";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {RegisterSchema} from "@/utils/schema/RegisterSchema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useFormStatus from "@/hooks/useFormStatus";
import useStatus from "@/hooks/useStatus";
import {registerUser} from "@/services/auth/register";
import {z} from "zod";

const Register = () => {
    const {status, setLoading, setDone, setError} = useStatus();
    const navigate = useNavigate();
    const [formMessage, setFormMessage] = useState<string>("");
    const [invalidInput, setInvalidInput] = useState<
        "none" | "name" | "email" | "password" | "others"
    >("none");

    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
        formStatus.startSubmission(data, "post", "/api/register");
        setLoading();
        try {
            // Await the registerUser call
            const response = await registerUser(data);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            if (!response?.success) {
                setInvalidInput(response?.message ? response?.message : "none");
                setError();
                setFormMessage(response?.errors || "Registration failed.");
            }

            if (response?.success && response?.data && response?.data.token) {
                setDone();
                setFormMessage(response?.message || "Registration successful!");
                console.log(response.data);
                // Navigate to the VerifyEmail page, passing data via state
                navigate("/auth/verify-email", {state: {data: response.data}});
            }
        } catch (error) {
            console.error("Error during submission:", error);
            setFormMessage("An error occurred during registration.");
            setError();
        } finally {
            formStatus.endSubmission();
        }

    };

    const formStatus = useFormStatus();
    return (
        <>
            <RegisterForm
                status={status}
                formMessage={formMessage}
                invalidInput={invalidInput}
                formStatus={formStatus}
                form={form}
                onSubmit={onSubmit}
            />
        </>
    );
};

export default Register;
