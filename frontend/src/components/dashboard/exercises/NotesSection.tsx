import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import { Exercise } from "@/types/exerciseTypes";
import { Textarea } from "@/components/ui/textarea.tsx";

interface NotesSectionProps {
  exercise: Exercise;
  isEditingNotes: boolean;
  tempNotes: string;
  onEditNotes: (editing: boolean) => void;
  onTempNotesChange: (notes: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function NotesSection({
  exercise,
  isEditingNotes,
  tempNotes,
  onEditNotes,
  onTempNotesChange,
  onSave,
  onCancel,
}: NotesSectionProps) {
  return (
    <div className="flex items-center justify-between">
      {isEditingNotes ? (
        <div className="flex-grow px-2">
          <Textarea
            value={tempNotes}
            onChange={(e) => onTempNotesChange(e.target.value)}
            className="w-full rounded px-4 py-1 text-sm"
            placeholder="Add notes..."
            rows={3}
          />
        </div>
      ) : (
        <p className="text-sm">{exercise.notes}</p>
      )}
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          if (isEditingNotes) {
            onSave();
          } else {
            onEditNotes(true);
          }
        }}
        className="text-primary transition-colors hover:text-orange-400"
        aria-label={isEditingNotes ? "Save notes" : "Edit notes"}
        size="icon"
      >
        {isEditingNotes ? <Save /> : <Edit />}
      </Button>
      {isEditingNotes && (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="ml-2 text-red-500 transition-colors hover:text-red-700"
          aria-label="Cancel editing notes"
          size="icon"
        >
          <X />
        </Button>
      )}
    </div>
  );
}
