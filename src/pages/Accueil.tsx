import React, { useMemo, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  Sparkles,
  ShieldCheck,
  Terminal,
  AlertTriangle,
  Trash2,
  Plus,
  Copy,
  Check,
  BookOpen,
  Cpu,
  Code2,
  Database,
  Beaker,
  SlidersHorizontal,
} from 'lucide-react';
import type { ConsolidatedVideoItem } from '../utils/pipeline';
import { formatSeconds, calculateSlices } from '../utils/pipeline';
import {
  DOMAIN_PROFILES,
  type DomainProfileId,
  buildUniversalExtractionPrompt,
} from '../utils/domainProfiles';
import type { TraceabilityRegistry } from '../services/traceabilityRegistry';
import { useLanguage } from '../context/LanguageContext';

interface AccueilProps {
  videos: ConsolidatedVideoItem[];
  registry: TraceabilityRegistry;
  savedFiches?: Record<string, string>;
  dailyQuotaLimit?: number;
  dailyQuotaUsed?: number;
  onNavigateToVideos: (statusFilter?: string) => void;
  onNavigateToFiches: () => void;
  onNavigateToDrive?: () => void;
  onSelectVideoToProcess: (video: ConsolidatedVideoItem) => void;
  onStartAutomatedQueue: (playlistCode?: string) => void;
  onAddCustomVideo?: (video: ConsolidatedVideoItem, domainId: DomainProfileId) => void;
}

const UNIVERSAL_PRESETS: {
  label: string;
  channel: string;
  title: string;
  url: string;
  duration: number;
  domain: DomainProfileId;
}[] = [
  {
    label: 'MIT Distributed Systems',
    channel: 'MIT OpenCourseWare',
    title: 'Lecture 6: Fault Tolerance & Raft Consensus State Machine',
    url: 'https://www.youtube.com/watch?v=64Zp3tzNbpE',
    duration: 4920,
    domain: 'SOFTWARE_AND_ALGORITHMS',
  },
  {
    label: 'Andrej Karpathy (LLMs)',
    channel: 'Andrej Karpathy',
    title: 'Deep Dive into LLMs, Tokenization & Transformer Compilers',
    url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI',
    duration: 5400,
    domain: 'UNIVERSAL_COURSE_COMPILER',
  },
  {
    label: 'Stanford Math & Science',
    channel: 'Stanford University',
    title: 'Stochastic Control, Martingales & Continuous-Time Regimes',
    url: 'https://www.youtube.com/watch?v=PnPI8222340',
    duration: 3900,
    domain: 'STEM_AND_QUANT_SCIENCE',
  },
  {
    label: 'Benchmark #1 (dg2-OsUXN60)',
    channel: 'Benchmark Test #1 (HugoFX)',
    title: 'Balanced Price Range (BPR) — Zero-Lookahead Dual FSM',
    url: 'https://www.youtube.com/watch?v=dg2-OsUXN60',
    duration: 1890,
    domain: 'MARKET_MICROSTRUCTURE_ICT',
  },
];

