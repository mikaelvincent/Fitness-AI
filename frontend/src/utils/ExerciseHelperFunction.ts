import { Exercise } from "@/types/exerciseTypes.ts";
import { updateExerciseInTree } from "@/utils/updateExerciseInTree.ts";

export function addChildToParent(
  exercises: Exercise[],
  parentId: number | null,
  child: Exercise,
): Exercise[] {
  let updated = false; // Track if we've made an update

  const newExercises = exercises.map((ex) => {
    if (ex.id === parentId) {
      // Found the parent, add the child
      updated = true;
      return {
        ...ex,
        children: [...(ex.children || []), child],
      };
    } else if (ex.children && ex.children.length > 0) {
      // Recurse into children
      const updatedChildren = addChildToParent(ex.children, parentId, child);
      if (updatedChildren !== ex.children) {
        // Children were updated
        updated = true;
        return {
          ...ex,
          children: updatedChildren,
        };
      }
    }
    // No update for this exercise
    return ex;
  });

  // If no update was made at any level, return the original array
  // Otherwise return the new array
  return updated ? newExercises : exercises;
}

export function replaceExerciseByPosition(
  exercises: Exercise[],
  parentId: number | null | undefined,
  position: number | undefined,
  updatedExercise: Exercise,
): Exercise[] {
  let updated = false;

  const newExercises = exercises.map((ex) => {
    // Check if both the parentId and position match the target exercise
    if (ex.parent_id === parentId && ex.position === position) {
      updated = true;
      return updatedExercise;
    } else if (ex.children && ex.children.length > 0) {
      // Recurse into children to see if the target exercise is nested deeper
      const updatedChildren = replaceExerciseByPosition(
        ex.children,
        parentId,
        position,
        updatedExercise,
      );

      if (updatedChildren !== ex.children) {
        updated = true;
        return {
          ...ex,
          children: updatedChildren,
        };
      }
    }

    // No match or update at this level
    return ex;
  });

  return updated ? newExercises : exercises;
}

export function removeExerciseFromTree(
  exercises: Exercise[],
  exerciseId?: number | null,
): Exercise[] {
  return exercises
    .map((exercise) => {
      if (exercise.id === exerciseId) {
        // This exercise should be removed
        return null;
      }

      // If not matching, we recursively remove from children if there are any
      if (exercise.children && exercise.children.length > 0) {
        return {
          ...exercise,
          children: removeExerciseFromTree(exercise.children, exerciseId),
        };
      }

      return exercise;
    })
    .filter((exercise) => exercise !== null) as Exercise[];
}

// A helper function to recursively set completed on an exercise and all its descendants
export function toggleCompletionRecursive(
  exercise: Exercise,
  completed: boolean,
): Exercise {
  return {
    ...exercise,
    completed,
    children: exercise.children
      ? exercise.children.map((child) =>
          toggleCompletionRecursive(child, completed),
        )
      : [],
  };
}

// Checks if all children of an exercise are completed
export function allChildrenCompleted(exercise: Exercise): boolean {
  return (
    !exercise.children || exercise.children.every((child) => child.completed)
  );
}

// Helper function to find an exercise by ID anywhere in the tree
export function getExerciseById(
  exercises: Exercise[],
  id: number,
): Exercise | undefined {
  for (const ex of exercises) {
    if (ex.id === id) {
      return ex;
    }
    if (ex.children && ex.children.length > 0) {
      const found = getExerciseById(ex.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function getAncestorChainExercises(
  exercises: Exercise[],
  parentId: number | null | undefined,
): Exercise[] {
  if (parentId == null) return [];
  const parent = getExerciseById(exercises, parentId);
  if (!parent) return [];
  return [parent, ...getAncestorChainExercises(exercises, parent.parent_id)];
}

// Recalculates the completion state of all ancestors up the chain
export function recalculateAncestorsCompletion(
  exercises: Exercise[],
  parentId: number | null | undefined,
): Exercise[] {
  if (parentId === null || parentId === undefined) return exercises;

  const parent = getExerciseById(exercises, parentId);
  if (!parent) return exercises;

  // Check if all children of the parent are completed
  const childrenCompleted =
    parent.children?.every((child) => child.completed) ?? true;
  const updatedParent = { ...parent, completed: childrenCompleted };

  const updatedExercises = updateExerciseInTree(exercises, updatedParent);

  // Recursively move up the chain
  return recalculateAncestorsCompletion(
    updatedExercises,
    updatedParent.parent_id,
  );
}

// Helper function to flatten exercises and remove children fields
export function flattenExercises(
  exerciseOrExercises: Exercise | Exercise[],
): Exercise[] {
  const exercisesArray = Array.isArray(exerciseOrExercises)
    ? exerciseOrExercises
    : [exerciseOrExercises];

  const flattened: Exercise[] = [];

  const recurse = (exList: Exercise[]) => {
    for (const ex of exList) {
      const { children, ...rest } = ex;
      flattened.push(rest);
      if (children && children.length > 0) {
        recurse(children);
      }
    }
  };

  recurse(exercisesArray);
  return flattened;
}

export const removeExerciseById = (
  exercises: Exercise[],
  id: number,
): Exercise[] => {
  return exercises
    .filter((ex) => ex.id !== id)
    .map((ex) => ({
      ...ex,
      children: ex.children ? removeExerciseById(ex.children, id) : [],
    }));
};
