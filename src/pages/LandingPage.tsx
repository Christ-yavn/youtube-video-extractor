import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Video,
  FileCode2,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Compass,
  Play,
  Database,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Code2,
  GitBranch,
  Zap,
} from 'lucide-react';
import { DOMAIN_PROFILES, type DomainProfileId } from '../utils/domainProfiles';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onExploreBenchmark: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onExploreBenchmark,
}) => {
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Ambient background glow meshes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] -left-[10%] w-[600px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[65%] -right-[10%] w-[600px] h-[500px] bg-emerald-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#06080F]/80 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full rounded-[11px] bg-[#0A0D17] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">YouTube Video Extractor</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  v4.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Universal Video-to-Course & AI Dataset Compiler</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#domaines" className="hover:text-white transition-colors">4 Domaines</a>
            <a href="#benchmark" className="hover:text-white transition-colors">Benchmark #1</a>
            <a href="#claude" className="hover:text-white transition-colors">Pont Claude Code</a>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Christ-yavn/youtube-video-extractor"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub</span>
            </a>

            <button
              onClick={onEnterDashboard}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-xl shadow-indigo-500/25 transition-all duration-300 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 transition-all duration-300 group-hover:opacity-90" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-opacity duration-500 blur-sm" />
              <span className="relative z-10 flex items-center gap-2">
                <span>Arriver sur le Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300 mb-8 backdrop-blur-md"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Multimodal Gemini 2.5/3.6 & Native Claude Code Compiler</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
        >
          Du Streaming Vidéo Brut au{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
            Savoir Formel & Code Exécutable
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal"
        >
          Le premier compilateur open-source qui convertit n'importe quelle playlist, conférence ou cours YouTube
          en <strong className="text-white font-semibold">manuels pédagogiques 8 sections</strong>,{' '}
          <strong className="text-white font-semibold">spécifications formelles Dual-FSM</strong> et{' '}
          <strong className="text-white font-semibold">moteurs de code testés sans lookahead bias</strong>.
        </motion.p>

        {/* Dual Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            data-testid="enter-dashboard-cta"
            onClick={onEnterDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <span>Arriver sur le Dashboard de l'application</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreBenchmark}
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] backdrop-blur-xl transition-all flex items-center justify-center gap-2.5"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>Explorer le Benchmark (106 Vidéos)</span>
          </button>
        </motion.div>

        {/* Live Metrics Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl"
        >
          <div className="p-3 text-center border-r border-white/[0.06] last:border-none">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">106</div>
            <div className="text-xs text-slate-400 mt-1">Vidéos de Benchmark Indexées</div>
          </div>
          <div className="p-3 text-center sm:border-r border-white/[0.06]">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">38 / 38</div>
            <div className="text-xs text-slate-400 mt-1">Tests Déterministes Validés</div>
          </div>
          <div className="p-3 text-center border-r border-white/[0.06] last:border-none">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">35 min</div>
            <div className="text-xs text-slate-400 mt-1">Slicing Temporel Anti-Perte</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">Dual-FSM</div>
            <div className="text-xs text-slate-400 mt-1">Machine à États Déterministe</div>
          </div>
        </motion.div>
      </section>

      {/* Section: Le Pipeline Déterministe */}
      <section id="pipeline" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300 uppercase tracking-wider mb-3">
            Architecture de Bout en Bout
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comment le Compilateur Transforme la Vidéo en Code
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Fini les résumés vagues et les hallucinations. Le pipeline applique 4 filtres stricts et déterministes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Étape 1 */}
          <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 text-indigo-400 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-indigo-400 font-semibold mb-1">ÉTAPE 01</div>
            <h3 className="text-lg font-bold text-white mb-2">Ingestion & Slicing 35 min</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Découpe automatique par tranches de 2100s. Ingestion multimodale directe (flux vidéo + audio) pour lire les bougies, le code et les schémas à l'écran.
            </p>
          </div>

          {/* Étape 2 */}
          <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-purple-400 font-semibold mb-1">ÉTAPE 02</div>
            <h3 className="text-lg font-bold text-white mb-2">Linter Déterministe 10/10</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vérification stricte par <code className="text-purple-300">lintFicheV3</code>. Zéro placeholder, tables [P-xx], règles d'invalidation [REJ-xx] et 3 fixtures de test JSON.
            </p>
          </div>

          {/* Étape 3 */}
          <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 text-cyan-400 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">ÉTAPE 03</div>
            <h3 className="text-lg font-bold text-white mb-2">Consolidation Master Bibles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fusion chronologique multi-vidéos (<code className="text-cyan-300">MASTER_*.md</code>) qui résout les contradictions du formateur au fil des années.
            </p>
          </div>

          {/* Étape 4 */}
          <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 text-emerald-400 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">ÉTAPE 04</div>
            <h3 className="text-lg font-bold text-white mb-2">Compilateur Claude Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Génération directe de moteurs de trading MQL5, PineScript v6, modules Python 3.11+, TypeScript ou datasets RAG .jsonl pour agents IA.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Les 4 Domaines Universels */}
      <section id="domaines" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300 uppercase tracking-wider mb-3">
            Polyvalence v4.0.0
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Quatre Profils de Domaines Universels
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Chaque domaine active sa propre Double Machine à États et ses cibles de compilation spécifiques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(DOMAIN_PROFILES).map((profile) => (
            <div
              key={profile.id}
              className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
                    {profile.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{profile.primaryFsmName}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{profile.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">{profile.tagline}</p>

                <div className="space-y-2 mb-6">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Cibles de Code :</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.supportedTargets.map((target) => (
                      <span
                        key={target}
                        className="px-2 py-0.5 text-xs font-mono rounded bg-white/[0.04] text-slate-200 border border-white/[0.08]"
                      >
                        --target {target}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Dual-FSM : {profile.secondaryFsmName}</span>
                <button
                  onClick={onEnterDashboard}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group"
                >
                  <span>Configurer dans le Studio</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Focus Benchmark #1 (HugoFX SMC/ICT) */}
      <section id="benchmark" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 via-[#0A0D1A] to-[#06080F] border border-indigo-500/20 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <span className="px-3 py-1 text-xs font-mono uppercase tracking-wider font-semibold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Benchmark Corpus #1
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
              106 Vidéos de Trading Institutionnel Intégralement Décortiquées
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Découvrez la cartographie complète des 7 Piliers SMC/ICT (BPR, FVG, Order Blocks, Liquidity Sweeps, Daily Bias, CISD, Psychologie)
              convertis en règles causales sans barème arbitraire et sans indicateurs en retard.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onExploreBenchmark}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <span>Ouvrir le Corpus Vidéo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onEnterDashboard}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08] transition-colors"
              >
                <span>Accéder au Compiler Studio</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Final CTA */}
      <section className="relative z-10 py-24 px-6 text-center max-w-4xl mx-auto border-t border-white/[0.06]">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
          Prêt à Compiler Votre Premier Cours ou Bot ?
        </h2>
        <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
          Rejoignez l'espace de travail pour lancer l'ingestion multimodale, auditer vos fiches de concepts et exporter vers Claude Code.
        </p>

        <button
          onClick={onEnterDashboard}
          className="px-10 py-5 rounded-2xl text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-[1.03] active:scale-95 transition-all inline-flex items-center gap-3"
        >
          <span>Arriver sur le Dashboard de l'application</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6 border-t border-white/[0.06] text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 YouTube Video Extractor — Licence MIT. Conçu avec rigueur formelle.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="https://github.com/Christ-yavn/youtube-video-extractor" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub Repo
            </a>
            <a href="https://github.com/Christ-yavn/youtube-video-extractor/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Licence MIT
            </a>
            <button onClick={onEnterDashboard} className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Accès Studio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