export const Accueil: React.FC<AccueilProps> = ({
  videos,
  registry,
  savedFiches = {},
  onNavigateToVideos,
  onNavigateToFiches,
  onNavigateToDrive,
  onSelectVideoToProcess,
  onAddCustomVideo,
}) => {
  const { t } = useLanguage();
  const [activeDomain, setActiveDomain] = useState<DomainProfileId>('UNIVERSAL_COURSE_COMPILER');
  const [showAdvancedFields, setShowAdvancedFields] = useState<boolean>(false);
  const [showBenchmarkGrid, setShowBenchmarkGrid] = useState<boolean>(false);

  // Universal YouTube Ingest State
  const [customUrl, setCustomUrl] = useState<string>('https://www.youtube.com/watch?v=64Zp3tzNbpE');
  const [customChannel, setCustomChannel] = useState<string>('MIT OpenCourseWare');
  const [customTitle, setCustomTitle] = useState<string>('Lecture 6: Fault Tolerance & Raft Consensus State Machine');
  const [customDurationMin, setCustomDurationMin] = useState<number>(82);
  const [compiledPreviewPrompt, setCompiledPreviewPrompt] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const totalVideos = videos.length;

  const fichesReadyCount = useMemo(() => {
    const idSet = new Set<string>(Object.keys(savedFiches));
    Object.entries(registry.videoRecords).forEach(([vid, r]) => {
      if ((r.status === 'Extrait' || r.status === 'Validé') && !r.isFakeClone197) {
        idSet.add(vid);
      }
    });
    return idSet.size;
  }, [registry, savedFiches]);

  const fakeClonesCount = useMemo(() => {
    return Object.values(registry.videoRecords).filter(
      (r) => r.status === 'Brouillon_Errone_197' || r.isFakeClone197
    ).length;
  }, [registry]);

  const aTraiterCount = Math.max(0, totalVideos - fichesReadyCount);

  const nextVideo = useMemo(() => {
    return (
      videos.find((v) => {
        if (savedFiches[v.video_id]) return false;
        const rec = registry.videoRecords[v.video_id];
        return !rec || rec.isFakeClone197 || (rec.status !== 'Extrait' && rec.status !== 'Validé');
      }) || videos[0]
    );
  }, [videos, registry, savedFiches]);

  const currentDomainProfile = DOMAIN_PROFILES[activeDomain];

  const extractYoutubeIdClean = (rawUrl: string): string => {
    const match = rawUrl.match(/(?:v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    if (match) return match[1];
    const clean = rawUrl.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 11);
    return clean || 'custom_vid1';
  };

  const handleApplyPreset = (preset: (typeof UNIVERSAL_PRESETS)[number]) => {
    setCustomUrl(preset.url);
    setCustomChannel(preset.channel);
    setCustomTitle(preset.title);
    setCustomDurationMin(Math.round(preset.duration / 60));
    setActiveDomain(preset.domain);
  };

  const handleCompileUniversalVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const vidId = extractYoutubeIdClean(customUrl);
    const durationSec = Math.max(60, customDurationMin * 60);
    const slices = calculateSlices(vidId, durationSec, 35);
    const firstSlice = slices[0];

    const prompt = buildUniversalExtractionPrompt({
      domainId: activeDomain,
      channelName: customChannel || 'YouTube Educational Channel',
      videoTitle: customTitle || 'Video Lecture',
      videoUrl: customUrl,
      sliceIndex: firstSlice?.slice_index ?? 1,
      totalSlices: firstSlice?.total_slices ?? 1,
      startTimestamp: firstSlice?.formatted_start ?? '00:00',
      endTimestamp: firstSlice?.formatted_end ?? '35:00',
    });

    setCompiledPreviewPrompt(prompt);

    const newVideoItem: ConsolidatedVideoItem = {
      id_video: vidId,
      video_id: vidId,
      playlists: ['P1'],
      titre: `[${customChannel}] ${customTitle}`,
      date_video: new Date().toISOString().slice(0, 10),
      duree_s: durationSec,
      famille: 'FORMATION_2026',
      vague: 3,
      valeur: 'ESSENTIEL',
      statut: '2_A_EXTRAIRE',
      url: customUrl.startsWith('http') ? customUrl : `https://www.youtube.com/watch?v=${vidId}`,
      description: `Universal Domain: ${activeDomain} | Channel: ${customChannel}`,
      tranches_count: slices.length,
    };

    if (onAddCustomVideo) {
      onAddCustomVideo(newVideoItem, activeDomain);
    }
  };

  const handleCopyPreviewPrompt = async () => {
    if (!compiledPreviewPrompt) return;
    await navigator.clipboard.writeText(compiledPreviewPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const sliceCount = Math.max(1, Math.ceil((customDurationMin * 60) / 2100));

  const domainTabItems: { id: DomainProfileId; label: string; icon: React.ReactNode }[] = [
    { id: 'UNIVERSAL_COURSE_COMPILER', label: 'University & Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'SOFTWARE_AND_ALGORITHMS', label: 'Software & AI', icon: <Code2 className="w-4 h-4" /> },
    { id: 'STEM_AND_QUANT_SCIENCE', label: 'Math & Science', icon: <Cpu className="w-4 h-4" /> },
    { id: 'MARKET_MICROSTRUCTURE_ICT', label: 'Market Benchmark #1', icon: <Beaker className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* =====================================================================
          SECTION 1 — CLEAN, SPACIOUS HERO & UNIFIED YOUTUBE URL STUDIO
          ===================================================================== */}
      <section className="quant-card p-6 sm:p-10 space-y-7">
        {/* Top Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>YouTube Video Extractor v4.0</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/70 dark:border-amber-500/30">
            <Terminal className="w-3.5 h-3.5" />
            <span>{t('accueil.heroCompilerBadge')}</span>
          </div>
        </div>

        {/* Clear, Legible Headline & Subtitle */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {t('accueil.heroTitle')}{' '}
            <span className="text-indigo-600 dark:text-indigo-400">{t('accueil.heroTitleAccent')}</span>.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('accueil.heroSubtitle')}
          </p>
        </div>

        {/* Step 1: Clean 4-Tab Domain Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{t('accueil.step1Domain')}</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {currentDomainProfile.name}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {domainTabItems.map((tab) => {
              const isSelected = activeDomain === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDomain(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}>
                    {tab.icon}
                  </span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Clean Unified YouTube URL Form */}
        <form onSubmit={handleCompileUniversalVideo} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="youtube-url-input" className="sr-only">
                YouTube Video or Playlist URL
              </label>
              <input
                id="youtube-url-input"
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder={t('accueil.urlPlaceholder')}
                className="w-full h-12 bg-slate-50 focus:bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t('accueil.analyzeButton', { count: sliceCount })}</span>
            </button>
          </div>

          {/* Quick Example Presets & Optional Metadata Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">{t('accueil.tryExample')}</span>
              {UNIVERSAL_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedFields(!showAdvancedFields)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvancedFields ? t('accueil.hideDetails') : t('accueil.videoDetails', { min: customDurationMin })}</span>
            </button>
          </div>

          {/* Collapsible Video Metadata Fields (Progressive Disclosure) */}
          {showAdvancedFields && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t('accueil.channelLabel')}
                </label>
                <input
                  type="text"
                  value={customChannel}
                  onChange={(e) => setCustomChannel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="sm:col-span-6">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t('accueil.lectureTitleLabel')}
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t('accueil.durationLabel')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={customDurationMin}
                  onChange={(e) => setCustomDurationMin(parseInt(e.target.value || '35', 10))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </form>

        {/* Compiled Prompt Preview (Only shown after clicking Analyze & Compile) */}
        {compiledPreviewPrompt && (
          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-semibold">
                ✓ Video queued ({sliceCount} × 35m slices) &amp; extraction prompt ready
              </span>
              <button
                type="button"
                onClick={handleCopyPreviewPrompt}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300 max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {compiledPreviewPrompt}
            </pre>
          </div>
        )}
      </section>

      {/* =====================================================================
          SECTION 2 — 3 CLEAR STEPS: WHAT THE COMPILER PRODUCES
          ===================================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="quant-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
              {t('accueil.step1Title')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('accueil.step1Desc')}
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToFiches}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <span>{t('accueil.step1Btn')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2 */}
        <div className="quant-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
              {t('accueil.step2Title')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('accueil.step2Desc')}
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToFiches}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <span>{t('accueil.step2Btn')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3 */}
        <div className="quant-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
              {t('accueil.step3Title')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('accueil.step3Desc')}
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToFiches}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <span>{t('accueil.step3Btn')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3 — CLEAN BENCHMARK TEST #1 SUMMARY CARD (PROGRESSIVE DISCLOSURE)
          ===================================================================== */}
      {fakeClonesCount > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-rose-950/30 border border-red-200 dark:border-rose-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-xs text-red-900 dark:text-rose-200">
              <strong>{t('accueil.clonesWarning', { count: fakeClonesCount })}</strong>
            </p>
          </div>
          {onNavigateToDrive && (
            <button
              type="button"
              onClick={onNavigateToDrive}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
              {t('accueil.cleanVault')}
            </button>
          )}
        </div>
      )}

      <section className="quant-card p-6 sm:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Beaker className="w-4 h-4" />
              <span>{t('accueil.benchmarkBadge')}</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t('accueil.benchmarkTitle', { total: totalVideos })}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {t('accueil.benchmarkDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateToFiches}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('accueil.step2Btn')}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToVideos()}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm cursor-pointer"
            >
              {t('accueil.browseVideos', { total: totalVideos })}
            </button>
          </div>
        </div>

        {/* Clean Status Bar + Optional Expandable Grid */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{t('accueil.validatedSheets')} <strong>{fichesReadyCount}</strong></span>
            </span>
            <span className="flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>{t('accueil.queuedInBenchmark')} <strong>{aTraiterCount}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {nextVideo && (
              <button
                type="button"
                onClick={() => onSelectVideoToProcess(nextVideo)}
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t('accueil.openNextQueued')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowBenchmarkGrid(!showBenchmarkGrid)}
              className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              <span>{showBenchmarkGrid ? t('accueil.hideMap') : t('accueil.showMap')}</span>
              {showBenchmarkGrid ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showBenchmarkGrid && (
          <div className="pt-3 grid grid-cols-10 sm:grid-cols-16 md:grid-cols-22 gap-1.5">
            {videos.map((video, idx) => {
              const trace = registry.videoRecords[video.video_id];
              const isReady =
                Boolean(savedFiches[video.video_id]) ||
                (trace && (trace.status === 'Extrait' || trace.status === 'Validé') && !trace.isFakeClone197);

              return (
                <button
                  key={video.video_id}
                  type="button"
                  onClick={() => onSelectVideoToProcess(video)}
                  className={`h-8 rounded-lg text-xs font-mono font-medium flex items-center justify-center transition-colors cursor-pointer border ${
                    isReady
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 font-semibold'
                      : 'bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                  title={`${video.video_id} — ${video.titre} (${formatSeconds(video.duree_s)})`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
