import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';
import '../services/storage_service.dart';

class QuizProvider with ChangeNotifier {
  // Available Categories
  static const List<String> categories = [
    'Python',
    'Java',
    'SQL',
    'General Knowledge',
  ];

  // State
  List<Question> _allQuestions = [];
  List<Question> _currentQuizQuestions = [];
  int _currentQuestionIndex = 0;
  int? _selectedAnswerIndex;
  bool _isAnswerSubmitted = false;
  int _correctAnswers = 0;
  int _wrongAnswers = 0;
  double _highestScore = 0.0;
  List<QuizResult> _history = [];
  String _selectedCategory = 'Python';
  bool _isLoading = false;

  // Getters
  List<Question> get allQuestions => _allQuestions;
  List<Question> get currentQuizQuestions => _currentQuizQuestions;
  int get currentQuestionIndex => _currentQuestionIndex;
  int? get selectedAnswerIndex => _selectedAnswerIndex;
  bool get isAnswerSubmitted => _isAnswerSubmitted;
  int get correctAnswers => _correctAnswers;
  int get wrongAnswers => _wrongAnswers;
  double get highestScore => _highestScore;
  List<QuizResult> get history => _history;
  String get selectedCategory => _selectedCategory;
  bool get isLoading => _isLoading;

  Question? get currentQuestion {
    if (_currentQuizQuestions.isEmpty ||
        _currentQuestionIndex >= _currentQuizQuestions.length) {
      return null;
    }
    return _currentQuizQuestions[_currentQuestionIndex];
  }

  double get progress {
    if (_currentQuizQuestions.isEmpty) return 0.0;
    return (_currentQuestionIndex + 1) / _currentQuizQuestions.length;
  }

  bool get isLastQuestion {
    return _currentQuestionIndex == _currentQuizQuestions.length - 1;
  }

  // Initialize data on app startup
  Future<void> init() async {
    _isLoading = true;
    notifyListeners();

    _loadDefaultQuestions();
    final customQuestions = await StorageService.loadCustomQuestions();
    _allQuestions.addAll(customQuestions);

    _highestScore = await StorageService.getHighestScore();
    _history = await StorageService.loadQuizHistory();

    _isLoading = false;
    notifyListeners();
  }

  // Start a new quiz for given category
  void startQuiz(String category) {
    _selectedCategory = category;
    _currentQuizQuestions = _allQuestions
        .where((q) => q.category.toLowerCase() == category.toLowerCase())
        .toList();

    _currentQuestionIndex = 0;
    _selectedAnswerIndex = null;
    _isAnswerSubmitted = false;
    _correctAnswers = 0;
    _wrongAnswers = 0;

    notifyListeners();
  }

  // Select an answer option (prevent multiple submissions)
  void selectAnswer(int index) {
    if (_isAnswerSubmitted) return; // Prevent changing after submission
    _selectedAnswerIndex = index;
    notifyListeners();
  }

  // Submit and verify answer
  void submitAnswer() {
    if (_selectedAnswerIndex == null || _isAnswerSubmitted) return;

    _isAnswerSubmitted = true;
    final q = currentQuestion!;
    if (_selectedAnswerIndex == q.correctOptionIndex) {
      _correctAnswers++;
    } else {
      _wrongAnswers++;
    }
    notifyListeners();
  }

  // Advance to next question or finalize
  bool nextQuestion() {
    if (_currentQuestionIndex < _currentQuizQuestions.length - 1) {
      _currentQuestionIndex++;
      _selectedAnswerIndex = null;
      _isAnswerSubmitted = false;
      notifyListeners();
      return true; // Still has questions
    }
    return false; // Quiz completed
  }

  // Save completed quiz result
  Future<QuizResult> finishQuiz() async {
    final total = _currentQuizQuestions.length;
    final percentage = total == 0 ? 0.0 : (_correctAnswers / total) * 100;

    final result = QuizResult(
      id: const Uuid().v4(),
      category: _selectedCategory,
      totalQuestions: total,
      correctAnswers: _correctAnswers,
      wrongAnswers: _wrongAnswers,
      scorePercentage: percentage,
      timestamp: DateTime.now(),
    );

    await StorageService.saveQuizResult(result);
    if (percentage > _highestScore) {
      _highestScore = percentage;
    }
    _history.insert(0, result);
    notifyListeners();
    return result;
  }

