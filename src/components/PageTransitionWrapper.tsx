"use client";

/**
 * Wraps the app and applies a consistent enter/exit animation for every route change.
 * Uses pathname as key so AnimatePresence runs exit then enter on navigation.
 */
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
  },
};

const transition = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const };

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={transition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
