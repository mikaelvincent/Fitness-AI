// frontend/src/types/exercise/exerciseTypes.ts

// Define the Metric interface
export interface Metric {
  name: string;
  value: number;
  unit: string;
}

// Update the Exercise interface with 'type' as a string
export interface Exercise {
  id?: number | null;
  date?: Date;
  parent_id?: number | null;
  name?: string;
  description?: string;
  notes?: string;
  position?: number;
  metrics?: Metric[];
  completed?: boolean;
  children?: Exercise[];
}
