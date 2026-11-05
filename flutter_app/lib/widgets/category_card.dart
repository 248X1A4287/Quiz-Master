import 'package:flutter/material.dart';

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
                  '$questionCount Questions',
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
