import React from 'react';
import { Search, Cloud, Sun, Moon, Github } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  driveStatus?: {
    isConnected: boolean;
    userEmail?: string;
    onOpenDrive: () => void;
  };
  onOpenGitHub?: () => void;
  selectedModel?: 'gemini-2.5-pro' | 'gemini-3.1-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash';
  onSelectModel?: (model: 'gemini-2.5-pro' | 'gemini-3.1-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash') => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  category = 'Studio',
  searchQuery,
  onSearchChange,
  primaryAction,
  driveStatus,
  onOpenGitHub,
}) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Clean Single-Line Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
          {category}
        </span>
        <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
          {title}
        </h2>
      </div>

      {/* Right: Clean Search & Primary Actions (Zero Overflow) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Search Input */}
        <div className="relative hidden sm:block w-60 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search videos or courses..."
            aria-label="Search videos and courses"
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white dark:bg-slate-800/70 dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-14 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded pointer-events-none">
            Ctrl K
          </kbd>
        </div>

        {/* Cloud Backup Status */}
        {driveStatus && (
          <button
            type="button"
            onClick={driveStatus.onOpenDrive}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              driveStatus.isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
            title={driveStatus.isConnected ? `Connected (${driveStatus.userEmail})` : 'Personal Google Drive Backup'}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{driveStatus.isConnected ? 'Drive Synced' : 'Local Mode'}</span>
          </button>
        )}

        {/* GitHub Link */}
        {onOpenGitHub && (
          <button
            type="button"
            onClick={onOpenGitHub}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="GitHub Repository"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Light or Dark mode"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Primary Action Button */}
        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            {primaryAction.icon}
            <span>{primaryAction.label}</span>
          </button>
        )}
      </div>
    </header>
  );
};
