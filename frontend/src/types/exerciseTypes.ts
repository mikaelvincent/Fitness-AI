// frontend/src/types/exercise/exerciseTypes.ts

// Define the Metric interface
export interface Metric {
  name: string;
  value: number;
  unit: string;
}

// Update the Exercise interface with 'type' as a string
export interface Exercise {
  id: number;
  name: string;
  type: string; // Changed from ExerciseType to string for flexibility
  isCompleted: boolean;
  notes: string;
  metrics: Metric[];
}
