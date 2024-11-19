import React from "react";
import CardWrapper from "./CardWrapper";

const LoginForm = () => {
  return (
    <>
      <CardWrapper
        label="Welcome to Fitness AI"
        title="Login"
        backLabel="Don't have an account?"
        backButtonHref="/signup"
        backButtonLabel="Sign up"
      ></CardWrapper>
    </>
  );
};

export default LoginForm;
