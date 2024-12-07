// Base interface for all exercises
export interface ExerciseBase {
    id: number;
    name: string;
    isCompleted: boolean;
    notes: string;
}

// Interface for a Set in Weight Training
export interface Set {
    setNumber: number;
    reps: number;
    weightKg: number;
}

// Interface for Weight Training Exercises
export interface WeightTrainingExercise extends ExerciseBase {
    type: 'weight_training'; // Discriminant for the union
    isWeightTraining: boolean;
    numSets: number;
    sets: Set[];
}

// Interface for Cardio Exercises
export interface CardioExercise extends ExerciseBase {
    type: 'cardio'; // Discriminant for the union
    isCardio: boolean;
    distanceKm?: number; // Optional, as not all cardio exercises have distance
    timeSeconds?: number; // Optional, as not all cardio exercises have time
}

// Union type for all possible exercises
export type Exercise = WeightTrainingExercise | CardioExercise;

// Interface for Workout Data (Weight Training Endpoint)
export interface WeightTrainingData {
    userId: number;
    date: string; // ISO date string, e.g., "2024-12-08"
    restDay: boolean;
    isWeightTraining: boolean;
    exercises: WeightTrainingExercise[];
}

// Interface for Workout Data (Cardio Endpoint)
export interface CardioData {
    userId: number;
    date: string; // ISO date string, e.g., "2024-12-09"
    restDay: boolean;
    isWeightTraining: boolean;
    isCardio: boolean;
    exercises: CardioExercise[];
}

// Interface for Rest Day Data
export interface RestDayData {
    userId: number;
    date: string; // ISO date string, e.g., "2024-12-07"
    restDay: boolean;
    isWeightTraining: boolean;
    isCardio: boolean;
    exercises: []; // No exercises on rest days
}

// Union type for all possible workout data
export type WorkoutData = WeightTrainingData | CardioData | RestDayData;
