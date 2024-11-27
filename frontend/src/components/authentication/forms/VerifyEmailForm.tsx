import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {MdMarkEmailUnread} from "react-icons/md";
import AuthErrorMessage from "../auth-ui/AuthErrorMessage";
import CardWrapper from "@/components/authentication/auth-ui/CardWrapper.tsx"; // Import AuthErrorMessage if needed

interface VerifyEmailProps {
    email: any;
    handleLogin: () => void;
    handleSubmit: () => void;
    responseMessage?: string;
}

const VerifyEmailCard = ({
                             email,
                             handleLogin,
                             handleSubmit,
                             responseMessage,
                         }: VerifyEmailProps) => {
    return (
        <>
            {/*      <Card*/}
            {/*          className="xl:w-5/12 md:w-1/2 shadow-0 border-0*/}
            {/*"*/}
            {/*      >*/}
            {/*          <CardHeader className="w-full flex flex-col gap-y-4 items-center justify-center">*/}
            {/*              <MdMarkEmailUnread className="text-8xl"/>*/}

            {/*              <CardTitle className="text-3xl font-semibold text-center">*/}
            {/*                  Verify your email address*/}
            {/*              </CardTitle>*/}
            {/*          </CardHeader>*/}
            {/*          <CardContent className="flex flex-col items-center justify-center text-center">*/}
            {/*              <p className="text-lg pb-6">*/}
            {/*                  We have sent an email verification to <strong>{email}</strong>*/}
            {/*              </p>*/}
            {/*              <p className="text-muted-foreground">*/}
            {/*                  Please check your inbox or spam folder*/}
            {/*              </p>*/}
            {/*              {responseMessage && (*/}
            {/*                  <AuthErrorMessage formMessage={responseMessage}/>*/}
            {/*              )}*/}
            {/*          </CardContent>*/}
            {/*          <CardFooter className="flex flex-col justify-center">*/}
            {/*              <Button onClick={handleSubmit} className="mb-4">*/}
            {/*                  Resend Email*/}
            {/*              </Button>*/}
            {/*              <div className="flex justify-center items-center">*/}
            {/*                  <p className="text-muted-foreground text-sm">*/}
            {/*                      Did you already verify your email?*/}
            {/*                  </p>*/}
            {/*                  <Button variant="link" onClick={handleLogin} className="p-2">*/}
            {/*                      Login new Account*/}
            {/*                  </Button>*/}
            {/*              </div>*/}
            {/*          </CardFooter>*/}
            {/*      </Card>*/}
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
