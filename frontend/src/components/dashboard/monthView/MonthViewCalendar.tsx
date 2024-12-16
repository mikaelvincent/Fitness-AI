// frontend/src/components/dashboard/monthView/MonthViewCalendar.tsx

import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { MonthViewCalendarUI } from "./MonthViewCalendarUI";

interface MonthViewCalendarProps {
  initialMonth?: Date;
  onSelectDate?: (date: Date) => void;
}

export function MonthViewCalendar({
  initialMonth = new Date(),
  onSelectDate,
}: MonthViewCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const goToPreviousMonth = () =>
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  const goToNextMonth = () =>
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));

  return (
    <MonthViewCalendarUI
      currentMonth={currentMonth}
      startDate={startDate}
      days={days}
      goToPreviousMonth={goToPreviousMonth}
      goToNextMonth={goToNextMonth}
      onSelectDate={onSelectDate}
    />
  );
}
