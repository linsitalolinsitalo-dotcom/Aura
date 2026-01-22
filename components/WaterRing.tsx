
import React from 'react';

interface WaterRingProps {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export const WaterRing: React.FC<WaterRingProps> = ({ current, goal, size = 200, strokeWidth = 12 }) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(current / goal, 1);
  const offset = circumference - percentage * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200 dark:text-zinc-800"
        />
        {/* Progress Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="text-blue-500 transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight">{(current / 1000).toFixed(1)}L</span>
        <span className="text-sm font-medium text-slate-400">meta {(goal / 1000).toFixed(1)}L</span>
      </div>
    </div>
  );
};
