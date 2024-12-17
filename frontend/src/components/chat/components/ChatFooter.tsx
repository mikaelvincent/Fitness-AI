import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosSend } from "react-icons/io";

interface ChatFooterProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    showInput: boolean;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ onSend, isLoading, showInput }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSend(message);
            setMessage("");
        }
    };

    if (!showInput) return null;

    return (
        <form onSubmit={handleSubmit} className="flex items-center p-4">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg px-4 py-2"
            />
            <Button
                type="submit"
                disabled={isLoading}
                className="ml-2 rounded-2xl border-2"
            >
                <IoIosSend size={20} />
            </Button>
        </form>
    );
};

export default ChatFooter;
