import {useState} from "react";
import {useNavigate} from "react-router-dom";
import LoginForm from "@/components/authentication/forms/LoginForm";
import {LoginSchema} from "@/utils/schema/LoginSchema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useFormStatus from "@/hooks/useFormStatus";
import useStatus from "@/hooks/useStatus";
import {loginUser} from "@/services/auth/login";
import useTimer from "@/hooks/useTimer";
import {useUser} from "@/hooks/context/UserContext"; // Import useUser from UserContext
import {z} from "zod";

const Login = () => {
    const {status, setLoading, setDone, setError} = useStatus();
    const navigate = useNavigate();
    const {loginUser: contextLoginUser} = useUser(); // Destructure loginUser from UserContext
    const [formMessage, setFormMessage] = useState<string>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const formStatus = useFormStatus();

    const {
        timeLeft: cooldown,
        start: startCooldown,
        reset: resetCooldown,
    } = useTimer(
        0,
        () => {
            setFormMessage("");
            setDone();
        },
        "loginRetryTimer"
    );

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        formStatus.startSubmission(data, "post", "/api/login");
        setLoading();

        try {
            // Await the loginUser call
            const response = await loginUser(data);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            if (!response?.success && response?.status !== 429) {
                setError();
                setFormMessage(response?.message || "Login failed.");
                return;
            }

            if (!response?.success && response?.status === 429) {
                setError();
                setFormMessage(
                    response?.message || "Too many attempts. Please try again later."
                );
                const retrySeconds = response?.retry_after || 60; // Default to 60 seconds if not provided
                // Start the retry timer with the specified duration
                startCooldown(retrySeconds);
                return;
            }

            // Ensure response.success, response.token, and response.data are all present
            if (response?.success && response?.token && response.data) {
                setDone();
                setFormMessage(response?.message || "Login successful!");
                // Set user data and token in UserContext
                contextLoginUser(response.token);

                // Navigate to the dashboard
                navigate("/");
                return;
            }

        } catch (error) {
            console.error("Error during submission:", error);
            setError();
            setFormMessage("An unexpected error occurred.");
        } finally {
            formStatus.endSubmission();
        }
    };

    return (
        <>
            <LoginForm
                status={status}
                formMessage={formMessage}
                formStatus={formStatus}
                form={form}
                onSubmit={onSubmit}
                cooldown={cooldown}
            />
        </>
    );
};

export default Login;
