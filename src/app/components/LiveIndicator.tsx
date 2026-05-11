import { motion } from "motion/react";

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-2 h-2 bg-emerald-400 rounded-full"
      />
      <span className="text-xs text-muted-foreground">Live</span>
    </div>
  );
}
