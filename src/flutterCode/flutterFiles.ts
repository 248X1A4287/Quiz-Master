export interface FlutterFile {
  path: string;
  name: string;
  category: 'core' | 'model' | 'provider' | 'service' | 'screen' | 'widget' | 'test' | 'config' | 'doc';
  description: string;
  code: string;
}

export const FLUTTER_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter project dependencies and assets definition',
    code: `name: quiz_master
description: "QuizMaster – Smart Quiz Application with Flutter, Provider, and SharedPreferences"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # State management
  provider: ^6.1.2
  # Local persistence simulating SQLite / Key-Value
  shared_preferences: ^2.2.2
  # Unique identifiers for custom questions
  uuid: ^4.3.3
  # Material Icons
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },

  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'core',
    description: 'Application entry point initializing Provider, Theme, and Home Screen',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'providers/quiz_provider.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set preferred orientations for consistent mobile UX
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const QuizMasterApp());
}

class QuizMasterApp extends StatelessWidget {
  const QuizMasterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => QuizProvider()..init(),
      child: MaterialApp(
        title: 'QuizMaster',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF1976D2), // Blue theme
            primary: const Color(0xFF1976D2),
            secondary: const Color(0xFF0D47A1),
            surface: Colors.white,
            background: const Color(0xFFF4F7FC),
          ),
          scaffoldBackgroundColor: const Color(0xFFF4F7FC),
          appBarTheme: const AppBarTheme(
            elevation: 0,
            centerTitle: true,
            backgroundColor: Color(0xFF1976D2),
            foregroundColor: Colors.white,
            systemOverlayStyle: SystemUiOverlayStyle.light,
            titleTextStyle: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: 0.5,
            ),
          ),
          cardTheme: CardTheme(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            color: Colors.white,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              elevation: 2,
              backgroundColor: const Color(0xFF1976D2),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              textStyle: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
        home: const HomeScreen(),
      ),
    );
  }
}
`,
  },

  {
    path: 'lib/models/question.dart',
    name: 'question.dart',
    category: 'model',
    description: 'Data model for quiz questions with JSON serialization',
    code: `import 'dart:convert';

class Question {
  final String id;
  final String category; // 'Python', 'Java', 'SQL', 'General Knowledge'
  final String questionText;
  final List<String> options; // Exactly 4 options
  final int correctOptionIndex; // 0, 1, 2, 3
  final String? explanation;
  final bool isCustom;

  Question({
    required this.id,
    required this.category,
    required this.questionText,
    required this.options,
    required this.correctOptionIndex,
    this.explanation,
    this.isCustom = false,
  }) : assert(options.length == 4, 'Question must have exactly 4 options');

  // Convert Question to Map for SharedPreferences persistence
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'category': category,
      'questionText': questionText,
      'options': options,
      'correctOptionIndex': correctOptionIndex,
      'explanation': explanation,
      'isCustom': isCustom,
    };
  }

  // Construct Question from Map
  factory Question.fromMap(Map<String, dynamic> map) {
    return Question(
      id: map['id'] as String,
      category: map['category'] as String,
      questionText: map['questionText'] as String,
      options: List<String>.from(map['options'] as List),
      correctOptionIndex: map['correctOptionIndex'] as int,
      explanation: map['explanation'] as String?,
      isCustom: (map['isCustom'] as bool?) ?? false,
    );
  }

  String toJson() => json.encode(toMap());

  factory Question.fromJson(String source) =>
      Question.fromMap(json.decode(source) as Map<String, dynamic>);
}
`,
  },

  {
    path: 'lib/models/quiz_result.dart',
    name: 'quiz_result.dart',
    category: 'model',
    description: 'Data model for recording quiz attempts and history',
    code: `import 'dart:convert';

class QuizResult {
  final String id;
  final String category;
  final int totalQuestions;
  final int correctAnswers;
  final int wrongAnswers;
  final double scorePercentage;
  final DateTime timestamp;

  QuizResult({
    required this.id,
    required this.category,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.wrongAnswers,
    required this.scorePercentage,
    required this.timestamp,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'category': category,
      'totalQuestions': totalQuestions,
      'correctAnswers': correctAnswers,
      'wrongAnswers': wrongAnswers,
      'scorePercentage': scorePercentage,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  factory QuizResult.fromMap(Map<String, dynamic> map) {
    return QuizResult(
      id: map['id'] as String,
      category: map['category'] as String,
      totalQuestions: map['totalQuestions'] as int,
      correctAnswers: map['correctAnswers'] as int,
      wrongAnswers: map['wrongAnswers'] as int,
      scorePercentage: (map['scorePercentage'] as num).toDouble(),
      timestamp: DateTime.parse(map['timestamp'] as String),
    );
  }

  String toJson() => json.encode(toMap());

  factory QuizResult.fromJson(String source) =>
      QuizResult.fromMap(json.decode(source) as Map<String, dynamic>);
}
`,
  },

  {
    path: 'lib/services/storage_service.dart',
    name: 'storage_service.dart',
    category: 'service',
    description: 'Service handling local persistence via SharedPreferences',
    code: `import 'dart:convert';
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
`,
  },

  {
    path: 'lib/providers/quiz_provider.dart',
    name: 'quiz_provider.dart',
    category: 'provider',
    description: 'ChangeNotifier state manager for active quizzes, questions & scores',
    code: `import 'package:flutter/foundation.dart';
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
`,
  },

  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    category: 'screen',
    description: 'Screen 1: Home dashboard with categories, logo, best score & nav',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../widgets/category_card.dart';
