// Define the props for ExerciseTree
import { forwardRef, Ref, RefObject } from "react";
import { Exercise, Metric } from "@/types/exerciseTypes.ts";
import { ExerciseSet } from "@/components/dashboard/exerciseSet/ExerciseSet.tsx";
import NewExercise from "@/components/dashboard/NewExercise.tsx";

interface ExerciseTreeProps {
  exercise: Exercise;
  exercises: Exercise[];
  expandedNodes: Map<number | null | undefined, number>;
  onToggleExpansion: (id: number, parentId: number | null | undefined) => void;
  parentId: number | null | undefined;
  onToggle: () => void;
  toggleExerciseCompletion: (id: number | null | undefined) => void;
  onUpdateNotes: (notes: string) => void;
  updateExerciseNotes: (
    exerciseId: number | null | undefined,
    notes: string,
  ) => void;
  onAddMetric: () => void;
  addMetric: (exerciseId: number | null | undefined) => void;
  onUpdateMetric: (idx: number, updatedMetric: Metric) => void;
  updateMetric: (
    exerciseId: number | null | undefined,
    metricIndex: number,
    updatedMetric: Metric,
  ) => void;
  onDeleteMetric: (idx: number) => void;
  deleteMetric: (
    exerciseId: number | null | undefined,
    metricIndex: number,
  ) => void;
  onDeleteExercise: () => void;
  deleteExercise: (exerciseId: number | null | undefined) => void;
  onAddChildExercise: () => void;
  addChildExercise: (parentId: number | null | undefined) => void;
  newExercise: {
    name: string;
    type: string;
    parentId: number | null;
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
      expandedNodes,
      onToggleExpansion,
      parentId,
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
    const children = exercise.children || [];
    const isExpanded =
      typeof exercise.id === "number" &&
      typeof parentId === "number" &&
      expandedNodes.get(parentId) === exercise.id;

    return (
      <ExerciseSet
        ref={ref}
        exercise={exercise}
        isActive={isExpanded}
        onExpand={() => {
          if (typeof exercise.id === "number") {
            onToggleExpansion(exercise.id, parentId);
          }
        }}
        onToggle={onToggle}
        onUpdateNotes={onUpdateNotes}
        onAddMetric={onAddMetric}
        onUpdateMetric={onUpdateMetric}
        onDeleteMetric={onDeleteMetric}
        onDeleteExercise={onDeleteExercise}
        onAddChildExercise={onAddChildExercise}
      >
        {children.length > 0 && isExpanded && (
          <div className="ml-6 border-l border-gray-600 pl-4">
            {children.map((child) => (
              <ExerciseTree
                key={child.id}
                exercise={child}
                exercises={exercises}
                expandedNodes={expandedNodes}
                parentId={exercise.id}
                onToggleExpansion={onToggleExpansion}
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
        {isExpanded &&
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
