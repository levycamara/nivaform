import React, { useRef, useEffect } from 'react';

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type?: 'text' | 'email' | 'tel';
  autoFocus?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder, type = 'text', autoFocus }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
    }
  }, [autoFocus]);

  return (
    <div className="w-full relative animate-fade-in-up">
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full bg-transparent border-b-2 border-zinc-700 text-3xl sm:text-4xl 
          py-4 text-niva-text placeholder-zinc-600 focus:outline-none focus:border-niva-highlight
          transition-colors duration-300
        `}
      />
    </div>
  );
};