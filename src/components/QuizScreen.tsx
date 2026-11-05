import React, { useState, useEffect } from 'react';
import { QuizCategory, Question } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { SoundService } from '../services/audio';

interface QuizScreenProps {
  category: QuizCategory;
  questions: Question[];
  soundEnabled: boolean;
  onFinishQuiz: (userAnswers: {
    questionId: string;
    questionText: string;
    options: [string, string, string, string];
    selectedOptionIndex: number;
    correctOptionIndex: number;
    isCorrect: boolean;
  }[]) => void;
  onExit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  category,
  questions,
  soundEnabled,
  onFinishQuiz,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreTally, setScoreTally] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const [collectedAnswers, setCollectedAnswers] = useState<
    {
      questionId: string;
      questionText: string;
      options: [string, string, string, string];
      selectedOptionIndex: number;
      correctOptionIndex: number;
      isCorrect: boolean;
    }[]
  >([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!questions || questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#F4F7FC]">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-1">No Questions Found</h3>
        <p className="text-xs text-slate-500 mb-4 max-w-xs">
          There are currently no questions for {category}. Please add questions from the Add Question screen.
        </p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-xl bg-[#1976D2] text-white text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return; // Prevent changing after submission
    if (soundEnabled) SoundService.playClick();
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    setIsSubmitted(true);

    if (isCorrect) {
      setScoreTally((prev) => prev + 1);
      if (soundEnabled) SoundService.playCorrect();
    } else {
      if (soundEnabled) SoundService.playWrong();
    }

    setCollectedAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        questionText: currentQuestion.questionText,
        options: currentQuestion.options,
        selectedOptionIndex: selectedOption,
        correctOptionIndex: currentQuestion.correctOptionIndex,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onFinishQuiz(collectedAnswers);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC] relative">
      {/* Quiz Top Bar */}
      <div className="bg-[#1976D2] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition text-white"
            title="Leave Quiz"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-base leading-tight">{category} Quiz</h2>
            <div className="flex items-center gap-2 text-[10px] text-blue-200">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {secondsElapsed}s
              </span>
              <span>•</span>
              <span>Current Score: {scoreTally}</span>
            </div>
          </div>
        </div>

        {/* Question Counter Pill */}
        <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-100 h-1.5">
        <div
          className="bg-blue-600 h-1.5 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Quiz Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* Progress label & category tag */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-blue-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
              {progressPercent}% Complete
            </span>
          </div>

          {/* Question Text Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-2 text-blue-600 mb-2">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Multiple Choice
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
              {currentQuestion.questionText}
            </h3>
          </div>

          {/* 4 Multiple Choice Options (Screen 2 Requirement) */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((optionText, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuestion.correctOptionIndex;

              let cardStyle = 'border-slate-200 bg-white hover:border-blue-300 text-slate-800';
              let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
              let statusIcon = null;

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                  statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                } else if (isSelected && !isCorrectAnswer) {
                  cardStyle = 'border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-400';
                  badgeStyle = 'bg-rose-500 text-white border-rose-500';
                  statusIcon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                } else {
                  cardStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-70';
                  badgeStyle = 'bg-slate-200 text-slate-500 border-slate-200';
                }
              } else if (isSelected) {
                cardStyle = 'border-blue-600 bg-blue-50/80 text-blue-900 font-medium ring-2 ring-blue-500/30';
                badgeStyle = 'bg-blue-600 text-white border-blue-600';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 shadow-sm ${cardStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition ${badgeStyle}`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm">{optionText}</span>
                  </div>
                  {statusIcon}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner (when submitted) */}
          {isSubmitted && currentQuestion.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
              <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-blue-800">Explanation:</strong>
                <p className="mt-0.5 text-blue-700">{currentQuestion.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Button (Screen 2 Requirement: Next Question button & submit) */}
        <div className="pt-4 mt-2">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                selectedOption !== null
                  ? 'bg-[#1976D2] hover:bg-[#1565C0] text-white active:scale-[0.99]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Leave Quiz Confirmation Modal */}
      {showExitConfirm && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 text-base">Leave Quiz?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your current quiz progress will be lost. Are you sure you want to exit?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
              >
                Continue Quiz
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
