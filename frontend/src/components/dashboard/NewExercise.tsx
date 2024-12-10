// frontend/src/components/dashboard/NewExercise.tsx

import { KeyboardEvent, MouseEvent, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NewExerciseProps {
  name: string;
  type: string;
  onNameChange: (name: string) => void;
  onTypeChange: (type: string) => void;
  onSave: () => void;
  onCancel: () => void;
  containerRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
}

const NewExercise = ({
  name,
  type,
  onNameChange,
  onTypeChange,
  onSave,
  onCancel,
  containerRef,
  inputRef,
}: NewExerciseProps) => {
  // Handle key events within the input
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  // Prevent click events from propagating to parent elements
  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flex gap-2 rounded border-b-2 border-b-primary p-4"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <Input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Enter workout name..."
        className="mb-2 w-full rounded px-2 py-1 text-sm"
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
      <Input
        type="text"
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        placeholder="Enter workout type..."
        className="mb-2 w-full rounded px-2 py-1 text-sm"
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
