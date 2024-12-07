import {motion, useMotionValue, animate} from 'framer-motion'
import {useEffect, useState} from 'react';
import {useSwipeable, SwipeableHandlers} from 'react-swipeable'
import {ReactNode} from 'react'

interface SwipableDayViewProps {
    direction: 'next' | 'prev' | null
    onNavigateDay: (direction: 'prev' | 'next') => void
    variants: {
        enter: (direction: 'next' | 'prev') => any
        center: any
        exit: (direction: 'next' | 'prev') => any
    }
    children: ReactNode
}

const SwipableDayView = ({direction, onNavigateDay, variants, children}: SwipableDayViewProps) => {
    const x = useMotionValue(0);
    const [threshold, setThreshold] = useState(50); // Default threshold

    useEffect(() => {
        const updateThreshold = () => {
            const viewportWidth = window.innerWidth;
            setThreshold(viewportWidth * 0.2); // 20% of the viewport width
        };

        updateThreshold();
        window.addEventListener('resize', updateThreshold);
        return () => window.removeEventListener('resize', updateThreshold);
    }, []);

    const handleDragEnd = () => {
        const currentX = x.get();
        if (currentX > threshold) {
            onNavigateDay('prev');
        } else if (currentX < -threshold) {
            onNavigateDay('next');
        } else {
            animate(x, 0, {duration: 0.2});
        }
    };

    // Configure useSwipeable with higher delta and velocity
    const handlers: SwipeableHandlers = useSwipeable({
        onSwipedLeft: () => onNavigateDay('next'),
        onSwipedRight: () => onNavigateDay('prev'),
        trackMouse: true,
        delta: 150, // Increase delta from default 10 to 100 pixels
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
            className="absolute top-0 left-0 w-full h-full"
        >
            {children}
        </motion.div>
    )
}

export default SwipableDayView
