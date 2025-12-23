import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { QUESTIONS } from './constants';
import { QuestionType, Answers } from './types';
import { PrimaryButton, OptionButton } from './components/Button';
import { TextInput } from './components/TextInput';
import { ProgressBar } from './components/ProgressBar';
import { NivaLogo } from './components/Icons';
import Dashboard from './components/Dashboard';
import { maskPhone, isValidEmail, isValidPhone } from './utils/mask';
import { ChevronRight, ArrowRight, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './services/supabase';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isExiting, setIsExiting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check for admin hash
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    handleHashChange(); // initial check
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const currentQuestion = QUESTIONS[currentStepIndex];
  const totalQuestions = QUESTIONS.length - 2; // Exclude Welcome and End
  const currentProgress = Math.max(0, currentStepIndex - 1); // Start counting after welcome

  // Initialize input value if revisiting a step
  useEffect(() => {
    if (currentQuestion.type === QuestionType.INPUT_TEXT || 
        currentQuestion.type === QuestionType.INPUT_EMAIL || 
        currentQuestion.type === QuestionType.INPUT_PHONE) {
      const savedAnswer = answers[currentQuestion.id];
      setInputValue(typeof savedAnswer === 'string' ? savedAnswer : "");
    } else {
      setInputValue("");
    }
    
    // Reset scroll on step change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentStepIndex, currentQuestion, answers]);

  // SAVE DATA ON COMPLETE (Supabase + LocalStorage Backup)
  useEffect(() => {
    if (currentQuestion.type === QuestionType.END) {
       const saveData = async () => {
         const timestamp = new Date().toISOString();
         const finalData = { ...answers, timestamp };

         // 1. Always save to LocalStorage (Backup/Offline)
         try {
           const existing = JSON.parse(localStorage.getItem('niva_responses') || '[]');
           existing.push(finalData);
           localStorage.setItem('niva_responses', JSON.stringify(existing));
         } catch (e) {
           console.error("Error saving to localStorage", e);
         }

         // 2. Save to Supabase (if configured)
         if (isSupabaseConfigured()) {
           try {
             const { error } = await supabase.from('leads').insert([
               {
                 name: answers.name,
                 email: answers.email,
                 whatsapp: answers.whatsapp,
                 niva_interest: answers.niva_interest,
                 full_json: answers, // Save full raw data
                 created_at: timestamp
               }
             ]);
             if (error) console.error("Supabase Error:", error);
           } catch (err) {
             console.error("Failed to connect to Supabase", err);
           }
         }
       };

       saveData();
    }
  }, [currentQuestion.type, answers]);

  const handleNext = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    
    // Slight delay for animation
    setTimeout(() => {
      setCurrentStepIndex((prev) => Math.min(prev + 1, QUESTIONS.length - 1));
      setIsExiting(false);
    }, 300);
  }, [isExiting]);

  // Handle single select selection
  const handleSingleSelect = (value: string) => {
    if (isExiting) return;
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    
    // Auto advance for single select with a comfortable delay
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  // Handle multi select selection
  const handleMultiSelect = (value: string) => {
    const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
    let newAnswers: string[];

    if (currentAnswers.includes(value)) {
      newAnswers = currentAnswers.filter(v => v !== value);
    } else {
      if (currentQuestion.maxSelections && currentAnswers.length >= currentQuestion.maxSelections) {
        return; 
      }
      newAnswers = [...currentAnswers, value];
    }
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: newAnswers }));
  };

  // Handle input change
  const handleInputChange = (val: string) => {
    let finalVal = val;
    if (currentQuestion.type === QuestionType.INPUT_PHONE) {
      finalVal = maskPhone(val);
    }
    setInputValue(finalVal);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: finalVal }));
  };

  // Check if current step is valid to proceed
  const canProceed = useMemo(() => {
    const answer = answers[currentQuestion.id];
    
    if (currentQuestion.type === QuestionType.MULTI_SELECT) {
      return Array.isArray(answer) && answer.length > 0;
    }
    
    if (currentQuestion.type === QuestionType.INPUT_PHONE) {
      if (currentQuestion.required === false && (!answer || answer === "")) return true;
      return typeof answer === 'string' && isValidPhone(answer);
    }
    
    if (currentQuestion.type === QuestionType.INPUT_EMAIL) {
      if (currentQuestion.required === false && (!answer || answer === "")) return true;
      return typeof answer === 'string' && isValidEmail(answer);
    }

    if (currentQuestion.type === QuestionType.INPUT_TEXT) {
       if (currentQuestion.required === false) return true;
       return typeof answer === 'string' && answer.length > 0;
    }

    if (currentQuestion.type === QuestionType.SINGLE_SELECT) {
      return !!answer;
    }

    return true; // Welcome screen always true
  }, [answers, currentQuestion, inputValue]);


  // Keydown listener for Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && 
          currentQuestion.type !== QuestionType.SINGLE_SELECT && 
          currentQuestion.type !== QuestionType.WELCOME && 
          currentQuestion.type !== QuestionType.END &&
          canProceed) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canProceed, handleNext, currentQuestion]);

  if (isAdmin) {
    return <Dashboard />;
  }

  const renderWelcome = () => (
    <div className="flex flex-col items-start justify-center min-h-full px-6">
      <div className="mb-6 animate-fade-in-up">
        <NivaLogo className="w-16 h-16 shadow-[0_0_20px_rgba(251,105,0,0.3)] rounded-2xl" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {currentQuestion.title}
      </h1>
      <p className="text-xl text-niva-muted leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {currentQuestion.subtitle}
      </p>
      <div className="w-full animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <PrimaryButton onClick={handleNext}>Começar</PrimaryButton>
      </div>
    </div>
  );

  const renderEnd = () => (
    <div className="flex flex-col items-center justify-center text-center min-h-full px-6 animate-fade-in-up">
       <div className="w-20 h-20 bg-niva-highlight/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-niva-highlight">
         <Check className="w-10 h-10 text-niva-highlight" />
       </div>
      <h2 className="text-4xl font-bold mb-4">{currentQuestion.title}</h2>
      <p className="text-xl text-zinc-400 mb-12">{currentQuestion.subtitle}</p>
      
      <div className="text-sm text-zinc-600 max-w-xs mx-auto border-t border-zinc-800 pt-6">
        <p>Ao enviar este formulário, você concorda em receber comunicações do Niva via WhatsApp e email.</p>
      </div>
    </div>
  );

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case QuestionType.SINGLE_SELECT:
        return (
          <div className="w-full">
            {currentQuestion.options?.map((opt, idx) => (
              <OptionButton
                key={opt.value}
                index={idx}
                label={opt.label}
                selected={answers[currentQuestion.id] === opt.value}
                onClick={() => handleSingleSelect(opt.value)}
              />
            ))}
          </div>
        );
      case QuestionType.MULTI_SELECT:
        return (
          <div className="w-full">
            {currentQuestion.options?.map((opt, idx) => {
              const selected = (answers[currentQuestion.id] as string[])?.includes(opt.value);
              return (
                <OptionButton
                  key={opt.value}
                  index={idx}
                  label={opt.label}
                  selected={selected}
                  onClick={() => handleMultiSelect(opt.value)}
                />
              );
            })}
          </div>
        );
      case QuestionType.INPUT_TEXT:
      case QuestionType.INPUT_PHONE:
      case QuestionType.INPUT_EMAIL:
        let type: 'text' | 'tel' | 'email' = 'text';
        if (currentQuestion.type === QuestionType.INPUT_PHONE) type = 'tel';
        if (currentQuestion.type === QuestionType.INPUT_EMAIL) type = 'email';
        
        return (
          <div className="w-full pt-2">
            <TextInput 
              value={inputValue} 
              onChange={handleInputChange} 
              placeholder={currentQuestion.placeholder || 'Sua resposta...'}
              type={type}
              autoFocus
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (currentQuestion.type === QuestionType.MULTI_SELECT) {
      return (
        <PrimaryButton 
          onClick={handleNext} 
          disabled={!canProceed}
          className={canProceed ? 'opacity-100' : 'opacity-50'}
        >
          Confirmar
        </PrimaryButton>
      );
    }
    
    if (currentQuestion.type === QuestionType.INPUT_TEXT || 
        currentQuestion.type === QuestionType.INPUT_PHONE || 
        currentQuestion.type === QuestionType.INPUT_EMAIL) {
      return (
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <PrimaryButton 
            onClick={handleNext} 
            disabled={!canProceed}
            className={canProceed ? 'opacity-100' : 'opacity-50'}
          >
            Continuar
          </PrimaryButton>
          {!currentQuestion.required && !inputValue && (
            <button 
              onClick={handleNext}
              className="w-full text-zinc-500 text-sm py-2 hover:text-zinc-300 transition-colors"
            >
              Pular esta etapa (opcional)
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  const isQuestionStep = currentQuestion.type !== QuestionType.WELCOME && currentQuestion.type !== QuestionType.END;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-niva-bg text-niva-text flex flex-col overflow-hidden selection:bg-niva-highlight selection:text-black">
      
      {/* Progress Bar */}
      {isQuestionStep && (
        <ProgressBar current={currentProgress} total={totalQuestions} />
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col relative z-10 h-full">
        
        {/* Animated Page Wrapper */}
        <div 
          key={currentQuestion.id}
          className={`flex-1 flex flex-col h-full w-full transition-all duration-300 ease-out ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          
          {isQuestionStep ? (
             // Standard Question Layout (Fixed Header/Footer, Scrollable Body)
             <div className="flex flex-col h-full w-full">
                
                {/* Fixed Header */}
                <div className="px-6 pt-10 pb-4 shrink-0 z-20 bg-niva-bg/95 backdrop-blur-sm transition-all">
                   <div className="text-niva-highlight text-sm font-medium mb-4 uppercase tracking-wider animate-fade-in-up">
                      Passo {currentProgress} de {totalQuestions}
                   </div>
                   <h2 className="text-2xl md:text-3xl font-semibold mb-2 animate-fade-in-up">
                      {currentQuestion.title}
                   </h2>
                   {currentQuestion.subtitle && (
                      <p className="text-lg text-niva-muted animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        {currentQuestion.subtitle}
                      </p>
                   )}
                </div>

                {/* Scrollable Content */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-6 py-2 no-scrollbar scroll-smooth relative"
                >
                   {renderQuestionContent()}
                   {/* Spacer for footer visibility */}
                   <div className="h-32"></div>
                </div>

                {/* Fixed Footer */}
                <div className={`px-6 pb-6 pt-6 shrink-0 z-20 bg-gradient-to-t from-niva-bg via-niva-bg to-transparent ${!renderFooter() ? 'hidden' : ''}`}>
                    {renderFooter()}
                </div>

             </div>
          ) : (
             // Full Screen Layout (Welcome/End)
             <div className="flex-1 flex flex-col justify-center w-full h-full overflow-y-auto no-scrollbar">
                {currentQuestion.type === QuestionType.WELCOME && renderWelcome()}
                {currentQuestion.type === QuestionType.END && renderEnd()}
             </div>
          )}

        </div>
      </main>

      {/* Watermark Logo */}
      <div className="fixed bottom-6 right-6 z-0 opacity-20 pointer-events-none">
        <NivaLogo className="w-12 h-12 grayscale" />
      </div>
    </div>
  );
}