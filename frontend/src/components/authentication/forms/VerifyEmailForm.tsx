import {Button} from "@/components/ui/button";
import AuthErrorMessage from "../auth-ui/AuthErrorMessage";
import CardWrapper from "@/components/authentication/auth-ui/CardWrapper.tsx"; // Import AuthErrorMessage if needed

interface VerifyEmailProps {
    email: any;
    handleSubmit: () => void;
    responseMessage?: string;
}

const VerifyEmailCard = ({
                             email,
                             handleSubmit,
                             responseMessage,
                         }: VerifyEmailProps) => {
    return (
        <>
            <CardWrapper label="" title=" Verify your email address" backLabel="Did you already verify your email?"
                         backButtonHref="/auth/login"
                         backButtonLabel="Login new Account"
                         logo="verify-email">
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-lg pb-6">
                        We have sent an email verification to <strong>{email}</strong>
                    </p>
                    <p className="text-muted-foreground pb-10">
                        Please check your inbox or spam folder
                    </p>
                    {responseMessage && (
                        <AuthErrorMessage formMessage={responseMessage}/>
                    )}
                    <Button onClick={handleSubmit} className="mb-4">
                        Resend Email
                    </Button>
                </div>
            </CardWrapper>
        </>
    );
};

export default VerifyEmailCard;
