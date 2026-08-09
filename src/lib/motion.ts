import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export const motionConfig = {
  easePremium: [0.22, 1, 0.36, 1] as const,
  easeSoft: [0.16, 1, 0.3, 1] as const,
  durationFast: 0.2,
  durationNormal: 0.4,
  durationSlow: 0.7,
  durationHero: 1,
};

export const buttonVariants = {
  hover: {
    y: -3,
    boxShadow: "var(--shadow-gold-accent)",
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
  tap: { scale: 0.97 },
};

