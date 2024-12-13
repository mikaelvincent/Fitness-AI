// Define the props for ExerciseTree
import { Exercise, Metric } from "@/types/exerciseTypes.ts";
import { forwardRef, Ref } from "react";
import { ExerciseSet } from "@/components/dashboard/exerciseSet/ExerciseSet.tsx";

interface ExerciseTreeProps {
  exercise: Exercise;
  exercises: Exercise[];
  isActive: boolean;
  onExpand: () => void;
  onToggle: () => void;
  toggleExerciseCompletion: (id: number) => void;
  onUpdateNotes: (notes: string) => void;
  updateExerciseNotes: (exerciseId: number, notes: string) => void;
  onAddMetric: () => void;
  addMetric: (exerciseId: number) => void;
  onUpdateMetric: (idx: number, updatedMetric: Metric) => void;
  updateMetric: (
    exerciseId: number,
    metricIndex: number,
    updatedMetric: Metric,
  ) => void;
  onDeleteMetric: (idx: number) => void;
  deleteMetric: (exerciseId: number, metricIndex: number) => void;
  onDeleteExercise: () => void;
  deleteExercise: (exerciseId: number) => void;
  activeParentId: number | null;
  activeChildId: number | null;
  onChildExpand: (childId: number, parentId: number) => void;
}

// Create the ExerciseTree component with forwardRef
const ExerciseTree = forwardRef<HTMLDivElement, ExerciseTreeProps>(
  (
    {
      exercise,
      exercises,
      isActive,
      onExpand,
      onToggle,
      toggleExerciseCompletion,
      onUpdateNotes,
      updateExerciseNotes,
      onAddMetric,
      addMetric,
      onUpdateMetric,
      updateMetric,
      onDeleteMetric,
      deleteMetric,
      onDeleteExercise,
      deleteExercise,
      activeParentId,
      activeChildId,
      onChildExpand,
    },
    ref: Ref<HTMLDivElement>,
  ) => {
    // Get the children of the current exercise
    const children = exercises.filter((e) => e.parent_id === exercise.id);

    return (
      <ExerciseSet
        ref={ref}
        exercise={exercise}
        isActive={isActive}
        onExpand={onExpand}
        onToggle={onToggle}
        onUpdateNotes={onUpdateNotes}
        onAddMetric={onAddMetric}
        onUpdateMetric={onUpdateMetric}
        onDeleteMetric={onDeleteMetric}
        onDeleteExercise={onDeleteExercise}
      >
        {children.length > 0 && isActive && (
          <div className="ml-6 border-l border-gray-600 pl-4">
            {children.map((child) => (
              <ExerciseTree
                key={child.id}
                exercise={child}
                exercises={exercises}
                isActive={activeChildId === child.id} // Check child's active state
                onExpand={() => onChildExpand(child.id, exercise.id)}
                onToggle={() => toggleExerciseCompletion(child.id)}
                toggleExerciseCompletion={toggleExerciseCompletion}
                onUpdateNotes={(notes) => updateExerciseNotes(child.id, notes)}
                updateExerciseNotes={updateExerciseNotes}
                onAddMetric={() => addMetric(child.id)}
                addMetric={addMetric}
                onUpdateMetric={(idx, updatedMetric) =>
                  updateMetric(child.id, idx, updatedMetric)
                }
                updateMetric={updateMetric}
                onDeleteMetric={(idx) => deleteMetric(child.id, idx)}
                deleteMetric={deleteMetric}
                onDeleteExercise={() => deleteExercise(child.id)}
                deleteExercise={deleteExercise}
                activeParentId={activeParentId}
                activeChildId={activeChildId}
                onChildExpand={onChildExpand}
                ref={null}
              />
            ))}
          </div>
        )}
      </ExerciseSet>
    );
  },
);

export default ExerciseTree;
