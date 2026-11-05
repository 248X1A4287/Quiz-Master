import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Code2, RotateCcw, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenFlutterStudio: () => void;
  onResetData: () => void;
  viewMode: 'phone' | 'wide';
  onChangeViewMode: (mode: 'phone' | 'wide') => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  soundEnabled,
  onToggleSound,
  onOpenFlutterStudio,
  onResetData,
  viewMode,
  onChangeViewMode,
}) => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top AI Studio Header Bar */}
      <header className="bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-lg">
            Q
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base tracking-tight">QuizMaster</h1>
              <span className="text-[11px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Flutter 3.35 • Material 3
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Android Quiz Application with Provider & SharedPreferences
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          {/* View mode toggle */}
          <div className="hidden sm:flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => onChangeViewMode('phone')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition ${
                viewMode === 'phone' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile Device Mockup"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => onChangeViewMode('wide')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition ${
                viewMode === 'wide' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Expanded View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Wide</span>
            </button>
          </div>

          {/* Reset sample questions */}
          <button
            onClick={onResetData}
            title="Reset questions to defaults"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Defaults</span>
          </button>

          {/* Flutter Code & Export Modal Trigger */}
          <button
            onClick={onOpenFlutterStudio}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition transform active:scale-95"
          >
            <Code2 className="w-4 h-4" />
            <span>Flutter Code Studio</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-auto">
        {viewMode === 'phone' ? (
          // Realistic Android Device Mockup
          <div className="w-full max-w-[420px] h-[840px] max-h-[92vh] bg-slate-950 rounded-[44px] p-3 shadow-2xl shadow-blue-900/20 border-4 border-slate-700/80 relative flex flex-col ring-1 ring-slate-800">
            {/* Phone Speaker & Camera Punch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-b-xl z-50 flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800"></div>
              <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
            </div>

            {/* Inner Phone Screen Container */}
            <div className="flex-1 w-full bg-[#F4F7FC] rounded-[34px] overflow-hidden flex flex-col relative shadow-inner">
              {/* Android Status Bar */}
              <div className="h-7 bg-[#1976D2] text-white px-5 flex items-center justify-between text-[11px] font-semibold tracking-wider select-none shrink-0 z-30">
                <span>{timeStr}</span>
                <div className="flex items-center gap-2 text-white/90">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z" />
                  </svg>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
                  </svg>
                  <span className="text-[10px]">98%</span>
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-1 overflow-y-auto flex flex-col bg-[#F4F7FC] text-slate-800">
                {children}
              </div>

              {/* Android Navigation Pill */}
              <div className="h-5 bg-[#F4F7FC] flex items-center justify-center shrink-0">
                <div className="w-28 h-1 bg-slate-400 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          // Wide View mode
          <div className="w-full max-w-4xl min-h-[700px] bg-[#F4F7FC] text-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700/60 flex flex-col">
            <div className="h-6 bg-[#1976D2] text-white px-6 flex items-center justify-between text-xs font-semibold shrink-0">
              <span>QuizMaster Android Preview (Expanded Mode)</span>
              <span>Material 3 Design</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
