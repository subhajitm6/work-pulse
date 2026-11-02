import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckSquare,
  CalendarDays,
  Clock3,
  Target,
  FolderKanban,
  ListTodo,
  ChartNoAxesCombined,
  FileText,
  CircleCheck,
  Zap,
} from 'lucide-react';

// Bounded collection of floating icons with distinct solid colors for each icon
const FLOATING_ICONS = [
  {
    Icon: CheckSquare,
    size: 32,
    top: '12%',
    left: '8%',
    duration: 18,
    delay: 0,
    x: [0, 18, -12, 0],
    y: [0, -22, 14, 0],
    rotate: [0, 8, -6, 0],
    opacity: 0.85,
    color: '#6366F1', // Indigo
  },
  {
    Icon: CalendarDays,
    size: 36,
    top: '20%',
    right: '10%',
    duration: 22,
    delay: 1.5,
    x: [0, -16, 20, 0],
    y: [0, 26, -18, 0],
    rotate: [0, -10, 8, 0],
    opacity: 0.85,
    color: '#F97316', // Orange
  },
  {
    Icon: Clock3,
    size: 28,
    top: '72%',
    left: '6%',
    duration: 16,
    delay: 3,
    x: [0, 14, -18, 0],
    y: [0, -24, 16, 0],
    rotate: [0, 12, -8, 0],
    opacity: 0.85,
    color: '#06B6D4', // Cyan
  },
  {
    Icon: Target,
    size: 40,
    top: '78%',
    right: '8%',
    duration: 24,
    delay: 0.8,
    x: [0, -22, 16, 0],
    y: [0, -28, 20, 0],
    rotate: [0, -12, 10, 0],
    opacity: 0.85,
    color: '#EF4444', // Red
  },
  {
    Icon: FolderKanban,
    size: 34,
    top: '45%',
    left: '4%',
    duration: 20,
    delay: 2,
    x: [0, 16, -14, 0],
    y: [0, 20, -22, 0],
    rotate: [0, 6, -10, 0],
    opacity: 0.85,
    color: '#10B981', // Emerald
  },
  {
    Icon: ListTodo,
    size: 30,
    top: '48%',
    right: '5%',
    duration: 19,
    delay: 4,
    x: [0, -18, 12, 0],
    y: [0, -18, 24, 0],
    rotate: [0, -8, 6, 0],
    opacity: 0.85,
    color: '#8B5CF6', // Purple
  },
  {
    Icon: ChartNoAxesCombined,
    size: 38,
    top: '8%',
    right: '28%',
    duration: 25,
    delay: 2.5,
    x: [0, 15, -20, 0],
    y: [0, 22, -16, 0],
    rotate: [0, 10, -6, 0],
    opacity: 0.85,
    color: '#3B82F6', // Blue
  },
  {
    Icon: FileText,
    size: 26,
    top: '88%',
    left: '26%',
    duration: 21,
    delay: 1.2,
    x: [0, -12, 18, 0],
    y: [0, -20, 18, 0],
    rotate: [0, -6, 8, 0],
    opacity: 0.85,
    color: '#EC4899', // Pink
  },
  {
    Icon: CircleCheck,
    size: 32,
    top: '10%',
    left: '32%',
    duration: 23,
    delay: 3.5,
    x: [0, -16, 14, 0],
    y: [0, 18, -20, 0],
    rotate: [0, 8, -8, 0],
    opacity: 0.85,
    color: '#14B8A6', // Teal
  },
  {
    Icon: Zap,
    size: 30,
    top: '84%',
    right: '30%',
    duration: 17,
    delay: 2.8,
    x: [0, 14, -16, 0],
    y: [0, -22, 18, 0],
    rotate: [0, -10, 12, 0],
    opacity: 0.9,
    color: '#EAB308', // Amber / Yellow
  },
  {
    Icon: CheckSquare,
    size: 26,
    top: '30%',
    left: '18%',
    duration: 22,
    delay: 5,
    x: [0, 10, -12, 0],
    y: [0, -14, 16, 0],
    rotate: [0, 6, -6, 0],
    opacity: 0.8,
    color: '#D946EF', // Fuchsia
  },
  {
    Icon: Clock3,
    size: 26,
    top: '64%',
    right: '20%',
    duration: 20,
    delay: 4.2,
    x: [0, -12, 10, 0],
    y: [0, 16, -14, 0],
    rotate: [0, -6, 8, 0],
    opacity: 0.8,
    color: '#84CC16', // Lime
  },
];

export function FloatingTaskIcons() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {FLOATING_ICONS.map((item, index) => {
        const {
          Icon,
          size,
          top,
          left,
          right,
          duration,
          delay,
          x,
          y,
          rotate,
          opacity,
          color,
        } = item;

        // Position style with distinct solid color
        const style = {
          position: 'absolute',
          top,
          ...(left !== undefined ? { left } : {}),
          ...(right !== undefined ? { right } : {}),
          color,
          opacity,
        };

        if (shouldReduceMotion) {
          return (
            <div
              key={index}
              style={style}
              className="drop-shadow-xs"
            >
              <Icon size={size} strokeWidth={2} />
            </div>
          );
        }

        return (
          <motion.div
            key={index}
            style={style}
            animate={{
              x,
              y,
              rotate,
              scale: [1, 1.05, 0.96, 1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className="drop-shadow-xs"
          >
            <Icon size={size} strokeWidth={2} />
          </motion.div>
        );
      })}
    </div>
  );
}

export default FloatingTaskIcons;
