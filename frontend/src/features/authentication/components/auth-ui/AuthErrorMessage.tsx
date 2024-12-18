interface AuthErrorMessageProps {
    formMessage: string;
}

const AuthErrorMessage = ({formMessage}: AuthErrorMessageProps) => {
    return <p className="text-sm font-medium text-destructive pb-6">{formMessage}</p>;
};

export default AuthErrorMessage;
