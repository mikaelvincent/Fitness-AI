import {useMemo} from 'react'

interface DayViewProps {
    currentDate: Date
}

interface Event {
    id: number
    title: string
    color: string
}

const DayView = ({currentDate}: DayViewProps) => {
    const events: Event[] = useMemo(() => {
        return [
            {id: 1, title: 'Morning Meeting', color: 'bg-blue-100 text-blue-800'},
            {id: 2, title: 'Lunch with Team', color: 'bg-green-100 text-green-800'},
            {id: 3, title: 'Project Review', color: 'bg-purple-100 text-purple-800'},
            {id: 4, title: 'Client Call', color: 'bg-yellow-100 text-yellow-800'},
            {id: 5, title: 'Team Building', color: 'bg-pink-100 text-pink-800'}
        ]
    }, [currentDate])

    return (
        <div className="flex-1 overflow-y-auto my-6 mx-4 sm:mx-8">
            <div className="space-y-2">
                {events.map(event => (
                    <div key={event.id} className={`${event.color} p-3 rounded-md shadow`}>
                        <div className="font-semibold">{event.title}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DayView
