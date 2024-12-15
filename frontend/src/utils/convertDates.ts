import { Exercise } from "@/types/exerciseTypes.ts";

export function convertDates(ex: any): Exercise {
  return {
    ...ex,
    date: new Date(ex.date),
    children: ex.children ? ex.children.map(convertDates) : [],
  };
}
