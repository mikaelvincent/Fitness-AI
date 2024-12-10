import { animate, motion, useMotionValue } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { SwipeableHandlers, useSwipeable } from "react-swipeable";

interface SwipableViewProps {
  direction: "next" | "prev" | null;
  onNavigate: (direction: "prev" | "next") => void;
  variants: {
    enter: (direction: "next" | "prev") => any;
    center: any;
    exit: (direction: "next" | "prev") => any;
  };
  children: ReactNode;
}

const SwipableView = ({
  direction,
  onNavigate,
  variants,
  children,
}: SwipableViewProps) => {
  const x = useMotionValue(0);
  const [threshold, setThreshold] = useState(50); // Default threshold

  useEffect(() => {
    const updateThreshold = () => {
      const viewportWidth = window.innerWidth;
      setThreshold(viewportWidth * 0.2); // 20% of the viewport width
    };

    updateThreshold();
    window.addEventListener("resize", updateThreshold);
    return () => window.removeEventListener("resize", updateThreshold);
  }, []);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX > threshold) {
      onNavigate("prev");
    } else if (currentX < -threshold) {
      onNavigate("next");
    } else {
      animate(x, 0, { duration: 0.2 });
    }
  };

  // Configure useSwipeable with higher delta and velocity
  const handlers: SwipeableHandlers = useSwipeable({
    onSwipedLeft: () => onNavigate("next"),
    onSwipedRight: () => onNavigate("prev"),
    trackMouse: true,
    delta: 150, // Increase delta from default 10 to 100 pixels
  });

  return (
    <motion.div
      custom={direction || "next"}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragElastic={0.2}
      style={{ x }}
      onDragEnd={handleDragEnd}
      {...handlers}
      className="absolute left-0 top-0 h-full w-full"
    >
      {children}
    </motion.div>
  );
};

export default SwipableView;
