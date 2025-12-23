export enum QuestionType {
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  INPUT_TEXT = 'INPUT_TEXT',
  INPUT_PHONE = 'INPUT_PHONE',
  INPUT_EMAIL = 'INPUT_EMAIL',
  WELCOME = 'WELCOME',
  END = 'END'
}

export interface Option {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  options?: Option[];
  placeholder?: string;
  maxSelections?: number; // For multi-select limit
  required?: boolean;
}

export type Answers = Record<string, string | string[]>;

export interface AnimationState {
  isExiting: boolean;
  direction: 'forward' | 'backward';
}