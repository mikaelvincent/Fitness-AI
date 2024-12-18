export interface Exercise {
  id?: number | null;
  date?: Date;
  parent_id?: number | null;
  name?: string;
  description?: string;
  notes?: string;
  position?: number;
  metrics?: { [key: string]: string };
  completed?: boolean;
  children?: Exercise[];
}
