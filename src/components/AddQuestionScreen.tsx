import React, { useState } from 'react';
import { QuizCategory } from '../types';
import { ArrowLeft, Save, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { SoundService } from '../services/audio';

interface AddQuestionScreenProps {
  onBack: () => void;
  onSaveQuestion: (newQuestion: {
    category: QuizCategory;
    questionText: string;
    options: [string, string, string, string];
    correctOptionIndex: number;
    explanation?: string;
  }) => void;
  soundEnabled: boolean;
}

export const AddQuestionScreen: React.FC<AddQuestionScreenProps> = ({
  onBack,
  onSaveQuestion,
  soundEnabled,
}) => {
  const [category, setCategory] = useState<QuizCategory>('Python');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState('');

  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: QuizCategory[] = ['Python', 'Java', 'SQL', 'General Knowledge'];

  const validate = (): boolean => {
    const errs: string[] = [];

    if (!questionText.trim()) {
      errs.push('Question text cannot be empty.');
    } else if (questionText.trim().length < 8) {
      errs.push('Question text must be at least 8 characters long.');
    }

    if (!optionA.trim()) errs.push('Option A is required.');
    if (!optionB.trim()) errs.push('Option B is required.');
    if (!optionC.trim()) errs.push('Option C is required.');
    if (!optionD.trim()) errs.push('Option D is required.');

    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      if (soundEnabled) SoundService.playWrong();
      return;
    }

    setIsSubmitting(true);
    try {
      onSaveQuestion({
        category,
        questionText: questionText.trim(),
        options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
        correctOptionIndex,
        explanation: explanation.trim() ? explanation.trim() : undefined,
      });

      if (soundEnabled) SoundService.playCorrect();
      setShowSuccessToast(true);

      // Reset form fields
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setExplanation('');
      setCorrectOptionIndex(0);
      setErrors([]);

      setTimeout(() => {
        setShowSuccessToast(false);
        onBack();
      }, 1400);
    } catch {
      setErrors(['An unexpected error occurred while saving the question.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7FC] relative">
      {/* Top App Bar */}
      <div className="bg-[#1976D2] text-white px-4 py-3.5 flex items-center gap-3 shadow-md">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-base leading-tight">Add New Question</h2>
          <span className="text-[10px] text-blue-200">Saves to local SharedPreferences</span>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs font-semibold">
            Question saved successfully! Returning to home...
          </div>
        </div>
      )}

      {/* Main Form Scroll Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
        {/* Validation Errors Box */}
        {errors.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Please resolve the following issues:</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-rose-700">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Category Dropdown */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Select Quiz Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as QuizCategory)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text Field */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Question Text *
              </label>
              <span className="text-[10px] text-slate-400">
                {questionText.length} chars
              </span>
            </div>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g., Which data structure follows First-In, First-Out (FIFO)?"
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Four Answer Options with Radio Buttons for Correct Option */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Four Answer Options *
              </label>
              <span className="text-[10px] text-blue-600 font-semibold">
                Tap radio to set correct
              </span>
            </div>

            {/* Option A */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionIndex === 0}
                  onChange={() => setCorrectOptionIndex(0)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center ${
                    correctOptionIndex === 0
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  A
                </span>
              </label>
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Option A text..."
                className="flex-1 bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Option B */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionIndex === 1}
                  onChange={() => setCorrectOptionIndex(1)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center ${
                    correctOptionIndex === 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  B
                </span>
              </label>
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Option B text..."
                className="flex-1 bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Option C */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionIndex === 2}
                  onChange={() => setCorrectOptionIndex(2)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center ${
                    correctOptionIndex === 2
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  C
                </span>
              </label>
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="Option C text..."
                className="flex-1 bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Option D */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionIndex === 3}
                  onChange={() => setCorrectOptionIndex(3)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center ${
                    correctOptionIndex === 3
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  D
                </span>
              </label>
              <input
                type="text"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                placeholder="Option D text..."
                className="flex-1 bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Explanation Field (Optional) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Explanation (Optional)
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Why is this option correct? Shown after answering."
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Live Preview Card */}
          {questionText.trim() && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Quiz Preview:</span>
              </div>
              <p className="text-xs font-semibold text-slate-900">{questionText}</p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                {[optionA, optionB, optionC, optionD].map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 ${
                      i === correctOptionIndex
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="truncate">{opt || `(Option ${String.fromCharCode(65 + i)})`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button (Screen 4 Requirement) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-md shadow-blue-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Question...' : 'Save Question Permanently'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
