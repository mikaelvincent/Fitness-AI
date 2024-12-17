// frontend/src/types/exercise/exerciseTypes.ts

export interface Exercise {
  id?: number | null;
  date?: Date;
  parent_id?: number | null;
  name?: string;
  description?: string;
  notes?: string;
  position?: number;
  // Instead of Metric[], use a dictionary of { [key: string]: string }
  metrics?: { [key: string]: string };
  completed?: boolean;
  children?: Exercise[];
}
