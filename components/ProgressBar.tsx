import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  // Normalize progress (0 to 100)
  // We exclude Welcome and End screens from the count logic visually to make it cleaner
  const progress = Math.min(100, Math.max(0, ((current) / (total)) * 100));

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
      <div 
        className="h-full bg-niva-highlight shadow-[0_0_10px_rgba(251,105,0,0.5)] transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};