import React, { useState } from 'react';
import { QuizResult, QuizCategory } from '../types';
import {
  ArrowLeft,
  Trash2,
  Trophy,
  History,
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface HistoryScreenProps {
  history: QuizResult[];
  highestScore: number;
  onBack: () => void;
  onClearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  highestScore,
  onBack,
  onClearHistory,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<QuizCategory | 'All'>('All');
  const [showClearModal, setShowClearModal] = useState(false);

  const filterOptions: (QuizCategory | 'All')[] = [
    'All',
    'Python',
    'Java',
    'SQL',
    'General Knowledge',
  ];

  const filteredHistory =
    selectedFilter === 'All'
      ? history
      : history.filter((item) => item.category === selectedFilter);

  const averageScore =
    history.length === 0
      ? 0
      : Math.round(
          history.reduce((acc, curr) => acc + curr.scorePercentage, 0) / history.length
        );

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC] relative">
      {/* Top App Bar */}
      <div className="bg-[#1976D2] text-white px-4 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base leading-tight">Quiz History</h2>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition text-rose-200 hover:text-white"
            title="Clear History"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main History Scroll Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
        {/* Analytics Summary Banner */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-2xl p-4 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-200 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
              Overall Performance
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              {history.length} Quizzes Taken
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <span className="text-[10px] text-blue-200 uppercase font-semibold">
                Highest Score
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-amber-300">
                  {highestScore.toFixed(0)}%
                </span>
                <Trophy className="w-4 h-4 text-amber-300" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <span className="text-[10px] text-blue-200 uppercase font-semibold">
                Average Score
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white">{averageScore}%</span>
                <Sparkles className="w-4 h-4 text-blue-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedFilter === f
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* History Records List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2 mt-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No History Records Found</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {history.length === 0
                ? 'You have not taken any quizzes yet. Start one from the Home screen!'
                : `No quiz attempts recorded under ${selectedFilter}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredHistory.map((item) => {
              const score = Math.round(item.scorePercentage);
              let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              if (score < 50) {
                badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
              } else if (score < 75) {
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
              }

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-blue-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 font-black text-sm ${badgeColor}`}
                    >
                      <span>{score}%</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {item.category}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          {item.correctAnswers}/{item.totalQuestions} correct
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <Calendar className="w-2.5 h-2.5 text-slate-400" />
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      score >= 70
                        ? 'bg-emerald-100 text-emerald-800'
                        : score >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {score >= 70 ? 'Pass' : score >= 50 ? 'Average' : 'Fail'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Confirmation Dialog */}
      {showClearModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 text-base">Clear Quiz History?</h4>
              <p className="text-xs text-slate-500 mt-1">
                This will permanently delete all past score records from device storage.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
