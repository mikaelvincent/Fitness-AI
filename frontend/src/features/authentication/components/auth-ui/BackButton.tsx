import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

interface BackButtonProps {
    label: string;
    buttonLabel: string;
    href: string;
}

const BackButton = ({ label, buttonLabel, href }: BackButtonProps) => {
    return (
        <>
            <div className="flex items-center justify-center w-full flex-col lg:flex-row">
                <p className="text-muted-foreground text-sm">{label}</p>
                <Button variant="link" className="font-normal" size="sm" asChild>
                    <Link to={href}>{buttonLabel}</Link>
                </Button>
            </div>
        </>
    );
};

export default BackButton;
