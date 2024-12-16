// components/WeekHeaderContent.tsx

import WeekHeaderContentUI from "@/components/dashboard/calendarHeader/WeekHeaderContentUI.tsx";

interface WeekHeaderContentProps {
  weekDates: Date[];
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  isAnimating: boolean;
}

const WeekHeaderContent = ({
  weekDates,
  currentDate,
  onSelectDate,
  isAnimating,
}: WeekHeaderContentProps) => {
  const isCurrentDate = (date: Date) => {
    return date.toDateString() === currentDate.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const DaysOfWeekCompleted :  =
  return (
    <WeekHeaderContentUI
      weekDates={weekDates}
      onSelectDate={onSelectDate}
      isToday={isToday}
      isCurrentDate={isCurrentDate}
      isAnimating={isAnimating}
    />
  );
};

export default WeekHeaderContent;
