import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import AuthHeader from "./AuthHeader";
import BackButton from "./BackButton";
import {MdMarkEmailUnread} from "react-icons/md";

interface CardWrapperProps {
    label: string;
    title: string;
    backLabel: string;
    backButtonHref: string;
    backButtonLabel: string;
    logo: "none" | "verify-email";
    children: React.ReactNode;
}

const CardWrapper = ({
                         label,
                         title,
                         backLabel,
                         backButtonHref,
                         backButtonLabel,
                         logo,
                         children,
                     }: CardWrapperProps) => {
    return (
        <>
            <Card className={`border-0 shadow-none w-10/12 md:w-1/2 lg:w-2/3`}>
                <CardHeader className="flex items-center">
                    {logo === "verify-email" && (<MdMarkEmailUnread className="text-6xl text-center md:text-8xl"/>)}
                    <AuthHeader label={label} title={title}/>
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
