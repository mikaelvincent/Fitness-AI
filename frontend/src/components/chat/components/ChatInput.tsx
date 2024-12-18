import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosSend } from "react-icons/io";
import { Textarea } from "@/components/ui/textarea";
type ChatInputProps = {
    onSend: (message: string) => void;
    isLoading: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }
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

    return (
        <form onSubmit={handleSubmit} className="flex items-center p-4">
            <Textarea
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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

export default ChatInput;
