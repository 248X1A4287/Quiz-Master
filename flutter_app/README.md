# QuizMaster – Smart Quiz Application

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
```bash
flutter doctor
```

### 2. Create the Project
```bash
flutter create quiz_master
cd quiz_master
```

### 3. Install Dependencies
Update your `pubspec.yaml` with:
```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  shared_preferences: ^2.2.2
  uuid: ^4.3.3
  cupertino_icons: ^1.0.6
```
Then run:
```bash
flutter pub get
```

### 4. Organize Folder Structure
Ensure your `lib/` folder mirrors the requested architecture:
```
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
```

### 5. Run the Application
Start your Android Emulator or connect a physical Android device via USB debugging, then execute:
```bash
flutter run
```

### 6. Run Widget Tests
```bash
flutter test
```

### 7. Generate Release APK
To build an Android APK ready for release or sharing:
```bash
flutter build apk --release
```
The generated APK will be located at:
`build/app/outputs/flutter-apk/app-release.apk`

---

## 🐙 GitHub Setup Instructions
```bash
git init
git add .
git commit -m "Initial commit: QuizMaster Flutter Application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quizmaster-flutter.git
git push -u origin main
```
