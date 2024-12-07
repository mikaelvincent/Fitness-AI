// components/WeekHeaderContent.tsx
'use client'

import {Button} from "@/components/ui/button"

interface WeekHeaderContentProps {
    weekDates: Date[]
    currentDate: Date
    onSelectDate: (date: Date) => void
}

const WeekHeaderContent = ({
                               weekDates,
                               currentDate,
                               onSelectDate,
                           }: WeekHeaderContentProps) => {

    const isCurrentDate = (date: Date) => {
        return date.toDateString() === currentDate.toDateString()
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    return (
        <div className="flex-1 flex justify-between px-2 my-2">
            {weekDates.map((date, index) => (
                <div key={index} className="flex-1 flex justify-center">
                    <Button
                        variant={isCurrentDate(date) ? "default" : "ghost"}
                        className={`w-10 h-10 sm:w-14 sm:h-14 my-0 p-0 gap-0 rounded-full flex flex-col items-center justify-center ${
                            isToday(date) && !isCurrentDate(date) ? 'text-primary' : ''
                        }`}
                        onClick={() => onSelectDate(date)}
                    >
                        <span className="text-xs sm:text-lg leading-tight uppercase">
                            {date.toLocaleDateString('en-US', {weekday: 'short'}).charAt(0)}
                        </span>
                        <span
                            className={`text-xs sm:text-xl font-semibold leading-tight ${
                                isToday(date)
                                    ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center'
                                    : ''
                            }`}
                        >
                            {date.getDate()}
                        </span>
                    </Button>
                </div>
            ))}
        </div>
    )
}

export default WeekHeaderContent
