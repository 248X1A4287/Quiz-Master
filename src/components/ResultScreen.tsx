import React, { useEffect, useState } from 'react';
import { QuizResult } from '../types';
import {
  Trophy,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SoundService } from '../services/audio';

interface ResultScreenProps {
  result: QuizResult;
  soundEnabled: boolean;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  soundEnabled,
  onPlayAgain,
  onReturnHome,
}) => {
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    // If high score >= 60%, burst confetti!
    if (result.scorePercentage >= 60) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#1976D2', '#42A5F5', '#FFD700', '#4CAF50'],
        });
        if (soundEnabled) SoundService.playFanfare();
      } catch {
        // ignore
      }
    }
  }, [result.scorePercentage, soundEnabled]);

  // Performance message calculation
  const getPerformanceData = (percent: number) => {
    if (percent >= 90) {
      return {
        badge: 'Quiz Master!',
        message: `Outstanding! You have mastered ${result.category}!`,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200',
        ringColor: '#10B981',
      };
    } else if (percent >= 70) {
      return {
        badge: 'Great Job!',
        message: 'Great performance! You have a solid grasp of this topic.',
        color: 'text-blue-700',
        bg: 'bg-blue-50 border-blue-200',
        ringColor: '#1976D2',
      };
    } else if (percent >= 50) {
      return {
        badge: 'Good Effort!',
        message: 'Good effort! Review missed questions to reach the top tier.',
        color: 'text-amber-700',
        bg: 'bg-amber-50 border-amber-200',
        ringColor: '#F59E0B',
      };
    } else {
      return {
        badge: 'Keep Practicing!',
        message: 'Keep practicing! Review the materials and take the quiz again.',
        color: 'text-rose-700',
        bg: 'bg-rose-50 border-rose-200',
        ringColor: '#EF4444',
      };
    }
  };

  const perf = getPerformanceData(result.scorePercentage);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC]">
      {/* Top App Bar */}
      <div className="bg-[#1976D2] text-white px-5 py-3.5 flex items-center justify-center shadow-md">
        <h2 className="font-bold text-base tracking-wide">Quiz Results</h2>
      </div>

      {/* Main Results Scroll Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
        {/* Trophy & Category Title */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {result.category} Assessment
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-0.5">{perf.badge}</h3>
        </div>

        {/* Circular Percentage Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div className="relative inline-flex items-center justify-center mb-2">
            {/* SVG Circular Meter */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="58"
                stroke="#E2E8F0"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="58"
                stroke={perf.ringColor}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 58}
                strokeDashoffset={
                  2 * Math.PI * 58 * (1 - result.scorePercentage / 100)
                }
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900">
                {Math.round(result.scorePercentage)}%
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Accuracy
              </span>
            </div>
          </div>

          {/* Motivational Message */}
          <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed font-medium ${perf.bg} ${perf.color}`}>
            {perf.message}
          </div>
        </div>

        {/* 3 Metric Summary Cards (Screen 3 Requirement: Total, Correct, Wrong) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Total Questions */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 text-center shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-slate-800">{result.totalQuestions}</span>
            <p className="text-[10px] text-slate-500 font-medium">Total</p>
          </div>

          {/* Correct Answers */}
          <div className="bg-white rounded-2xl p-3 border border-emerald-100 text-center shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-emerald-600">{result.correctAnswers}</span>
            <p className="text-[10px] text-slate-500 font-medium">Correct</p>
          </div>

          {/* Wrong Answers */}
          <div className="bg-white rounded-2xl p-3 border border-rose-100 text-center shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-1">
              <XCircle className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-rose-600">{result.wrongAnswers}</span>
            <p className="text-[10px] text-slate-500 font-medium">Wrong</p>
          </div>
        </div>

        {/* Review Answers Accordion */}
        {result.userAnswers && result.userAnswers.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  Detailed Answer Review ({result.userAnswers.length} items)
                </span>
              </div>
              {showReview ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showReview && (
              <div className="p-3.5 border-t border-slate-100 space-y-3 bg-slate-50/50">
                {result.userAnswers.map((ua, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-800">
                        {index + 1}. {ua.questionText}
                      </span>
                      {ua.isCorrect ? (
                        <span className="shrink-0 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          Correct
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                          Incorrect
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                      <div>
                        Your answer:{' '}
                        <span
                          className={`font-semibold ${
                            ua.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {ua.options[ua.selectedOptionIndex]}
                        </span>
                      </div>
                      {!ua.isCorrect && (
                        <div className="text-emerald-700 font-medium">
                          Correct answer: {ua.options[ua.correctOptionIndex]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons (Screen 3 Requirement: Play Again & Return to Home) */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-md shadow-blue-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onReturnHome}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-[#1976D2] border border-blue-300 shadow-xs active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
