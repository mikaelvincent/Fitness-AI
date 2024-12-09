import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Exercise } from "@/types/exerciseTypes";

interface ExerciseHeaderProps {
  exercise: Exercise;
  onToggle: () => void;
  onExpandToggle: () => void;
  isExpanded: boolean;
}

export function ExerciseHeader({
  exercise,
  onToggle,
  onExpandToggle,
  isExpanded,
}: ExerciseHeaderProps) {
  return (
    <div className="mb-2 flex items-center gap-3" onClick={onExpandToggle}>
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        size="icon"
        className={`h-8 w-8 rounded-full border-2 border-primary text-primary hover:bg-primary ${
          exercise.isCompleted ? "bg-primary" : ""
        }`}
        aria-label={
          exercise.isCompleted
            ? "Mark exercise as incomplete"
            : "Mark exercise as complete"
        }
      >
        <motion.span
          key={exercise.isCompleted ? "completed" : "incomplete"}
          initial={{
            rotate: exercise.isCompleted ? 0 : 180,
            scale: exercise.isCompleted ? 1 : 0.8,
            opacity: exercise.isCompleted ? 1 : 0,
          }}
          animate={{
            rotate: exercise.isCompleted ? 0 : 180,
            scale: exercise.isCompleted ? 1 : 0.8,
            opacity: exercise.isCompleted ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-block"
        >
          <Check size={20} strokeWidth={3} className="text-background" />
        </motion.span>
      </Button>
      <h3 className="flex-grow text-xl font-semibold">{exercise.name}</h3>
      <div
        className="text-primary transition-colors hover:text-orange-400"
        aria-label={
          isExpanded ? "Collapse exercise details" : "Expand exercise details"
        }
      >
        {isExpanded ? (
          <ChevronUp className="h-6 w-6" />
        ) : (
          <ChevronDown className="h-6 w-6" />
        )}
      </div>
    </div>
  );
}
