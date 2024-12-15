import { Exercise } from "@/types/exerciseTypes.ts";

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
