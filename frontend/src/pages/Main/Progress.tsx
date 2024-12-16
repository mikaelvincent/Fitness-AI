// frontend/src/pages/Progress.tsx

import { MonthViewCalendar } from "@/components/dashboard/monthView/MonthViewCalendar.tsx";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endOfMonth, format, startOfMonth } from "date-fns";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { RetrieveActivities } from "@/services/exercises/RetrieveActivities.ts";
import { useUser } from "@/hooks/context/UserContext.tsx";
import { Exercise } from "@/types/exerciseTypes.ts";

const Progress = () => {
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get("date");
  const initialDate = initialDateParam
    ? new Date(initialDateParam)
    : new Date();

  const [currentDate, setCurrentDate] = useState(initialDate);
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { token, refreshToken } = useUser();

  // Update currentDate if URL param changes
  // Update the URL when currentDate changes
  useEffect(() => {
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    window.history.replaceState(null, "", `?date=${formattedDate}`);
  }, [currentDate]);

  // Fetch activities for the current month
  useEffect(() => {
    fetchActivities().then((r) => r);
    refreshToken();
  }, [currentDate, token]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    refreshToken();

    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);

    try {
      const response = await RetrieveActivities({
        token: token,
        date: firstDay,
        date2: lastDay,
        nested: "false",
      });

      if (response.success && response.data) {
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

  // Calculate the number of days with at least one completed activity
  const completedDaysCount = useMemo(() => {
    const completedDays = new Set<string>(); // To store unique dates

    activities.forEach((activity) => {
      if (activity.completed) {
        const dateStr = new Date(activity.date!).toDateString();
        completedDays.add(dateStr);
      }
    });

    return completedDays.size;
  }, [activities]);

  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
    // Navigate to the week view route, e.g., /week/yyyy-MM-dd
    const formattedDate = format(date, "yyyy-MM-dd");
    navigate(`/?date=${formattedDate}`);
  };

  return (
    <div className="flex h-full flex-col items-center justify-start gap-4 bg-background p-8">
      <MonthViewCalendar
        initialMonth={currentDate}
        onSelectDate={handleSelectDate}
        activities={activities}
      />

      <Card className="w-full max-w-3xl border-none">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-4xl text-green-500">
            {completedDaysCount}
          </CardTitle>
          <CardDescription className="text-lg">
            Total Workouts for the Month
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Progress;
