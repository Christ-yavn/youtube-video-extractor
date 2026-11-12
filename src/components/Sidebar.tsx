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
  CheckCircle2,
  Terminal,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export type PageId = 'landing' | 'accueil' | 'videos' | 'fiches' | 'concepts' | 'drive' | 'reglages';

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
  icon: LucideIcon;
  badge?: number;
  isStatusDot?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, counts, isDriveConnected }) => {
  const { toggleTheme, isDark } = useTheme();
  const { t, language } = useLanguage();

  const navItems: NavItem[] = [
    { id: 'landing', label: language === 'fr' ? 'Vitrine / Accueil' : 'Showcase / Home', icon: Sparkles },
    { id: 'accueil', label: t('nav.compilerStudio'), icon: Home },
    { id: 'videos', label: t('nav.videoLibrary'), icon: Video, badge: counts.videosTotal },
    { id: 'fiches', label: t('nav.coursesSpecs'), icon: FileText, badge: counts.fichesCount },
    { id: 'concepts', label: t('nav.masterConcepts'), icon: Compass },
    { id: 'drive', label: t('nav.cloudBackup'), icon: Cloud, isStatusDot: isDriveConnected },
    { id: 'reglages', label: t('nav.apiSettings'), icon: Settings },
  ];

  const progressPercentage = counts.videosTotal > 0
    ? Math.round((counts.fichesCount / counts.videosTotal) * 100)
    : 0;

  return (
    <>
      {/* Desktop Sidebar — Clean, Airy & Legible */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 select-none z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-slate-900 dark:text-white text-sm tracking-tight truncate">
                YouTube Extractor
              </span>
              <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                v4.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Video to Course &amp; Code
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.isStatusDot && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{t('nav.sync')}</span>
                  </span>
                )}

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs font-mono tabular-nums rounded-md ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-200 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Clean Progress & Theme Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('nav.validatedSheets')}</span>
              </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                {counts.fichesCount} / {counts.videosTotal}
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, progressPercentage)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{t('nav.linterGate')}</span>
              <span>{t('nav.testCount')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors cursor-pointer"
          >
            <span>{t('nav.appearance')}</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{isDark ? t('nav.switchToLight') : t('nav.switchToDark')}</span>
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium cursor-pointer ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
