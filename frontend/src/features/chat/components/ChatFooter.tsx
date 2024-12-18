import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { IoIosSend } from "react-icons/io";
import { Textarea } from "@/shared/components/ui/textarea"
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
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault()
            if (message.trim()) {
                onSend(message.trim())
                setMessage("")
            }
        }
    }

    if (!showInput) return null;

    return (
        <form onSubmit={handleSubmit} className="flex items-center p-4">
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-flex-1 rounded-lg px-4 py-2"
                minRows={1}
                maxRows={5}
                onKeyDown={handleKeyDown}
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
