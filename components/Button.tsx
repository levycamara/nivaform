import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PrimaryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, children, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative w-full flex items-center justify-center gap-2
        bg-niva-highlight text-black font-bold text-lg py-4 px-8 rounded-xl
        transition-all duration-300 ease-out
        active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
        shadow-[0_0_20px_rgba(251,105,0,0.3)] hover:shadow-[0_0_30px_rgba(251,105,0,0.5)]
        ${className}
      `}
    >
      <span>{children}</span>
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </button>
  );
};

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  index: number; // for staggered animation
}

export const OptionButton: React.FC<OptionButtonProps> = ({ label, selected, onClick, index }) => {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${index * 50}ms` }}
      className={`
        w-full text-left p-4 rounded-xl border-2 text-lg font-medium mb-3
        transition-all duration-300 ease-out animate-fade-in-up opacity-0 fill-mode-forwards
        flex items-center justify-between group active:scale-[0.98]
        ${selected 
          ? 'border-niva-highlight bg-niva-highlightDim text-niva-highlight shadow-[0_0_15px_rgba(251,105,0,0.15)]' 
          : 'border-niva-surface bg-niva-surface text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
        }
      `}
    >
      <span>{label}</span>
      
      {/* Visual Indicator */}
      <div className={`
        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300
        ${selected ? 'border-niva-highlight bg-niva-highlight' : 'border-zinc-600 group-hover:border-zinc-500'}
      `}>
        {selected && (
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-black stroke-current stroke-[3]">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
};