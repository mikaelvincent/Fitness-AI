// components/SwipableWeekHeader.tsx

import {motion, useMotionValue, animate} from 'framer-motion'
import {useSwipeable} from 'react-swipeable'
import {ReactNode} from 'react'

interface SwipableWeekHeaderProps {
    onNavigateWeek: (direction: 'prev' | 'next') => void
    variants: {
        enter: (direction: 'next' | 'prev') => any
        center: any
        exit: (direction: 'next' | 'prev') => any
    }
    direction: 'next' | 'prev' | null
    children: ReactNode
}

const SwipableWeekHeader = ({
                                onNavigateWeek,
                                variants,
                                direction,
                                children,
                            }: SwipableWeekHeaderProps) => {
    const x = useMotionValue(0)
    const threshold = 150

    const handleDragEnd = () => {
        const currentX = x.get()
        if (currentX > threshold) {
            onNavigateWeek('prev')
        } else if (currentX < -threshold) {
            onNavigateWeek('next')
        } else {
            animate(x, 0, {duration: 0.2})
        }
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => onNavigateWeek('next'),
        onSwipedRight: () => onNavigateWeek('prev'),
        trackMouse: true,
        delta: 100,
    })

    return (
        <motion.div
            custom={direction || 'next'}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragElastic={0.2}
            style={{x}}
            onDragEnd={handleDragEnd}
            {...handlers}
            className="w-full h-full flex items-center justify-center"
        >
            {children}
        </motion.div>
    )
}

export default SwipableWeekHeader
