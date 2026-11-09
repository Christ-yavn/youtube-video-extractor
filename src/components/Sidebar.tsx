import React from 'react';
import {
  Home,
  Video,
  FileText,
  Compass,
  Settings,
  Cloud,
  LucideIcon,
  Sun,
  Moon,
  Terminal,
  Cpu,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type PageId = 'accueil' | 'videos' | 'fiches' | 'concepts' | 'drive' | 'reglages';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  counts: {
    videosTotal: number;
    fichesCount: number;
    aTraiterCount: number;
  };
  isDriveConnected?: boolean;
}

interface NavItem {
  id: PageId;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  badge?: number;
  isStatusDot?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, counts, isDriveConnected }) => {
  const { toggleTheme, isDark } = useTheme();

  const navItems: NavItem[] = [
    { id: 'accueil', label: 'Compiler Studio', sublabel: 'Ingest & 3D Pipeline', icon: Home },
    { id: 'videos', label: 'YouTube Corpus', sublabel: 'Videos & 35m Slices', icon: Video, badge: counts.videosTotal },
    { id: 'fiches', label: 'Formal Specs', sublabel: 'Courses & Dual FSM', icon: FileText, badge: counts.fichesCount },
    { id: 'concepts', label: 'Master Bibles', sublabel: 'Multi-Video Synthesis', icon: Compass },
    { id: 'drive', label: 'Cloud Vault', sublabel: 'Zero-Storage Sync', icon: Cloud, isStatusDot: isDriveConnected },
    { id: 'reglages', label: 'LLM & Linter', sublabel: 'Models & API Keys', icon: Settings },
  ];

  const progressPercentage = counts.videosTotal > 0
    ? Math.round((counts.fichesCount / counts.videosTotal) * 100)
    : 0;

  return (
    <>
      {/* Desktop Fixed Sidebar — 2026 Dark OLED & Glassmorphism 2.0 */}
      <aside className="hidden md:flex flex-col w-68 bg-white/90 dark:bg-[#070A12]/90 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/[0.08] shrink-0 select-none z-30 transition-colors">
        {/* Brand Header with 3D Isometric Prism + Play Waveform */}
        <div className="h-20 flex items-center px-6 border-b border-slate-200/80 dark:border-white/[0.08] gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-orange-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center animate-float-3d">
            <div className="w-full h-full rounded-[14px] bg-slate-950/90 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" stroke="#818cf8" fill="rgba(99,102,241,0.18)" />
                <polygon points="10 8.5 16 12 10 15.5 10 8.5" fill="#fb923c" stroke="#fb923c" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-md pointer-events-none" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-extrabold text-slate-900 dark:text-white text-base leading-tight tracking-tight truncate">
                OmniScribe
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                v4.0
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-500/25 truncate">
                VIDEO → COURSE &amp; SPEC
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3.5 space-y-1.5 flex-1 overflow-y-auto" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/15 via-blue-500/10 to-transparent text-indigo-700 dark:text-white font-semibold border border-indigo-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-500 to-orange-500 rounded-r-full" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="tracking-tight text-xs sm:text-sm leading-tight truncate">{item.label}</div>
                    <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">{item.sublabel}</div>
                  </div>
                </div>

                {item.isStatusDot && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Sync</span>
                  </span>
                )}

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs font-mono tabular-nums font-bold rounded-lg border ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 border-indigo-400/40'
                        : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Corpus & Linter Telemetry */}
        <div className="px-4 py-3 border-t border-slate-200/80 dark:border-white/[0.08]">
          <div className="bg-slate-50/90 dark:bg-white/[0.03] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.07] space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Compiled Specs</span>
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-300 tabular-nums">
                {counts.fichesCount} / {counts.videosTotal} ({progressPercentage}%)
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-black/50 h-2 rounded-full overflow-hidden p-0.5 border border-slate-300/60 dark:border-white/5">
              <div
                className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-orange-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(6, progressPercentage)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Queue: <strong className="text-slate-700 dark:text-slate-200 font-bold">{counts.aTraiterCount}</strong> videos</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Linter 10/10 Gate
              </span>
            </div>
          </div>
        </div>

        {/* Claude Code Bridge & Theme Switcher Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/[0.08]">
          <div className="bg-slate-50/90 dark:bg-black/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.07]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] flex items-center gap-1">
                <Terminal className="w-3 h-3 text-orange-400" />
                <span>CLAUDE CODE BRIDGE</span>
              </span>
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-orange-600 dark:text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                READY
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
              4 Universal Domain Profiles
            </p>
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Benchmark #1 Loaded</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
                title="Toggle Dark OLED / Light Theme"
              >
                {isDark ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-indigo-600" />}
                <span>{isDark ? 'OLED Dark' : 'Alabaster'}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar (Fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#070A12]/95 border-t border-slate-200 dark:border-white/[0.08] z-50 flex items-center justify-around px-2 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium cursor-pointer ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
