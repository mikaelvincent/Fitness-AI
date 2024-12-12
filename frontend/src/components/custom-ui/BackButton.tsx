import React from "react";
import { MdArrowBack } from "react-icons/md";

type BackButtonProps = {
    onClick?: () => void;
    className?: string;
    text?: string; // Optional custom text
};

const BackButton: React.FC<BackButtonProps> = ({
    onClick = () => window.history.back(), // Default behavior: go back in history
    className = "",
    text = "Back",
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center text-gray-500 hover:text-gray-800 transition-colors ${className}`}
        >
            <MdArrowBack size={24} />
            <span className="ml-2 text-sm font-medium">{text}</span>
        </button>
    );
};

export default BackButton;
