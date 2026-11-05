import React from 'react';
import { QuizCategory, Question } from '../types';
import {
  GraduationCap,
  History,
  PlusCircle,
  Trophy,
  Code,
  Coffee,
  Database,
  Globe,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface HomeScreenProps {
  questions: Question[];
  highestScore: number;
  onSelectCategory: (category: QuizCategory) => void;
  onNavigateAddQuestion: () => void;
  onNavigateHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  questions,
  highestScore,
  onSelectCategory,
  onNavigateAddQuestion,
  onNavigateHistory,
}) => {
  const categories: {
    id: QuizCategory;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    gradient: string;
    badgeBg: string;
    color: string;
  }[] = [
    {
      id: 'Python',
      title: 'Python',
      subtitle: 'Syntax, functions, lists & OOP',
      icon: <Code className="w-6 h-6 text-white" />,
      gradient: 'from-blue-600 to-sky-500',
      badgeBg: 'bg-blue-100 text-blue-700',
      color: 'text-blue-600',
    },
    {
      id: 'Java',
      title: 'Java',
      subtitle: 'Classes, JVM, inheritance & types',
      icon: <Coffee className="w-6 h-6 text-white" />,
      gradient: 'from-amber-600 to-orange-500',
      badgeBg: 'bg-amber-100 text-amber-800',
      color: 'text-amber-600',
    },
    {
      id: 'SQL',
      title: 'SQL',
      subtitle: 'Queries, JOINs, clauses & tables',
      icon: <Database className="w-6 h-6 text-white" />,
      gradient: 'from-emerald-600 to-teal-500',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      color: 'text-emerald-600',
    },
    {
      id: 'General Knowledge',
      title: 'General Knowledge',
      subtitle: 'Science, history, tech & world',
      icon: <Globe className="w-6 h-6 text-white" />,
      gradient: 'from-purple-600 to-indigo-500',
      badgeBg: 'bg-purple-100 text-purple-800',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC]">
      {/* Flutter Material AppBar */}
      <div className="bg-[#1976D2] text-white px-5 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">QuizMaster</h1>
            <span className="text-[10px] text-blue-200">Flutter • Material 3</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onNavigateHistory}
            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition text-white"
            title="Quiz History"
          >
            <History className="w-5 h-5" />
          </button>
          <button
            onClick={onNavigateAddQuestion}
            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition text-white"
            title="Add Question"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
        {/* Welcome Card with Blue Gradient & Best Score */}
        <div className="bg-gradient-to-br from-[#1976D2] to-[#0D47A1] rounded-2xl p-5 text-white shadow-lg shadow-blue-900/15 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Smart Quiz Platform</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Welcome, Student!</h2>
              <p className="text-blue-100 text-xs mt-0.5">
                Test your knowledge across core tech topics and track your progress.
              </p>
            </div>

            {/* Best Score Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3.5 py-1.5 rounded-xl">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-medium text-white">
                Highest Score: <strong className="text-amber-300 text-sm">{highestScore.toFixed(0)}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Categories Section Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Quiz Categories</h3>
            <p className="text-[11px] text-slate-500">Select a topic to start your test</p>
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {categories.length} Topics
          </span>
        </div>

        {/* Categories Grid (Screen 1 Requirement) */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const count = questions.filter((q) => q.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="bg-white rounded-2xl p-4 text-left border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 active:scale-[0.98] transition flex flex-col justify-between group h-36"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-md`}
                  >
                    {cat.icon}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                    {cat.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-slate-500">
                      {count} {count === 1 ? 'question' : 'questions'}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-600 group-hover:underline">
                      Start &rarr;
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Add Questions Prompt Card */}
        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-xs">Create Custom Questions</h4>
              <p className="text-[11px] text-slate-500">Saved permanently via local storage</p>
            </div>
          </div>
          <button
            onClick={onNavigateAddQuestion}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition active:scale-95 shrink-0"
          >
            + Add
          </button>
        </div>

        {/* Quiz History Quick Link */}
        <button
          onClick={onNavigateHistory}
          className="w-full bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm hover:bg-slate-50 text-left flex items-center justify-between text-xs text-slate-700 transition"
        >
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-slate-500" />
            <span className="font-medium">View Detailed Score History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
