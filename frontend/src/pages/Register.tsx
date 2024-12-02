import RegisterForm from "@/components/authentication/forms/RegisterForm";
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
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [invalidInput, setInvalidInput] = useState<
        "none" | "name" | "email" | "password" | "others" | string
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
                setResponseMessage(response?.errors || response?.message || "Registration failed.");
            }

            if (response?.success && response?.token) {
                setDone();
                setResponseMessage(response?.message || "Registration successful!");
                console.log(response.token);
                // Navigate to the VerifyEmail page, passing data via state
                sessionStorage.setItem("fromRegister", "true");
                navigate("/verify-email", {state: {fromRegister: true, token: response.token, email: data.email}});
            }
        } catch (error) {
            console.error("Error during submission:", error);
            setResponseMessage("An error occurred during registration.");
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
                formMessage={responseMessage}
                invalidInput={invalidInput}
                formStatus={formStatus}
                form={form}
                onSubmit={onSubmit}
            />
        </>
    );
};

export default Register;
