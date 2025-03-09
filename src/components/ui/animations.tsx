import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
};

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type SlideInProps = {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
  delay?: number;
  className?: string;
};

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = "up",
  duration = 0.5,
  delay = 0,
  className = "",
}) => {
  const directionMap = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 },
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type ScaleInProps = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
};

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type AnimatedListProps = {
  children: React.ReactNode[];
  staggerDelay?: number;
  itemDelay?: number;
  className?: string;
};

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  staggerDelay = 0.1,
  itemDelay = 0,
  className = "",
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: itemDelay + i * staggerDelay }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

type AnimatedPageTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

export const AnimatedPageTransition: React.FC<AnimatedPageTransitionProps> = ({
  children,
  className = "",
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

type AnimatedButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
};

type AnimatedCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  onClick,
}) => {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {children}
    </motion.div>
  );
};
