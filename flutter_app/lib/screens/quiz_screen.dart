import 'package:flutter/material.dart';
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
        appBar: AppBar(title: Text('${quiz.selectedCategory} Quiz')),
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
          title: Text('${quiz.selectedCategory} Quiz'),
          actions: [
            Center(
              child: Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Text(
                  'Score: ${quiz.correctAnswers}',
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
                      'Question $currentIndex of $totalQuestions',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.blue.shade900,
                      ),
                    ),
                    Text(
                      '${(quiz.progress * 100).toInt()}%',
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
