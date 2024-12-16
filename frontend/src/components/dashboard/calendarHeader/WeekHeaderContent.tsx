// components/WeekHeaderContent.tsx

import WeekHeaderContentUI from "@/components/dashboard/calendarHeader/WeekHeaderContentUI.tsx";

interface WeekHeaderContentProps {
  weekDates: Date[];
  currentDate: Date;
  onSelectDate: (date: Date) => void;
}

const WeekHeaderContent = ({
  weekDates,
  currentDate,
  onSelectDate,
}: WeekHeaderContentProps) => {
  const isCurrentDate = (date: Date) => {
    return date.toDateString() === currentDate.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <WeekHeaderContentUI
      weekDates={weekDates}
      onSelectDate={onSelectDate}
      isToday={isToday}
      isCurrentDate={isCurrentDate}
    />
  );
};

export default WeekHeaderContent;
