import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdMarkEmailUnread } from "react-icons/md";

interface VerifyEmailProps {
  email: string;
  handleRouteLogin: () => void;
  handleSubmit: () => void;
}

const VerifyEmailCard = ({
  email,
  handleRouteLogin,
  handleSubmit,
}: VerifyEmailProps) => {
  return (
    <>
      <Card
        className="xl:w-5/12 md:w-1/2 shadow-md m-6
      "
      >
        <CardHeader className="w-full flex flex-col gap-y-4 items-center justify-center">
          <MdMarkEmailUnread className="text-8xl" />

          <CardTitle className="text-3xl font-semibold text-center">
            Verify your email address
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center">
          <p className="text-lg pb-6">
            We have sent an email verification to <strong>{email}</strong>
          </p>
          <p className="text-muted-foreground">
            Please check your inbox or spam folder
          </p>
        </CardContent>
        <CardFooter className="flex flex-col justify-center">
          <Button onClick={handleSubmit} className="mb-4">
            Resend Email
          </Button>
          <div className="flex justify-center items-center">
            <p className="text-muted-foreground text-sm">
              Did you already verify your email?
            </p>
            <Button variant="link" onClick={handleRouteLogin} className="p-2">
              Go to Login
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default VerifyEmailCard;
