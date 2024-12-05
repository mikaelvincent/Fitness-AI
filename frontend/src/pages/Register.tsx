import RegisterForm from "@/components/authentication/forms/RegisterForm";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {RegisterSchema} from "@/utils/schema/RegisterSchema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useFormStatus from "@/hooks/useFormStatus";
import useStatus from "@/hooks/useStatus";
import {registerUser} from "@/services/auth/register";
import {z} from "zod";
import useTimer from "@/hooks/useTimer";
import {toast} from "@/hooks/use-toast";
import {validateRegistrationToken} from "@/services/auth/validateRegistrationToken";
import {useUser} from "@/hooks/context/UserContext.tsx";

const Register = () => {
    const {status, setLoading, setDone, setError} = useStatus();
    const navigate = useNavigate();
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [invalidInput, setInvalidInput] = useState<
        "none" | "name" | "password" | "others" | string
    >("none");
    const [token, setToken] = useState<string>("");
    const {loginUser: contextLoginUser} = useUser();


    // Uncomment for development and comment for protected routes
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get("token");

        if (!tokenParam) {
            navigate("/login", {replace: true});
        } else {
            setToken(tokenParam);
        }
    }, [location.search, navigate]);

    const validateToken = async () => {
        console.log("Validating token:", token);
        try {
            const response = await validateRegistrationToken(token);
            if (!response?.success && response?.valid === "invalid" && response?.status === 400) {
                navigate("/verify-email", {replace: true});
                toast({
                    title: "Invalid Token",
                    description: response?.message || "The token is invalid or expired.",
                });
            } else if (!response?.success && response?.errors) {
                toast({
                    title: "Validation Error",
                    description:
                        (response?.message ? response?.message + " " : "") +
                        (response?.errors ? response?.errors : "An error occurred during validation."),
                });
            } else {
                toast({
                    title: "You're good to go!",
                    description: "You can now proceed with registration.",
                });
            }
        } catch (error) {
            console.error("Error validating token:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred while validating the token.",
            });
        }
    };

    useEffect(() => {
        if (token) {
            validateToken();
        }
    }, [token, navigate]);

    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            password: "",
            password_confirmation: "",
        },
    });

    // Initialize the timer with a 60-second cooldown
    const {
        timeLeft: cooldown,
        start: startCooldown,
        reset: resetCooldown,
    } = useTimer(0, () => {
        // Optional: Notify the user when cooldown ends
        toast({
            title: "Cooldown Ended",
            description: "You can now resend the verification email.",
        });
    }, "registerCooldown");


    const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
        formStatus.startSubmission(data, "post", "/api/register");
        setLoading();
        try {
            // Await the registerUser call
            const response = await registerUser({...data, token});
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            if (!response?.success && response?.status === 429) {
                setInvalidInput(response?.message ? response?.message : "none");
                setError();
                setResponseMessage(response?.message || "Too many attempts. Please try again later.");
                startCooldown(response?.retry_after || 60);
            }

            if (!response?.success && response?.errors) {
                setInvalidInput(response.errorKey ? response.errorKey : "other");
                setError();
                setResponseMessage(response?.message || "Registration failed.");
            }

            if (response?.success && response?.token && response.data) {
                setDone();
                setResponseMessage(response?.message || "Registration successful!");
                toast({
                    title: "Registration Successful",
                    description: "You can are now registered.",
                });
                contextLoginUser(response.data, response.token);
                navigate("/");
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
                cooldown={cooldown}
            />
        </>
    );
};

export default Register;
