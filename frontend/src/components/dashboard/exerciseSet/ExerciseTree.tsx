// Define the props for ExerciseTree
import { forwardRef, Ref, RefObject } from "react";
import { Exercise, Metric } from "@/types/exerciseTypes.ts";
import { ExerciseSet } from "@/components/dashboard/exerciseSet/ExerciseSet.tsx";
import NewExercise from "@/components/dashboard/NewExercise.tsx";

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
  onAddChildExercise: () => void;
  addChildExercise: (parentId: number) => void;
  activeParentId: number | null;
  activeChildId: number | null;
  onChildExpand: (childId: number, parentId: number) => void;
  newExercise: {
    name: string;
    type: string;
    parentId: number;
  } | null;
  handleNewExerciseNameChange: (name: string) => void;
  handleNewExerciseTypeChange: (type: string) => void;
  handleSaveNewExercise: () => void;
  handleCancelNewExercise: () => void;
  containerRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
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
      onAddChildExercise,
      addChildExercise,
      activeParentId,
      activeChildId,
      onChildExpand,
      newExercise,
      handleNewExerciseNameChange,
      handleNewExerciseTypeChange,
      handleSaveNewExercise,
      handleCancelNewExercise,
      containerRef,
      inputRef,
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
        onAddChildExercise={onAddChildExercise}
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
                onAddChildExercise={() => addChildExercise(child.id)}
                addChildExercise={addChildExercise}
                activeParentId={activeParentId}
                activeChildId={activeChildId}
                onChildExpand={onChildExpand}
                newExercise={newExercise}
                handleNewExerciseNameChange={handleNewExerciseNameChange}
                handleNewExerciseTypeChange={handleNewExerciseTypeChange}
                handleSaveNewExercise={handleSaveNewExercise}
                handleCancelNewExercise={handleCancelNewExercise}
                containerRef={containerRef}
                inputRef={inputRef}
                ref={null}
              />
            ))}
            {/* If we are adding a child exercise to this particular parent */}
            {newExercise && newExercise.parentId === exercise.id && (
              <NewExercise
                name={newExercise.name}
                type={newExercise.type}
                onNameChange={handleNewExerciseNameChange}
                onTypeChange={handleNewExerciseTypeChange}
                onSave={handleSaveNewExercise}
                onCancel={handleCancelNewExercise}
                containerRef={containerRef}
                inputRef={inputRef}
              />
            )}
          </div>
        )}
        {/* If the current node has no children yet, but we are adding one, and it's active */}
        {isActive &&
          children.length === 0 &&
          newExercise &&
          newExercise.parentId === exercise.id && (
            <NewExercise
              name={newExercise.name}
              type={newExercise.type}
              onNameChange={handleNewExerciseNameChange}
              onTypeChange={handleNewExerciseTypeChange}
              onSave={handleSaveNewExercise}
              onCancel={handleCancelNewExercise}
              containerRef={containerRef}
              inputRef={inputRef}
            />
          )}
      </ExerciseSet>
    );
  },
);

export default ExerciseTree;
