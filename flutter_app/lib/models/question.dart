import 'dart:convert';

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
