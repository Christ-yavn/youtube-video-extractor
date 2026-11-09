import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  ChevronRight,
  Play,
  Sparkles,
  Zap,
  Layers,
  ShieldCheck,
  Terminal,
  Grid,
  AlertTriangle,
  Trash2,
  Cloud,
  Plus,
  Copy,
  Check,
  BookOpen,
  Cpu,
  Code2,
  Database,
  Globe,
  Beaker,
} from 'lucide-react';
import type { ConsolidatedVideoItem } from '../utils/pipeline';
import { formatSeconds, calculateSlices } from '../utils/pipeline';
import {
  DOMAIN_PROFILES,
  type DomainProfileId,
  buildUniversalExtractionPrompt,
} from '../utils/domainProfiles';
import type { TraceabilityRegistry } from '../services/traceabilityRegistry';

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
    label: 'MIT 6.824 (Systems)',
    channel: 'MIT OpenCourseWare',
    title: 'Lecture 6: Fault Tolerance & Raft Consensus State Machine',
    url: 'https://www.youtube.com/watch?v=64Zp3tzNbpE',
    duration: 4920,
    domain: 'SOFTWARE_AND_ALGORITHMS',
  },
  {
    label: 'Andrej Karpathy (AI/LLM)',
    channel: 'Andrej Karpathy',
    title: 'Deep Dive into LLMs, Tokenization & Transformer Compilers',
    url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI',
    duration: 5400,
    domain: 'UNIVERSAL_COURSE_COMPILER',
  },
  {
    label: 'Stanford STEM (Stochastic)',
    channel: 'Stanford University',
    title: 'Stochastic Control, Martingales & Continuous-Time Regimes',
    url: 'https://www.youtube.com/watch?v=PnPI8222340',
    duration: 3900,
    domain: 'STEM_AND_QUANT_SCIENCE',
  },
  {
    label: 'Benchmark #1 (BPR Etalon)',
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
  onStartAutomatedQueue,
  onAddCustomVideo,
}) => {
  const [hoveredVideo, setHoveredVideo] = useState<ConsolidatedVideoItem | null>(null);
  const [activeDomain, setActiveDomain] = useState<DomainProfileId>('UNIVERSAL_COURSE_COMPILER');

  // Universal YouTube Ingest Studio State
  const [customUrl, setCustomUrl] = useState<string>('https://www.youtube.com/watch?v=64Zp3tzNbpE');
  const [customChannel, setCustomChannel] = useState<string>('MIT OpenCourseWare');
  const [customTitle, setCustomTitle] = useState<string>('Lecture 6: Fault Tolerance & Raft Consensus State Machine');
  const [customDurationMin, setCustomDurationMin] = useState<number>(82);
  const [compiledPreviewPrompt, setCompiledPreviewPrompt] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // 3D Interactive Tilt state for the Hero Card
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 5, ry: x * 5 });
  };

  const handleMouseLeave3D = () => {
    setTilt({ rx: 0, ry: 0 });
  };

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

  const playlistGroups = useMemo(() => {
    const groups: Record<string, ConsolidatedVideoItem[]> = {
      P1: [],
      P2: [],
      P3: [],
      P4: [],
    };
    videos.forEach((v) => {
      const p = v.playlists[0] || 'P1';
      if (!groups[p]) groups[p] = [];
      groups[p].push(v);
    });
    return groups;
  }, [videos]);

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
      channelName: customChannel || 'Universal YouTube Channel',
      videoTitle: customTitle || 'Technical Video Lecture',
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
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* =====================================================================
          SECTION 1 — ASYMMETRIC BENTO HERO (7 COLS 3D STAGE + 5 COLS INGEST)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch perspective-1200">
        {/* LEFT 7 COLUMNS: 3D INTERACTIVE UNIVERSAL COMPILER STAGE */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          onMouseMove={handleMouseMove3D}
          onMouseLeave={handleMouseLeave3D}
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          }}
          className="lg:col-span-7 quant-card p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between preserve-3d"
        >
          {/* Ambient 3D Glow Orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-20 w-72 h-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Top Status Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>UNIVERSAL VIDEO-TO-COURSE &amp; FORMAL SPEC COMPILER v4.0</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-500/25">
                <Terminal className="w-3 h-3" />
                <span>Claude Code Native Bridge</span>
              </span>
            </div>

            {/* Editorial Display Headline */}
            <div className="space-y-2.5">
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Compile <span className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-orange-400 bg-clip-text text-transparent">Any YouTube Channel</span> into Courses, Formal Specs &amp; Code.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Transform any educational playlist, university lecture series, or technical video into structured <strong>8-section course handbooks</strong>, consolidated <code>MASTER_&lt;CONCEPT&gt;.md</code> bibles, <code>.jsonl</code> AI training datasets, and deterministic Dual-FSM specifications compiled via <strong>Claude Code</strong>.
              </p>
            </div>

            {/* Interactive 4-Domain Profile Selector */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Select Active Compilation Domain Profile</span>
                <span className="text-indigo-500 dark:text-indigo-400">{currentDomainProfile.primaryFsmName} × {currentDomainProfile.secondaryFsmName}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(DOMAIN_PROFILES) as DomainProfileId[]).map((domId) => {
                  const isSelected = activeDomain === domId;
                  const shortLabels: Record<DomainProfileId, { title: string; tag: string; icon: React.ReactNode }> = {
                    UNIVERSAL_COURSE_COMPILER: { title: 'Universal Course', tag: 'MOOC / Lectures', icon: <BookOpen className="w-3.5 h-3.5" /> },
                    SOFTWARE_AND_ALGORITHMS: { title: 'Software & CS', tag: 'Systems / AI', icon: <Code2 className="w-3.5 h-3.5" /> },
                    STEM_AND_QUANT_SCIENCE: { title: 'STEM & Math', tag: 'Proofs / Quant', icon: <Cpu className="w-3.5 h-3.5" /> },
                    MARKET_MICROSTRUCTURE_ICT: { title: 'Benchmark #1', tag: '106-Video Test', icon: <Beaker className="w-3.5 h-3.5" /> },
                  };
                  const info = shortLabels[domId];
                  return (
                    <button
                      key={domId}
                      type="button"
                      onClick={() => setActiveDomain(domId)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500/50 text-slate-900 dark:text-white shadow-sm'
                          : 'bg-slate-50/70 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/[0.07] text-slate-600 dark:text-slate-400 hover:border-indigo-400/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={isSelected ? 'text-indigo-500 dark:text-indigo-300' : 'text-slate-400'}>{info.icon}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                      </div>
                      <div className="text-xs font-bold leading-tight truncate">{info.title}</div>
                      <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">{info.tag}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Domain Telemetry Strip */}
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.07] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{currentDomainProfile.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  10/10 Linter Gate
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentDomainProfile.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {currentDomainProfile.supportedTargets.map((target) => (
                  <span
                    key={target}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-white dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                  >
                    --target {target}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-5 mt-4 border-t border-slate-200/80 dark:border-white/[0.07]">
            <button
              type="button"
              onClick={onNavigateToFiches}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Open Formal Specs &amp; Claude Code Bridge</span>
            </button>

            <button
              type="button"
              onClick={() => onStartAutomatedQueue('TOUTES')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-300/80 dark:border-white/10 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-orange-400" />
              <span>Batch Compile Queue</span>
            </button>
          </div>
        </motion.div>

        {/* RIGHT 5 COLUMNS: UNIVERSAL YOUTUBE CHANNEL / VIDEO INGEST STUDIO */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.06 }}
          className="lg:col-span-5 quant-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                    Universal YouTube Ingest Studio
                  </h2>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Analyze any YouTube video, lecture, or channel
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                35m Auto-Slicer
              </span>
            </div>

            {/* 1-Click Sample Channel Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                1-Click Channel Presets (Any Domain):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {UNIVERSAL_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-slate-100 hover:bg-indigo-50 dark:bg-white/[0.05] dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Universal Ingest Form */}
            <form onSubmit={handleCompileUniversalVideo} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  YouTube Video or Playlist URL
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Channel / University / Instructor
                  </label>
                  <input
                    type="text"
                    value={customChannel}
                    onChange={(e) => setCustomChannel(e.target.value)}
                    placeholder="e.g. MIT OpenCourseWare, 3Blue1Brown..."
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={customDurationMin}
                    onChange={(e) => setCustomDurationMin(parseInt(e.target.value || '35', 10))}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Lecture / Course Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Title of the lecture or tutorial..."
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-indigo-600 hover:from-orange-400 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-xs font-mono uppercase tracking-wider shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Compile Video ({Math.max(1, Math.ceil((customDurationMin * 60) / 2100))} Slice(s) × 35m)</span>
              </button>
            </form>

            {/* Generated Universal Prompt Preview */}
            <AnimatePresence>
              {compiledPreviewPrompt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-xl bg-slate-950 text-slate-100 border border-indigo-500/30 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold">✓ Universal Spec Prompt Compiled</span>
                    <button
                      type="button"
                      onClick={handleCopyPreviewPrompt}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] cursor-pointer"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-300 max-h-28 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {compiledPreviewPrompt}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* =====================================================================
          SECTION 2 — ASYMMETRIC BENTO GRID: 3 UNIVERSAL COMPILER PILLARS
          ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Pillar 1 (5 cols): Course Handbooks & Master Bibles */}
        <div className="md:col-span-5 quant-card p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                8-Section Course + MASTER.md
              </span>
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
              1. Universal Course Handbooks &amp; Synthesis
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every video slice is compiled into an 8-section university-grade study guide with exact <code>[MM:SS]</code> video timestamps, visual mental models, worked examples, and consolidated across playlists into <code>MASTER_&lt;CONCEPT&gt;.md</code> chapters.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToFiches}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 cursor-pointer"
          >
            <span>Explore Compiled Course Handbooks</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 2 (4 cols): Deterministic Linter & Dual FSM */}
        <div className="md:col-span-4 quant-card p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                38/38 Unit Tests
              </span>
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
              2. Deterministic Linter (10/10 Gate)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rejects vague prose and <code>TODO</code> placeholders. Enforces parameter tables <code>[P-xx]</code>, formal rules <code>[R-xx]</code>, rejection guards <code>[REJ-xx]</code>, Dual Finite State Machines, and 3 JSON test fixtures.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToFiches}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2 cursor-pointer"
          >
            <span>Inspect 10/10 Reference Etalon</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pillar 3 (3 cols): JSONL Dataset & Claude Code */}
        <div className="md:col-span-3 quant-card p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-500 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-500/20">
                .jsonl + Code
              </span>
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg">
              3. AI Datasets &amp; Claude Code
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Exports multi-turn <code>.jsonl</code> SFT/RAG datasets and compiles specs into Python, TypeScript, or Course Modules via Claude Code.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToFiches}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 hover:underline pt-2 cursor-pointer"
          >
            <span>Launch Compiler Bridge</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3 — EMPIRICAL BENCHMARK TEST #1 (106-VIDEO CASE STUDY)
          ===================================================================== */}
      {fakeClonesCount > 0 && (
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-rose-950/20 border border-red-200 dark:border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-red-950 dark:text-rose-200">
                {fakeClonesCount} legacy simulation files detected in Cloud Registry
              </h3>
              <p className="text-xs text-red-800 dark:text-rose-300 max-w-2xl leading-relaxed">
                Purge legacy simulation templates from the Cloud Vault to keep only verified 10/10 multimodal extractions.
              </p>
            </div>
          </div>
          {onNavigateToDrive && (
            <button
              type="button"
              onClick={onNavigateToDrive}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Open Cloud Vault</span>
            </button>
          )}
        </div>
      )}

      <div className="quant-card p-6 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                BENCHMARK TEST DATASET #1 — PREMIER TEST GRANDEUR NATURE
              </span>
              <span className="text-xs font-mono text-slate-400">
                • 106 Technical YouTube Videos (4 Playlists Deduplicated)
              </span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Grid className="w-4 h-4 text-indigo-500" />
              <span>Real-World Compiler Stress Test #1: Market Microstructure Corpus ({totalVideos} Videos)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
              To validate OmniScribe v4.0 on visually dense, non-trivial video lectures before general multi-channel deployment, this 106-video corpus (HugoFX channel) serves as <strong>Benchmark Test #1</strong> — testing multi-playlist deduplication, 35-minute temporal slicing, and zero-lookahead <code>ZONE_FSM × TRADE_FSM</code> compilation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs shrink-0">
            <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Validated 10/10 ({fichesReadyCount})</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Queued ({aTraiterCount})</span>
            </span>
            {nextVideo && (
              <button
                type="button"
                onClick={() => onSelectVideoToProcess(nextVideo)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 font-bold text-xs transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Inspect Next Video</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive 106-Video Benchmark Heatmap */}
        <div className="space-y-4">
          {Object.entries(playlistGroups).map(([playlistKey, pVideos]) => {
            const playlistReady = pVideos.filter((v) => {
              const r = registry.videoRecords[v.video_id];
              return r && (r.status === 'Extrait' || r.status === 'Validé') && !r.isFakeClone197;
            }).length;

            return (
              <div key={playlistKey} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-indigo-600 dark:text-indigo-300">
                    Benchmark Module {playlistKey} ({pVideos.length} videos)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {playlistReady} / {pVideos.length} compiled specs
                  </span>
                </div>

                <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1.5">
                  {pVideos.map((video, idx) => {
                    const trace = registry.videoRecords[video.video_id];
                    const isReady =
                      trace &&
                      (trace.status === 'Extrait' || trace.status === 'Validé') &&
                      !trace.isFakeClone197;
                    const isFake =
                      trace && (trace.status === 'Brouillon_Errone_197' || trace.isFakeClone197);

                    return (
                      <button
                        key={video.video_id}
                        type="button"
                        onClick={() => onSelectVideoToProcess(video)}
                        onMouseEnter={() => setHoveredVideo(video)}
                        onMouseLeave={() => setHoveredVideo(null)}
                        className={`h-8 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer border ${
                          isReady
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-2xs'
                            : isFake
                            ? 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40 animate-pulse'
                            : 'bg-slate-50 dark:bg-black/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-indigo-400 hover:text-indigo-500 hover:scale-105'
                        }`}
                        title={`${video.video_id} - ${video.titre} (${formatSeconds(video.duree_s)})`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hovered Video Telemetry Bar */}
        {hoveredVideo && (
          <div className="p-3 bg-slate-100/80 dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">[{hoveredVideo.video_id}]</span>
              <span className="text-slate-800 dark:text-slate-200 truncate font-sans font-medium">{hoveredVideo.titre}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
              <span>{formatSeconds(hoveredVideo.duree_s)} ({hoveredVideo.tranches_count} slice(s))</span>
              <span className="text-indigo-500 font-bold">{hoveredVideo.playlists.join(', ')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
