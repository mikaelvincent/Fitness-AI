// components/Calendar.tsx
import {useState, useMemo} from 'react'
import {AnimatePresence} from 'framer-motion'
import SwipableWeekHeader from './SwipableWeekHeader'
import WeekHeaderContent from "@/components/dashboard/WeekHeaderContent.tsx";
import WeekHeaderNavigation from './WeekHeaderNavigation'
import SwipableDayView from './SwipableDayView'
import {isSameWeek} from '@/utils/dateUtils';
import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft} from "lucide-react"; //
import {ReactNode} from 'react'

interface CalendarProps {
    children: ReactNode
}

const Calendar = ({children}: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [dayTransitionDirection, setDayTransitionDirection] = useState<'next' | 'prev' | null>(null)
    const [weekTransitionDirection, setWeekTransitionDirection] = useState<'next' | 'prev' | null>(null)


    const weekDates = useMemo(() => {
        const dates = []
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek)
            date.setDate(startOfWeek.getDate() + i)
            dates.push(date)
        }
        return dates
    }, [currentDate])

    const weekStart = useMemo(() => {
        const start = new Date(currentDate)
        start.setHours(0, 0, 0, 0) // Normalize the time
        start.setDate(currentDate.getDate() - currentDate.getDay())
        return start
    }, [currentDate])

    const selectDate = (date: Date) => {
        if (date > currentDate) {
            setDayTransitionDirection('next');
        } else if (date < currentDate) {
            setDayTransitionDirection('prev');
        } else {
            setDayTransitionDirection(null);
        }

        // Check if the selected date is in a different week
        if (!isSameWeek(currentDate, date)) {
            const direction = date > currentDate ? 'next' : 'prev';
            setWeekTransitionDirection(direction);
        }

        setCurrentDate(date);
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        setWeekTransitionDirection(direction);
        setDayTransitionDirection(direction); // Set the day transition direction based on week navigation
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + (direction === 'next' ? 7 : -7));
            return newDate;
        });
    };

    const navigateDay = (direction: 'prev' | 'next') => {
        setDayTransitionDirection(direction);
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + (direction === 'next' ? 1 : -1));

            // Check if navigating day has crossed into a different week
            if (!isSameWeek(prevDate, newDate)) {
                setWeekTransitionDirection(direction);
            }

            return newDate;
        });
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        })
    }

    const variants = {
        enter: (direction: 'next' | 'prev') => ({
            x: direction === 'next' ? 1000 : -1000,
            opacity: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeInOut'
            }
        },
        exit: (direction: 'next' | 'prev') => ({
            x: direction === 'next' ? -1000 : 1000,
            opacity: 0,
            transition: {
                duration: 0.6,
                ease: 'easeInOut'
            }
        })
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center py-6 mx-2 sm:mx-8">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Month View"
                    className="dark:text-primary on-hover:bg-none"
                    asChild
                >
                    <ChevronLeft className="h-8 w-8 sm:14 sm:14"/>
                </Button>
                <h2 className="text-lg sm:text-2xl font-semibold dark:text-primary">
                    {formatMonthYear(currentDate)}
                </h2></div>

            <div className="bg-muted rounded-lg py-4 sm:mx-8
            ">
                {/* Navigation Buttons with Swipeable Week Header */}
                <WeekHeaderNavigation onNavigateWeek={navigateWeek}>
                    <div className="relative overflow-hidden h-10 sm:h-14">
                        <AnimatePresence
                            initial={false}
                            custom={weekTransitionDirection}
                            onExitComplete={() => setWeekTransitionDirection(null)}
                        >
                            <SwipableWeekHeader
                                key={weekStart.getTime()}
                                onNavigateWeek={navigateWeek}
                                variants={variants}
                                direction={weekTransitionDirection}
                            >
                                <WeekHeaderContent
                                    weekDates={weekDates}
                                    currentDate={currentDate}
                                    onSelectDate={selectDate}/>
                            </SwipableWeekHeader>
                        </AnimatePresence>
                    </div>
                </WeekHeaderNavigation>
            </div>
            <div className="relative flex-1 overflow-hidden mt-4">
                <AnimatePresence
                    initial={false}
                    custom={dayTransitionDirection}
                    onExitComplete={() => setDayTransitionDirection(null)}
                >
                    <SwipableDayView
                        key={currentDate.getTime()}
                        direction={dayTransitionDirection}
                        onNavigateDay={navigateDay}
                        variants={variants}
                    >
                        <div className="flex-1 overflow-y-auto p-4">
                            {children}
                        </div>
                    </SwipableDayView>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Calendar
