export interface Set {
    number: number
    reps: number
    weight: number
}

export interface Exercise {
    id: number
    title: string
    sets: Set[]
    notes: string
    isCompleted: boolean
}