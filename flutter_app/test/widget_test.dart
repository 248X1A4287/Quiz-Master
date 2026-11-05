import 'package:flutter/material.dart';
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
