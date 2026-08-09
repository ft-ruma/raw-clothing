import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { buttonVariants, motionConfig } from "@/lib/motion";
import clsx from "clsx";

export type ButtonVariant = "primary" | "light" | "outline" | "animated";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "variants"> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

/**
 * Premium button component that respects the RAW design system.
 * Uses CSS variables for colours, radius and shadows.
 * Animations are powered by Framer Motion.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...rest
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200";

  const variantClasses = {
    primary: "bg-var(--raw-black) text-var(--raw-white) rounded-[var(--radius-pill)] px-6 py-3.5",
    light: "bg-var(--raw-white) text-var(--raw-black) rounded-[var(--radius-pill)] px-6 py-3.5 border border-var(--raw-border-light)",
    outline: "bg-transparent text-var(--raw-black) rounded-[var(--radius-pill)] px-6 py-3.5 border border-[rgba(10,10,10,0.22)]",
    animated: "relative overflow-hidden rounded-[var(--radius-pill)] px-6 py-3.5 text-var(--raw-white) bg-var(--raw-black)",
  }[variant];

  // Animated fill button extra markup
  if (variant === "animated") {
    return (
      <motion.button
        className={clsx(baseClasses, variantClasses, className, "group")}
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        {...rest}
      >
        <span className="relative z-10">{children}</span>
        <span
          className="absolute inset-0 bg-var(--raw-gold) translate-x-[-101%] transition-transform duration-450 ease-[var(--ease-premium)] group-hover:translate-x-0"
          aria-hidden="true"
        ></span>
      </motion.button>
    );
  }

  return (
    <motion.button
      className={clsx(baseClasses, variantClasses, className)}
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
