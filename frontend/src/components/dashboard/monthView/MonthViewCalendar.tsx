import { useMemo } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { MonthViewCalendarUI } from "./MonthViewCalendarUI";
import { Exercise } from "@/types/exerciseTypes.ts";

interface MonthViewCalendarProps {
  currentMonth: Date;
  onSelectDate?: (date: Date) => void;
  onMonthChange?: (newMonth: Date) => void;
  activities: Exercise[];
}

export function MonthViewCalendar({
  currentMonth,
  onSelectDate,
  onMonthChange,
  activities,
}: MonthViewCalendarProps) {
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const goToPreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    onMonthChange && onMonthChange(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    onMonthChange && onMonthChange(newMonth);
  };

  // Calculate completion ratio for each day
  const completionRatios = useMemo(() => {
    return days.map((day) => {
      const activitiesForDay = activities.filter(
        (activity) =>
          new Date(activity.date!).toDateString() === day.toDateString(),
      );
      if (activitiesForDay.length === 0) return 0; // No activities
      const completedActivities = activitiesForDay.filter(
        (activity) => activity.completed,
      ).length;
      return completedActivities / activitiesForDay.length; // Ratio between 0 and 1
    });
  }, [activities, days]);

  return (
    <MonthViewCalendarUI
      currentMonth={currentMonth}
      startDate={startDate}
      days={days}
      goToPreviousMonth={goToPreviousMonth}
      goToNextMonth={goToNextMonth}
      onSelectDate={onSelectDate}
      completionRatios={completionRatios}
    />
  );
}
