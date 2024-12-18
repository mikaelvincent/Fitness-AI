import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, } from "@/shared/components/ui/card";
import AuthHeader from "./AuthHeader";
import BackButton from "./BackButton";
import { MdMarkEmailUnread } from "react-icons/md";
import Logo from "@/shared/components/ui/logo";
import { useTheme } from "@/shared/components/theme/theme-provider";

interface CardWrapperProps {
    label: string;
    title: string;
    backLabel: string;
    backButtonHref: string;
    backButtonLabel: string;
    logo: "none" | "verify-email" | "logo";
    children: ReactNode;
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
    const { appliedTheme } = useTheme();
    return (
        <>
            <Card className={`border-0 shadow-none w-10/12 md:w-1/2 lg:w-2/3`}>
                <CardHeader className="flex items-center">
                    {logo === "verify-email" && (<MdMarkEmailUnread className="text-6xl text-center md:text-8xl" />)}
                    {logo === "logo" && <Logo
                        className="w-28 lg:w-60"
                        alt="Company Logo"
                        toUseTheme={appliedTheme}
                        variant="withoutText"
                    />}
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
