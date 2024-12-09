export const variants = {
  collapsed: { height: 0, opacity: 0, overflow: "hidden" },
  expanded: {
    height: "auto",
    opacity: 1,
    overflow: "hidden",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};
