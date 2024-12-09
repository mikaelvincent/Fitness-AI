// frontend/src/components/dashboard/NewExercise.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface NewExerciseProps {
  type: "weight" | "cardio";
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
}

const NewExercise: React.FC<NewExerciseProps> = ({
  type,
  name,
  onNameChange,
  onSave,
  onCancel,
  containerRef,
  inputRef,
}) => {
  // Handle key events within the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  // Prevent click events from propagating to parent elements
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flex gap-2 rounded border-b-2 border-b-primary p-4"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Enter workout name..."
        className="mb-2 w-full rounded bg-zinc-700 px-2 py-1 text-sm"
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
      <Button
        onClick={onSave}
        className="text-primary hover:text-orange-400"
        disabled={name.trim() === ""}
        variant="ghost"
        size="sm"
        aria-label="Save Exercise"
      >
        <Save />
      </Button>
      <Button
        onClick={onCancel}
        variant="ghost"
        className="text-red-500 hover:text-red-700"
        aria-label="Cancel"
      >
        <X />
      </Button>
    </div>
  );
};

export default NewExercise;
