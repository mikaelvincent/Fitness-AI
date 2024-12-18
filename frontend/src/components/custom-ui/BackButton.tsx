import React from "react";
import { MdArrowBack } from "react-icons/md";

type BackButtonProps = {
    onClick?: () => void;
    className?: string;
    text?: string;
};

const BackButton: React.FC<BackButtonProps> = ({
    onClick = () => window.history.back(),
    className = "",
    text = "Back",
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center text-primary hover:text-[#FF7F32] transition-colors ${className}`}
        >
            <MdArrowBack size={24} />
            <span className="ml-2 text-sm font-medium">{text}</span>
        </button>
    );
};

export default BackButton;
