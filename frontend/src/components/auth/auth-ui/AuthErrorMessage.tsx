import React from "react";

interface AuthErrorMessageProps {
  formMessage: string;
}

const AuthErrorMessage = ({ formMessage }: AuthErrorMessageProps) => {
  return <p className="text-sm font-medium text-destructive">{formMessage}</p>;
};

export default AuthErrorMessage;
