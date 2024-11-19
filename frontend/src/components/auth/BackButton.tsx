import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface BackButtonProps {
  label: string;
  buttonLabel: string;
  href: string;
}

const BackButton = ({ label, buttonLabel, href }: BackButtonProps) => {
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <p className="text-muted-foreground text-normal">{label}</p>
        <Button
          variant="link"
          className="font-normal text-base"
          size="sm"
          asChild
        >
          <Link to={href}>{buttonLabel}</Link>
        </Button>
      </div>
    </>
  );
};

export default BackButton;
