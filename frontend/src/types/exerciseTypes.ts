// frontend/src/types/exercise/exerciseTypes.ts


// Interface for a Set in Weight Training
export interface Set {
    setNumber: number;
    reps: number;
    weightKg: number;
}

export interface Exercise {
    id: number;
    name: string;
    isCompleted: boolean;
    notes: string;
    isWeightTraining: boolean;
    numSets?: number;
    sets?: Set[];
    distanceKm?: number;
    timeSeconds?: number;
}