import 'quiz_screen.dart';
import 'add_question_screen.dart';
import 'history_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quizProvider = Provider.of<QuizProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.school, color: Colors.white, size: 26),
            SizedBox(width: 8),
            Text('QuizMaster'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.history_rounded),
            tooltip: 'Quiz History',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const HistoryScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded),
            tooltip: 'Add Question',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AddQuestionScreen()),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Banner Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1976D2), Color(0xFF0D47A1)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF1976D2).withOpacity(0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.auto_awesome,
                            color: Colors.amberAccent,
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Welcome, Student!',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                'Test your knowledge & track your growth',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    // Best Score Badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.25),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.emoji_events_rounded,
                            color: Colors.amberAccent,
                            size: 22,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Highest Score: \${quizProvider.highestScore.toStringAsFixed(0)}%',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Categories Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Quiz Categories',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  Text(
                    '\${QuizProvider.categories.length} Topics',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Categories Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.05,
                ),
                itemCount: QuizProvider.categories.length,
                itemBuilder: (context, index) {
                  final cat = QuizProvider.categories[index];
                  final qCount = quizProvider.allQuestions
                      .where((q) => q.category.toLowerCase() == cat.toLowerCase())
                      .length;

                  return CategoryCard(
                    categoryName: cat,
                    questionCount: qCount,
                    onTap: () {
                      quizProvider.startQuiz(cat);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const QuizScreen(),
                        ),
                      );
                    },
                  );
                },
              ),

              const SizedBox(height: 24),

              // Quick Actions
              Card(
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: Colors.blue.shade100),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.note_add_rounded,
                          color: Color(0xFF1976D2),
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Add Your Own Question',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                            Text(
                              'Create custom questions that persist locally',
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const AddQuestionScreen(),
                            ),
                          );
                        },
                        child: const Text('Add'),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },

  {
    path: 'lib/screens/quiz_screen.dart',
    name: 'quiz_screen.dart',
    category: 'screen',
    description: 'Screen 2: Interactive quiz with progress, 4 options & score calculation',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../widgets/answer_option.dart';
import 'result_screen.dart';

class QuizScreen extends StatelessWidget {
  const QuizScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = Provider.of<QuizProvider>(context);
    final question = quiz.currentQuestion;

    // Handle empty state gracefully
    if (question == null) {
      return Scaffold(
        appBar: AppBar(title: Text('\${quiz.selectedCategory} Quiz')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.quiz_outlined, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              const Text(
                'No questions available in this category!',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Return Home'),
              ),
            ],
          ),
        ),
      );
    }

    final currentIndex = quiz.currentQuestionIndex + 1;
    final totalQuestions = quiz.currentQuizQuestions.length;

    return WillPopScope(
      onWillPop: () async {
        final shouldLeave = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Leave Quiz?'),
            content: const Text(
              'Your current quiz progress will be discarded. Are you sure?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                onPressed: () => Navigator.pop(ctx, true),
                child: const Text('Leave'),
              ),
            ],
          ),
        );
        return shouldLeave ?? false;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text('\${quiz.selectedCategory} Quiz'),
          actions: [
            Center(
              child: Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Text(
                  'Score: \${quiz.correctAnswers}',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Question Counter & Progress Bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Question \$currentIndex of \$totalQuestions',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.blue.shade900,
                      ),
                    ),
                    Text(
                      '\${(quiz.progress * 100).toInt()}%',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1976D2),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: LinearProgressIndicator(
                    value: quiz.progress,
                    minHeight: 10,
                    backgroundColor: Colors.blue.shade50,
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      Color(0xFF1976D2),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Question Card
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Card(
                          elevation: 3,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Text(
                              question.questionText,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E293B),
                                height: 1.4,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Answer Options (4 choices)
                        ...List.generate(question.options.length, (index) {
                          return AnswerOption(
                            text: question.options[index],
                            index: index,
                            isSelected: quiz.selectedAnswerIndex == index,
                            isSubmitted: quiz.isAnswerSubmitted,
                            isCorrectOption: index == question.correctOptionIndex,
                            onTap: () {
                              quiz.selectAnswer(index);
                            },
                          );
                        }),

                        // Explanation hint when submitted
                        if (quiz.isAnswerSubmitted &&
                            question.explanation != null &&
                            question.explanation!.isNotEmpty)
                          Container(
                            margin: const EdgeInsets.only(top: 14),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: Colors.blue.shade50,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.blue.shade200),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Icon(
                                  Icons.info_outline,
                                  color: Color(0xFF1976D2),
                                  size: 20,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    question.explanation!,
                                    style: TextStyle(
                                      color: Colors.blue.shade900,
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Action Button: Submit or Next Question
                if (!quiz.isAnswerSubmitted)
                  ElevatedButton(
                    onPressed: quiz.selectedAnswerIndex != null
                        ? () {
                            quiz.submitAnswer();
                          }
                        : null, // Disabled until option chosen
                    child: const Text('Submit Answer'),
                  )
                else
                  ElevatedButton(
                    onPressed: () async {
                      if (quiz.isLastQuestion) {
                        final result = await quiz.finishQuiz();
                        if (context.mounted) {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ResultScreen(result: result),
                            ),
                          );
                        }
                      } else {
                        quiz.nextQuestion();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: quiz.isLastQuestion
                          ? const Color(0xFF0D47A1)
                          : const Color(0xFF1976D2),
                    ),
                    child: Text(
                      quiz.isLastQuestion ? 'View Results' : 'Next Question',
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`,
  },

  {
    path: 'lib/screens/result_screen.dart',
    name: 'result_screen.dart',
    category: 'screen',
    description: 'Screen 3: Final score, percentage, statistics, Play Again & Home',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/quiz_result.dart';
import '../providers/quiz_provider.dart';
import 'quiz_screen.dart';

class ResultScreen extends StatelessWidget {
  final QuizResult result;

  const ResultScreen({super.key, required this.result});

  String get performanceMessage {
    if (result.scorePercentage >= 90) {
      return 'Outstanding! You are a master in \${result.category}!';
    } else if (result.scorePercentage >= 70) {
      return 'Great job! Strong performance, keep it up!';
    } else if (result.scorePercentage >= 50) {
      return 'Good effort! Review weak areas to improve further.';
    } else {
      return 'Keep practicing! Review the materials and try again.';
    }
  }

  Color get scoreColor {
    if (result.scorePercentage >= 75) return Colors.green.shade600;
    if (result.scorePercentage >= 50) return Colors.amber.shade700;
    return Colors.red.shade600;
  }

  @override
  Widget build(BuildContext context) {
    final quiz = Provider.of<QuizProvider>(context, listen: false);

    return WillPopScope(
      onWillPop: () async {
        Navigator.popUntil(context, (route) => route.isFirst);
        return false;
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Quiz Results'),
          automaticallyImplyLeading: false,
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top Trophy Badge
                Center(
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      result.scorePercentage >= 60
                          ? Icons.emoji_events_rounded
                          : Icons.school_rounded,
                      size: 64,
                      color: const Color(0xFF1976D2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Center(
                  child: Text(
                    result.category,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey,
                    ),
                  ),
                ),
                const SizedBox(height: 8),

                // Score Circle Display
                Center(
                  child: Column(
                    children: [
                      Text(
                        '\${result.scorePercentage.toStringAsFixed(0)}%',
                        style: TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: scoreColor,
                        ),
                      ),
                      Text(
                        '\${result.correctAnswers} out of \${result.totalQuestions} Correct',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF334155),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Motivational Feedback Box
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.blue.shade100),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Text(
                    performanceMessage,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Stats Summary Cards
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        title: 'Total',
                        value: '\${result.totalQuestions}',
                        icon: Icons.list_alt_rounded,
                        color: const Color(0xFF1976D2),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        title: 'Correct',
                        value: '\${result.correctAnswers}',
                        icon: Icons.check_circle_outline_rounded,
                        color: Colors.green,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        title: 'Wrong',
                        value: '\${result.wrongAnswers}',
                        icon: Icons.cancel_outlined,
                        color: Colors.red,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 32),

                // Action Buttons
                ElevatedButton.icon(
                  onPressed: () {
                    quiz.startQuiz(result.category);
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const QuizScreen()),
                    );
                  },
                  icon: const Icon(Icons.replay_rounded),
                  label: const Text('Play Again'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1976D2),
                  ),
                ),
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: () {
                    Navigator.popUntil(context, (route) => route.isFirst);
                  },
                  icon: const Icon(Icons.home_rounded),
                  label: const Text('Return to Home'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF1976D2),
                    side: const BorderSide(color: Color(0xFF1976D2), width: 1.5),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 26),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },

  {
    path: 'lib/screens/add_question_screen.dart',
    name: 'add_question_screen.dart',
    category: 'screen',
    description: 'Screen 4: Form validation for adding custom questions permanently',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';

class AddQuestionScreen extends StatefulWidget {
  const AddQuestionScreen({super.key});

  @override
  State<AddQuestionScreen> createState() => _AddQuestionScreenState();
}

class _AddQuestionScreenState extends State<AddQuestionScreen> {
  final _formKey = GlobalKey<FormState>();

  final _questionController = TextEditingController();
  final List<TextEditingController> _optionControllers = [
    TextEditingController(),
    TextEditingController(),
    TextEditingController(),
    TextEditingController(),
  ];
  final _explanationController = TextEditingController();

  String _selectedCategory = QuizProvider.categories.first;
  int _correctOptionIndex = 0;
  bool _isSaving = false;

  @override
  void dispose() {
    _questionController.dispose();
    for (var c in _optionControllers) {
      c.dispose();
    }
    _explanationController.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);

    try {
      final quiz = Provider.of<QuizProvider>(context, listen: false);

      await quiz.addQuestion(
        category: _selectedCategory,
        questionText: _questionController.text.trim(),
        options: _optionControllers.map((c) => c.text.trim()).toList(),
        correctOptionIndex: _correctOptionIndex,
        explanation: _explanationController.text.trim().isEmpty
            ? null
            : _explanationController.text.trim(),
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 8),
                Text('Question saved permanently!'),
              ],
            ),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to save question: \$e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Question'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Category Selector
                const Text(
                  'Select Quiz Category',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _selectedCategory,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  items: QuizProvider.categories
                      .map((cat) => DropdownMenuItem(
                            value: cat,
                            child: Text(cat),
                          ))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedCategory = val);
                  },
                ),

                const SizedBox(height: 20),

                // Question Input
                const Text(
                  'Question Text',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _questionController,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Enter the question here...',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter a valid question';
                    }
                    if (value.trim().length < 8) {
                      return 'Question must be at least 8 characters';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 24),

                // Options Section Header
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Four Answer Options',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    Text(
                      'Select the radio for correct answer',
                      style: TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Four Option Fields
                ...List.generate(4, (index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Radio<int>(
                          value: index,
                          groupValue: _correctOptionIndex,
                          activeColor: const Color(0xFF1976D2),
                          onChanged: (val) {
                            if (val != null) {
                              setState(() => _correctOptionIndex = val);
                            }
                          },
                        ),
                        Expanded(
                          child: TextFormField(
                            controller: _optionControllers[index],
                            decoration: InputDecoration(
                              labelText: 'Option \${String.fromCharCode(65 + index)}',
                              hintText: 'Enter option \${String.fromCharCode(65 + index)}',
                              filled: true,
                              fillColor: Colors.white,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 12,
                              ),
                            ),
                            validator: (val) {
                              if (val == null || val.trim().isEmpty) {
                                return 'Option cannot be empty';
                              }
                              return null;
                            },
                          ),
                        ),
                      ],
                    ),
                  );
                }),

                const SizedBox(height: 12),

                // Explanation Input (Optional)
                const Text(
                  'Explanation (Optional)',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _explanationController,
                  maxLines: 2,
                  decoration: InputDecoration(
                    hintText: 'Explain why the correct answer is right...',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),

                const SizedBox(height: 28),

                // Submit Button
                ElevatedButton.icon(
                  onPressed: _isSaving ? null : _submitForm,
                  icon: _isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.save_rounded),
                  label: Text(_isSaving ? 'Saving Question...' : 'Save Question Permanently'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`,
  },

  {
    path: 'lib/screens/history_screen.dart',
    name: 'history_screen.dart',
    category: 'screen',
    description: 'Screen 5: Quiz attempt history, category breakdowns & local storage',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final quiz = Provider.of<QuizProvider>(context);
    final history = quiz.history;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz History'),
        actions: [
          if (history.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep_rounded),
              tooltip: 'Clear History',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Clear All History?'),
                    content: const Text(
                      'This will delete all past quiz records from local storage.',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: const Text('Cancel'),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                        ),
                        onPressed: () {
                          quiz.clearHistory();
                          Navigator.pop(ctx);
                        },
                        child: const Text('Clear'),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
      body: SafeArea(
        child: history.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.history_toggle_off_rounded,
                      size: 70,
                      color: Colors.grey.shade400,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'No quiz attempts yet!',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF334155),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Take a quiz from the Home screen to see records here.',
                      style: TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: history.length,
                itemBuilder: (context, index) {
                  final item = history[index];
                  final formattedDate =
                      '\${item.timestamp.day}/\${item.timestamp.month}/\${item.timestamp.year} '
                      '\${item.timestamp.hour.toString().padLeft(2, '0')}:'
                      '\${item.timestamp.minute.toString().padLeft(2, '0')}';

                  Color badgeColor = Colors.green;
                  if (item.scorePercentage < 50) {
                    badgeColor = Colors.red;
                  } else if (item.scorePercentage < 75) {
                    badgeColor = Colors.amber.shade800;
                  }

                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            width: 54,
                            height: 54,
                            decoration: BoxDecoration(
                              color: badgeColor.withOpacity(0.12),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                '\${item.scorePercentage.toInt()}%',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: badgeColor,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.category,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: Color(0xFF1E293B),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '\${item.correctAnswers} / \${item.totalQuestions} correct  •  \$formattedDate',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
`,
  },

  {
    path: 'lib/widgets/category_card.dart',
    name: 'category_card.dart',
    category: 'widget',
    description: 'Reusable Category Card with icons, question counter and ripple effect',
    code: `import 'package:flutter/material.dart';

class CategoryCard extends StatelessWidget {
  final String categoryName;
  final int questionCount;
  final VoidCallback onTap;

  const CategoryCard({
    super.key,
    required this.categoryName,
    required this.questionCount,
    required this.onTap,
  });

  IconData _getCategoryIcon(String cat) {
    switch (cat.toLowerCase()) {
      case 'python':
        return Icons.code_rounded;
      case 'java':
        return Icons.coffee_rounded;
      case 'sql':
        return Icons.storage_rounded;
      case 'general knowledge':
      default:
        return Icons.public_rounded;
    }
  }

  List<Color> _getGradient(String cat) {
    switch (cat.toLowerCase()) {
      case 'python':
        return [const Color(0xFF1976D2), const Color(0xFF42A5F5)];
      case 'java':
        return [const Color(0xFFE65100), const Color(0xFFFF9800)];
      case 'sql':
        return [const Color(0xFF00695C), const Color(0xFF26A69A)];
      case 'general knowledge':
      default:
        return [const Color(0xFF4A148C), const Color(0xFF8E24AA)];
    }
  }

  @override
  Widget build(BuildContext context) {
    final gradient = _getGradient(categoryName);
    final icon = _getCategoryIcon(categoryName);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: gradient),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: Colors.white, size: 24),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  categoryName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '\$questionCount Questions',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },

  {
    path: 'lib/widgets/answer_option.dart',
    name: 'answer_option.dart',
    category: 'widget',
    description: 'Multiple-choice answer option widget with correct/wrong highlighting',
    code: `import 'package:flutter/material.dart';

class AnswerOption extends StatelessWidget {
  final String text;
  final int index;
  final bool isSelected;
  final bool isSubmitted;
  final bool isCorrectOption;
  final VoidCallback onTap;

  const AnswerOption({
    super.key,
    required this.text,
    required this.index,
    required this.isSelected,
    required this.isSubmitted,
    required this.isCorrectOption,
    required this.onTap,
  });

  String get optionLetter => String.fromCharCode(65 + index); // A, B, C, D

  @override
  Widget build(BuildContext context) {
    Color borderColor = Colors.grey.shade300;
    Color bgColor = Colors.white;
    Color textColor = const Color(0xFF1E293B);
    Widget? trailingIcon;

    if (isSubmitted) {
      if (isCorrectOption) {
        borderColor = Colors.green.shade600;
        bgColor = Colors.green.shade50;
        trailingIcon = const Icon(Icons.check_circle, color: Colors.green);
      } else if (isSelected && !isCorrectOption) {
        borderColor = Colors.red.shade600;
        bgColor = Colors.red.shade50;
        trailingIcon = const Icon(Icons.cancel, color: Colors.red);
      }
    } else if (isSelected) {
      borderColor = const Color(0xFF1976D2);
      bgColor = Colors.blue.shade50;
      textColor = const Color(0xFF1976D2);
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: isSubmitted ? null : onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: borderColor, width: isSelected ? 2 : 1),
          ),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: isSelected
                      ? const Color(0xFF1976D2)
                      : Colors.grey.shade100,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    optionLetter,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: isSelected ? Colors.white : Colors.grey.shade700,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  text,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                    color: textColor,
                  ),
                ),
              ),
              if (trailingIcon != null) trailingIcon,
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },

  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    category: 'test',
    description: 'Flutter Widget tests for app startup, categories & navigation',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:quiz_master/providers/quiz_provider.dart';
import 'package:quiz_master/screens/home_screen.dart';

void main() {
  testWidgets('QuizMaster loads Home Screen and displays Quiz Categories',
      (WidgetTester tester) async {
    final quizProvider = QuizProvider();
    await quizProvider.init();

    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: quizProvider,
        child: const MaterialApp(
          home: HomeScreen(),
        ),
      ),
    );

    // Verify QuizMaster title is rendered
    expect(find.text('QuizMaster'), findsOneWidget);

    // Verify Welcome message
    expect(find.text('Welcome, Student!'), findsOneWidget);

    // Verify the four categories exist
    expect(find.text('Python'), findsWidgets);
    expect(find.text('Java'), findsWidgets);
    expect(find.text('SQL'), findsWidgets);
    expect(find.text('General Knowledge'), findsWidgets);
  });

  testWidgets('Adding question updates quiz provider question count',
      (WidgetTester tester) async {
    final quizProvider = QuizProvider();
    await quizProvider.init();

    final initialCount = quizProvider.allQuestions.length;

    await quizProvider.addQuestion(
      category: 'Python',
      questionText: 'What is a decorator in Python?',
      options: ['A function wrapper', 'A style guide', 'A loop', 'A module'],
      correctOptionIndex: 0,
    );

    expect(quizProvider.allQuestions.length, initialCount + 1);
  });
}
`,
  },

  {
    path: 'README.md',
    name: 'README.md',
    category: 'doc',
    description: 'Comprehensive project README with setup, commands & APK build instructions',
    code: `# QuizMaster – Smart Quiz Application

A modern, responsive Android Quiz Application developed with **Flutter 3.35+**, **Dart (null safety)**, **Provider** for state management, and **SharedPreferences** for local data persistence.

---

## 🌟 Key Features
- **5 Complete Material Design Screens**:
  1. **Home Screen**: App branding, welcome banner, category grid (Python, Java, SQL, General Knowledge), highest score banner, and quick actions.
  2. **Quiz Screen**: One question at a time, 4 multiple-choice options, progress bar, score tally, answer submission lock, and instant explanatory feedback.
  3. **Result Screen**: Circular percentage ring, score breakdown (total, correct, wrong), motivational performance rating, "Play Again", and "Return Home".
  4. **Add Questions Screen**: Form with input validation, 4 options with radio button selector for correct answer, category dropdown, optional explanations, and permanent local storage.
  5. **Quiz History Screen**: Chronological log of past quiz attempts, percentage badges, timestamps, and one-tap history reset.
- **100% Offline Capable**: Zero compulsory external APIs.
- **Blue & White Material Theme**: Follows clean mobile aesthetics with rounded cards, elevation, and crisp typography.

---

## 🚀 Quick Start (Step-by-Step for Beginners)

### 1. Prerequisites
- [Flutter SDK 3.35+](https://flutter.dev/docs/get-started/install) installed.
- [Android Studio](https://developer.android.com/studio) with Android SDK and command-line tools.
- VS Code or Android Studio Flutter extension.

Verify your environment:
\`\`\`bash
flutter doctor
\`\`\`

### 2. Create the Project
\`\`\`bash
flutter create quiz_master
cd quiz_master
\`\`\`

### 3. Install Dependencies
Update your \`pubspec.yaml\` with:
\`\`\`yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  shared_preferences: ^2.2.2
  uuid: ^4.3.3
  cupertino_icons: ^1.0.6
\`\`\`
Then run:
\`\`\`bash
flutter pub get
\`\`\`

### 4. Organize Folder Structure
Ensure your \`lib/\` folder mirrors the requested architecture:
\`\`\`
lib/
├── main.dart
├── models/
│   ├── question.dart
│   └── quiz_result.dart
├── providers/
│   └── quiz_provider.dart
├── services/
│   └── storage_service.dart
├── screens/
│   ├── home_screen.dart
│   ├── quiz_screen.dart
│   ├── result_screen.dart
│   ├── add_question_screen.dart
│   └── history_screen.dart
└── widgets/
    ├── category_card.dart
    └── answer_option.dart
\`\`\`

### 5. Run the Application
Start your Android Emulator or connect a physical Android device via USB debugging, then execute:
\`\`\`bash
flutter run
\`\`\`

### 6. Run Widget Tests
\`\`\`bash
flutter test
\`\`\`

### 7. Generate Release APK
To build an Android APK ready for release or sharing:
\`\`\`bash
flutter build apk --release
\`\`\`
The generated APK will be located at:
\`build/app/outputs/flutter-apk/app-release.apk\`

---

## 🐙 GitHub Setup Instructions
\`\`\`bash
git init
git add .
git commit -m "Initial commit: QuizMaster Flutter Application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quizmaster-flutter.git
git push -u origin main
\`\`\`
`,
  },
];
