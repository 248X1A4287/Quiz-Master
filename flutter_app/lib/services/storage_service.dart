import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';

class StorageService {
  static const String _keyQuestions = 'quizmaster_custom_questions';
  static const String _keyHistory = 'quizmaster_quiz_history';
  static const String _keyBestScore = 'quizmaster_best_score';

  // Load stored custom questions
  static Future<List<Question>> loadCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList(_keyQuestions);
    if (jsonList == null || jsonList.isEmpty) {
      return [];
    }
    return jsonList.map((item) => Question.fromJson(item)).toList();
  }

  // Save new custom question permanently
  static Future<void> saveCustomQuestion(Question question) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = await loadCustomQuestions();
    existing.insert(0, question);
    final jsonList = existing.map((q) => q.toJson()).toList();
    await prefs.setStringList(_keyQuestions, jsonList);
  }

  // Save quiz result into history
  static Future<void> saveQuizResult(QuizResult result) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = await loadQuizHistory();
    existing.insert(0, result);
    final jsonList = existing.map((r) => r.toJson()).toList();
    await prefs.setStringList(_keyHistory, jsonList);

    // Update highest score if this attempt is greater
    final currentBest = prefs.getDouble(_keyBestScore) ?? 0.0;
    if (result.scorePercentage > currentBest) {
      await prefs.setDouble(_keyBestScore, result.scorePercentage);
    }
  }

  // Load all historical quiz results
  static Future<List<QuizResult>> loadQuizHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList(_keyHistory);
    if (jsonList == null || jsonList.isEmpty) {
      return [];
    }
    return jsonList.map((item) => QuizResult.fromJson(item)).toList();
  }

  // Fetch the overall highest score
  static Future<double> getHighestScore() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getDouble(_keyBestScore) ?? 0.0;
  }

  // Clear all history
  static Future<void> clearHistory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyHistory);
    await prefs.remove(_keyBestScore);
  }
}