  // Add custom question and persist
  Future<void> addQuestion({
    required String category,
    required String questionText,
    required List<String> options,
    required int correctOptionIndex,
    String? explanation,
  }) async {
    final newQuestion = Question(
      id: const Uuid().v4(),
      category: category,
      questionText: questionText,
      options: options,
      correctOptionIndex: correctOptionIndex,
      explanation: explanation,
      isCustom: true,
    );

    _allQuestions.insert(0, newQuestion);
    await StorageService.saveCustomQuestion(newQuestion);
    notifyListeners();
  }

  // Clear history
  Future<void> clearHistory() async {
    await StorageService.clearHistory();
    _history = [];
    _highestScore = 0.0;
    notifyListeners();
  }

  // Built-in starter questions
  void _loadDefaultQuestions() {
    _allQuestions = [
      // Python
      Question(
        id: 'def-py-1',
        category: 'Python',
        questionText: 'What is the correct file extension for Python files?',
        options: ['.pyth', '.pt', '.py', '.pyt'],
        correctOptionIndex: 2,
        explanation: 'Python script files typically end with .py.',
      ),
      Question(
        id: 'def-py-2',
        category: 'Python',
        questionText: 'Which keyword is used to create a function in Python?',
        options: ['function', 'def', 'fun', 'define'],
        correctOptionIndex: 1,
        explanation: 'The def keyword introduces a function definition in Python.',
      ),
      Question(
        id: 'def-py-3',
        category: 'Python',
        questionText: 'Which data type is immutable in Python?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        correctOptionIndex: 3,
        explanation: 'Tuples cannot be altered once instantiated in Python.',
      ),
      Question(
        id: 'def-py-4',
        category: 'Python',
        questionText: 'How do you insert comments in Python code?',
        options: ['// comment', '/* comment */', '# comment', '<!-- comment -->'],
        correctOptionIndex: 2,
        explanation: 'Python uses the hash # character for single-line comments.',
      ),

      // Java
      Question(
        id: 'def-jav-1',
        category: 'Java',
        questionText: 'Which component is responsible for executing Java bytecode?',
        options: ['JDK', 'JVM', 'JRE', 'JIT Compiler'],
        correctOptionIndex: 1,
        explanation: 'JVM (Java Virtual Machine) executes compiled bytecode.',
      ),
      Question(
        id: 'def-jav-2',
        category: 'Java',
        questionText: 'Which keyword is used to inherit a class in Java?',
        options: ['implements', 'inherits', 'extends', 'instanceof'],
        correctOptionIndex: 2,
        explanation: 'The extends keyword is used to establish class inheritance.',
      ),
      Question(
        id: 'def-jav-3',
        category: 'Java',
        questionText: 'What is the default value of a boolean in Java?',
        options: ['true', 'false', '0', 'null'],
        correctOptionIndex: 1,
        explanation: 'In Java, boolean primitives default to false.',
      ),

      // SQL
      Question(
        id: 'def-sql-1',
        category: 'SQL',
        questionText: 'Which SQL command is used to retrieve data from a table?',
        options: ['GET', 'EXTRACT', 'SELECT', 'FETCH'],
        correctOptionIndex: 2,
        explanation: 'The SELECT command queries data from database tables.',
      ),
      Question(
        id: 'def-sql-2',
        category: 'SQL',
        questionText: 'Which clause is used to filter records in SQL?',
        options: ['WHERE', 'ORDER BY', 'GROUP BY', 'HAVING'],
        correctOptionIndex: 0,
        explanation: 'The WHERE clause specifies search conditions.',
      ),
      Question(
        id: 'def-sql-3',
        category: 'SQL',
        questionText: 'What does SQL stand for?',
        options: [
          'Structured Question Language',
          'Strong Query Language',
          'Structured Query Language',
          'Sequential Query Logic'
        ],
        correctOptionIndex: 2,
        explanation: 'SQL stands for Structured Query Language.',
      ),

      // General Knowledge
      Question(
        id: 'def-gk-1',
        category: 'General Knowledge',
        questionText: 'Who is recognized as the father of modern computers?',
        options: ['Alan Turing', 'Charles Babbage', 'Ada Lovelace', 'Bill Gates'],
        correctOptionIndex: 1,
        explanation: 'Charles Babbage conceptualized the Analytical Engine.',
      ),
      Question(
        id: 'def-gk-2',
        category: 'General Knowledge',
        questionText: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
        correctOptionIndex: 2,
        explanation: 'Iron oxide on the surface of Mars gives it a reddish look.',
      ),
      Question(
        id: 'def-gk-3',
        category: 'General Knowledge',
        questionText: 'What is the largest ocean on Earth?',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correctOptionIndex: 3,
        explanation: 'The Pacific Ocean is the largest ocean covering >30% of Earth.',
      ),
    ];
  }
}
