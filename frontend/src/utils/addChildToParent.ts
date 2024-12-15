import { Exercise } from "@/types/exerciseTypes.ts";

export function addChildToParent(
  exercises: Exercise[],
  parentId: number | null,
  child: Exercise,
): Exercise[] {
  return exercises.map((ex) => {
    if (ex.id === parentId) {
      return {
        ...ex,
        children: [...(ex.children || []), child],
      };
    } else if (ex.children && ex.children.length > 0) {
      return {
        ...ex,
        children: addChildToParent(ex.children, parentId, child),
      };
    }
    return ex;
  });
}

export function replaceExerciseByPosition(
  exercises: Exercise[],
  position: number,
  updatedExercise: Exercise,
): Exercise[] {
  return exercises.map((ex) => {
    if (ex.position === position) {
      return updatedExercise;
    } else if (ex.children && ex.children.length > 0) {
      return {
        ...ex,
        children: replaceExerciseByPosition(
          ex.children,
          position,
          updatedExercise,
        ),
      };
    }
    return ex;
  });
}
