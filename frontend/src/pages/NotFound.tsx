import {useNavigate} from "react-router-dom";
import CardWrapper from "@/components/authentication/auth-ui/CardWrapper.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ModeToggle} from "@/components/theme/ModeToggle.tsx";


const NotFound = () => {
    const navigate = useNavigate();

    const handleSubmit = () => {
        // route to dashboard
        navigate("/");
    }

    return (
        <>
            <div className="flex flex-col h-screen">
                <div className="flex-none flex justify-end pt-6 pr-2">
                    <ModeToggle/>
                </div>

                {/* Header for the 404 Not Found page */}
                <div className="flex-1 h-full flex justify-center items-center">
                    <CardWrapper label="This content isn't available right now" title="404 Not Found page" backLabel=""
                                 backButtonHref="" backButtonLabel="" logo="logo">
                        <div className="flex justify-center">
                            <Button onClick={handleSubmit} className="mb-4">
                                Go Back to Dashboard
                            </Button>
                        </div>

                    </CardWrapper>
                </div>
            </div>
        </>
    );
};

export default NotFound;
