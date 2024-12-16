// frontend/src/components/dashboard/monthView/MonthViewCalendar.tsx

import { useMemo, useState } from "react";
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
  initialMonth?: Date;
  onSelectDate?: (date: Date) => void;
  activities: Exercise[];
}

export function MonthViewCalendar({
  initialMonth = new Date(),
  onSelectDate,
  activities,
}: MonthViewCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const goToPreviousMonth = () =>
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  const goToNextMonth = () =>
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));

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
