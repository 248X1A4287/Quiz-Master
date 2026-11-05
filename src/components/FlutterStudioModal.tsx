import React, { useState } from 'react';
import { FLUTTER_FILES, FlutterFile } from '../flutterCode/flutterFiles';
import {
  X,
  FileCode,
  FolderTree,
  Copy,
  Check,
  Download,
  BookOpen,
  Terminal,
  Cpu,
  Smartphone,
  GitBranch,
  ShieldCheck,
} from 'lucide-react';
import JSZip from 'jszip';

interface FlutterStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterStudioModal: React.FC<FlutterStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_FILES[0]);
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all project files to zip
      FLUTTER_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Also generate an android analysis .gitignore for flutter
      zip.file(
        '.gitignore',
        `# Miscellaneous
*.class
*.log
*.pyc
*.swp
.DS_Store
.atom/
.buildlog/
.history
.svn/
migrate_working_dir/

# IntelliJ related
*.iml
*.ipr
*.iws
.idea/

# Flutter/Dart/Pub related
**/doc/api/
**/ios/Flutter/.last_build_id
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
/build/

# Android Studio
/android/app/build/
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quiz_master_flutter_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate zip:', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  Flutter Source Code Studio & Beginner Guide
                </h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                  Dart Null Safety
                </span>
              </div>
              <p className="text-xs text-slate-400">
                QuizMaster – Complete Android Project with 5 Screens, Provider & SharedPreferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Zip */}
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Bundling...' : 'Download Project (.ZIP)'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Flutter Code Explorer ({FLUTTER_FILES.length} Files)</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Beginner Setup & Build Guide</span>
          </button>
        </div>

        {/* Studio Content */}
        {activeTab === 'code' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: File Tree */}
            <div className="w-72 border-r border-slate-800 bg-slate-950/40 flex flex-col shrink-0">
              <div className="p-3 border-b border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <FolderTree className="w-4 h-4 text-blue-400" />
                <span>Project File Tree</span>
              </div>
              <div className="p-2 overflow-y-auto space-y-0.5 flex-1">
                {FLUTTER_FILES.map((file) => {
                  const isSelected = selectedFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between group ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'
                          }`}
                        />
                        <span className="truncate">{file.path}</span>
                      </div>
                      <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-400 shrink-0 font-sans">
                        {file.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Code Viewer */}
            <div className="flex-1 flex flex-col bg-slate-900/90 overflow-hidden">
              {/* File Info Bar */}
              <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      {selectedFile.path}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                      {selectedFile.code.split('\n').length} lines
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code text block with line numbers */}
              <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-[#0B0F19]">
                <pre className="select-text">
                  <code>{selectedFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Beginner Setup Guide Tab */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300">
            {/* Step 1 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Prerequisites & Environment Setup
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ensure Flutter SDK and Android Studio are installed on your machine.
                  </p>
                </div>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-300 pl-11 list-disc">
                <li>
                  Download and install <strong className="text-blue-300">Flutter 3.35+</strong> from{' '}
                  <span className="font-mono text-blue-400">https://flutter.dev</span>.
                </li>
                <li>
                  Install <strong className="text-blue-300">Android Studio</strong> with the Android
                  SDK, command-line tools, and Android Virtual Device (AVD).
                </li>
                <li>
                  Verify your setup in terminal by running:{' '}
                  <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300 font-mono">
                    flutter doctor
                  </code>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Create the Flutter Project & Add Dependencies
                  </h4>
                  <p className="text-xs text-slate-400">
                    Initialize a clean Flutter project and configure provider & shared_preferences.
                  </p>
                </div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl font-mono text-xs text-slate-200 space-y-2 border border-slate-800">
                <p className="text-slate-400"># In your terminal, run:</p>
                <p className="text-emerald-400">flutter create quiz_master</p>
                <p className="text-emerald-400">cd quiz_master</p>
                <p className="text-slate-400 mt-2"># Install the required packages:</p>
                <p className="text-emerald-400">flutter pub add provider shared_preferences uuid</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Place Project Files or Download ZIP
                  </h4>
                  <p className="text-xs text-slate-400">
                    Create the exact subdirectories inside your <code className="text-blue-300">lib/</code> folder.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 pl-11">
                Tip: Click the <strong className="text-blue-400">"Download Project (.ZIP)"</strong> button at the top right to download all pre-formatted files, or copy each file individually from the Flutter Code Explorer tab into your project.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Run Application on Emulator or Physical Android Device
                  </h4>
                  <p className="text-xs text-slate-400">
                    Launch the app with hot reload enabled.
                  </p>
                </div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800">
                <p className="text-slate-400"># Start your Android emulator or connect your phone via USB, then:</p>
                <p className="text-emerald-400">flutter run</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Execute Automated Flutter Tests
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ensure all widget tests and state management logic pass.
                  </p>
                </div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800">
                <p className="text-slate-400"># Run unit and widget tests:</p>
                <p className="text-emerald-400">flutter test</p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Generate Android Release APK
                  </h4>
                  <p className="text-xs text-slate-400">
                    Compile a standalone APK file to install on any Android phone.
                  </p>
                </div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800">
                <p className="text-slate-400"># Generate optimized release APK:</p>
                <p className="text-emerald-400">flutter build apk --release</p>
                <p className="text-slate-400 mt-2">
                  # Output location: build/app/outputs/flutter-apk/app-release.apk
                </p>
              </div>
            </div>

            {/* Step 7: GitHub Setup */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                  7
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Push to GitHub Repository
                  </h4>
                  <p className="text-xs text-slate-400">
                    Initialize git version control and push to GitHub.
                  </p>
                </div>
              </div>
              <div className="bg-black/50 p-4 rounded-xl font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800">
                <p className="text-emerald-400">git init</p>
                <p className="text-emerald-400">git add .</p>
                <p className="text-emerald-400">git commit -m "Initial commit: QuizMaster Flutter Application"</p>
                <p className="text-emerald-400">git branch -M main</p>
                <p className="text-emerald-400">git remote add origin https://github.com/YOUR_USERNAME/quiz_master.git</p>
                <p className="text-emerald-400">git push -u origin main</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
