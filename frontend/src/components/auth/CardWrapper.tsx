import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import AuthHeader from "./AuthHeader";
import BackButton from "./BackButton";

interface CardWrapperProps {
  label: string;
  title: string;
  backLabel: string;
  backButtonHref: string;
  backButtonLabel: string;
  children: React.ReactNode;
}

const CardWrapper = ({
  label,
  title,
  backLabel,
  backButtonHref,
  backButtonLabel,
  children,
}: CardWrapperProps) => {
  return (
    <>
      <Card className="xl:w-1/4 md:w-1/2 shadow-md">
        <CardHeader>
          <AuthHeader label={label} title={title} />
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <BackButton
            label={backLabel}
            buttonLabel={backButtonLabel}
            href={backButtonHref}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default CardWrapper;
