// components/WeekHeaderContent.tsx

import WeekHeaderContentUI from "@/features/dashboard/components/dashboard/calendarHeader/WeekHeaderContentUI";
import { Exercise } from "@/shared/types/exerciseTypes";
import { useEffect, useState } from "react";
import { useUser } from "@/shared/hooks/context/UserContext";
import { RetrieveActivities } from "@/shared/services/exercises/RetrieveActivities";

interface WeekHeaderContentProps {
  weekDates: Date[];
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  isAnimating: boolean;
  rerender: boolean;
  setRerender: (rerender: boolean) => void;
}

const WeekHeaderContent = ({
  weekDates,
  currentDate,
  onSelectDate,
  isAnimating,
  rerender,
  setRerender,
}: WeekHeaderContentProps) => {
  const [activities, setActivities] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useUser();

  const isCurrentDate = (date: Date) => {
    return date.toDateString() === currentDate.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  useEffect(() => {
    fetchActivities().then((r) => r);
    setRerender(false);
  }, [weekDates, token, rerender]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);

    const firstDay = weekDates[0];
    const lastDay = weekDates[weekDates.length - 1];

    try {
      const response = await RetrieveActivities({
        token: token,
        date: firstDay,
        date2: lastDay,
        nested: "false",
      });

      if (response.success && response.data) {
        // Assuming response.data is an array of activities
        setActivities(response.data as Exercise[]);
      } else {
        setError(response.message || "Failed to retrieve activities.");
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Determine the completion ratio for each day
  const DaysOfWeekCompletedList = weekDates.map((date) => {
    const activitiesForDay = activities.filter(
      (activity) =>
        new Date(activity.date!).toDateString() === date.toDateString(),
    );
    if (activitiesForDay.length === 0) return 0; // No activities
    const completedActivities = activitiesForDay.filter(
      (activity) => activity.completed,
    ).length;
    return completedActivities / activitiesForDay.length; // Ratio between 0 and 1
  });

  useEffect(() => {
    console.log("DaysOfWeekCompletedList:", DaysOfWeekCompletedList);
  }, [DaysOfWeekCompletedList]);

  return (
    <WeekHeaderContentUI
      weekDates={weekDates}
      onSelectDate={onSelectDate}
      isToday={isToday}
      isCurrentDate={isCurrentDate}
      isAnimating={isAnimating}
      DaysOfWeekCompletedList={DaysOfWeekCompletedList}
    />
  );
};

export default WeekHeaderContent;
