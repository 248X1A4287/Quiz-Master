/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ScreenType, QuizCategory, Question, QuizResult } from './types';
import { StorageService } from './services/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { AddQuestionScreen } from './components/AddQuestionScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { FlutterStudioModal } from './components/FlutterStudioModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('Python');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [highestScore, setHighestScore] = useState<number>(0);
  const [latestResult, setLatestResult] = useState<QuizResult | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'phone' | 'wide'>('phone');
  const [flutterStudioOpen, setFlutterStudioOpen] = useState<boolean>(false);

  // Load persistent data on mount
  const refreshData = useCallback(() => {
    const loadedQuestions = StorageService.getQuestions();
    const loadedHistory = StorageService.getQuizHistory();
    const loadedHighestScore = StorageService.getBestScore();
    const settings = StorageService.getSettings();

    setQuestions(loadedQuestions);
    setHistory(loadedHistory);
    setHighestScore(loadedHighestScore);
    setSoundEnabled(settings.soundEnabled);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sound toggle
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    const settings = StorageService.getSettings();
    StorageService.saveSettings({ ...settings, soundEnabled: nextVal });
  };

  // Reset questions to built-in defaults
  const handleResetData = () => {
    if (window.confirm('Reset quiz questions to the original default question bank?')) {
      StorageService.resetDefaultQuestions();
      refreshData();
    }
  };

  // Start Quiz in category
  const handleSelectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentScreen('quiz');
  };

  // Quiz finish handler
  const handleFinishQuiz = (
    userAnswers: {
      questionId: string;
      questionText: string;
      options: [string, string, string, string];
      selectedOptionIndex: number;
      correctOptionIndex: number;
      isCorrect: boolean;
    }[]
  ) => {
    const total = userAnswers.length;
    const correct = userAnswers.filter((a) => a.isCorrect).length;
    const wrong = total - correct;
    const percentage = total > 0 ? (correct / total) * 100 : 0;

    const result: QuizResult = {
      id: `res-${Date.now()}`,
      category: selectedCategory,
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      scorePercentage: percentage,
      date: new Date().toISOString(),
      timeSpentSeconds: 0,
      userAnswers,
    };

    StorageService.saveQuizResult(result);
    setLatestResult(result);
    refreshData();
    setCurrentScreen('result');
  };

  // Add question handler
  const handleSaveQuestion = (newQ: {
    category: QuizCategory;
    questionText: string;
    options: [string, string, string, string];
    correctOptionIndex: number;
    explanation?: string;
  }) => {
    StorageService.saveQuestion(newQ);
    refreshData();
  };

  // Clear history handler
  const handleClearHistory = () => {
    StorageService.clearQuizHistory();
    refreshData();
  };

  // Filter current questions for active category
  const categoryQuestions = questions.filter(
    (q) => q.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <>
      <AndroidFrame
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenFlutterStudio={() => setFlutterStudioOpen(true)}
        onResetData={handleResetData}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      >
        {currentScreen === 'home' && (
          <HomeScreen
            questions={questions}
            highestScore={highestScore}
            onSelectCategory={handleSelectCategory}
            onNavigateAddQuestion={() => setCurrentScreen('add_question')}
            onNavigateHistory={() => setCurrentScreen('history')}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizScreen
            category={selectedCategory}
            questions={categoryQuestions}
            soundEnabled={soundEnabled}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'result' && latestResult && (
          <ResultScreen
            result={latestResult}
            soundEnabled={soundEnabled}
            onPlayAgain={() => setCurrentScreen('quiz')}
            onReturnHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'add_question' && (
          <AddQuestionScreen
            onBack={() => setCurrentScreen('home')}
            onSaveQuestion={handleSaveQuestion}
            soundEnabled={soundEnabled}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            history={history}
            highestScore={highestScore}
            onBack={() => setCurrentScreen('home')}
            onClearHistory={handleClearHistory}
          />
        )}
      </AndroidFrame>

      {/* Flutter Source Code Studio & Beginner Guide Modal */}
      <FlutterStudioModal
        isOpen={flutterStudioOpen}
        onClose={() => setFlutterStudioOpen(false)}
      />
    </>
  );
}
