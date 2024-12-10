// frontend/src/components/dashboard/monthView/MonthViewCalendar.tsx

import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold text-primary">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button variant="outline" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="text-center text-lg font-medium">
            {day}
          </div>
        ))}
        {/* Empty cells for days before the start of the month */}
        {Array.from({ length: startDate.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`flex aspect-square cursor-pointer items-center justify-center rounded-md bg-secondary text-lg font-medium transition-colors hover:bg-orange-400 ${
              isToday(day) ? "bg-primary text-white" : ""
            }`}
            onClick={() => onSelectDate && onSelectDate(day)}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
}
