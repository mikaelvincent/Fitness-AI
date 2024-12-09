import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface AnimateDayViewProps {
  direction: "next" | "prev" | null;
  variants: Variants; // Use Framer Motion's Variants type for compatibility
  children: ReactNode;
}

const AnimateDayView = ({
  direction,
  variants,
  children,
}: AnimateDayViewProps) => {
  return (
    <motion.div
      custom={direction || "next"}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute left-0 top-0 h-full w-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimateDayView;
