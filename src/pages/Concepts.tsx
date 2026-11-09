import React, { useState } from 'react';
import {
  Compass,
  TrendingUp,
  Target,
  Box,
  Calendar,
  Zap,
  ShieldCheck,
  BookOpen,
  Code2,
  Cpu,
  Beaker,
} from 'lucide-react';

import type { ConsolidatedVideoItem } from '../utils/pipeline';
import type { TraceabilityRegistry } from '../services/traceabilityRegistry';
import { classifyVideoTaxonomy } from '../utils/ictTaxonomy';
import { DOMAIN_PROFILES, type DomainProfileId } from '../utils/domainProfiles';
import { useLanguage } from '../context/LanguageContext';

interface ConceptsProps {
  savedFichesCount: number;
  registry?: TraceabilityRegistry;
  videos?: ConsolidatedVideoItem[];
  savedFiches?: Record<string, string>;
}

export const Concepts: React.FC<ConceptsProps> = ({
  savedFichesCount,
  registry,
  videos = [],
  savedFiches = {},
}) => {
  const { t } = useLanguage();
  const [selectedDomain, setSelectedDomain] = useState<DomainProfileId>('UNIVERSAL_COURSE_COMPILER');

  const getPillarStats = (
    folderPrefixes: string | string[],
    fallbackValidated: number,
    fallbackTotal: number
  ) => {
    if (!videos.length) {
      return { validatedCount: fallbackValidated, totalCount: fallbackTotal };
    }
    const prefixes = Array.isArray(folderPrefixes) ? folderPrefixes : [folderPrefixes];
    const matchingVideos = videos.filter(v => {
      const cat = classifyVideoTaxonomy({
        titre: v.titre,
        famille: v.famille,
        playlists: v.playlists,
        description: savedFiches[v.video_id],
        video_id: v.video_id,
      });
      return prefixes.some(prefix => cat.pillarFolder.startsWith(prefix));
    });
    const totalCount = Math.max(1, matchingVideos.length);
    const validatedCount = matchingVideos.filter(v => {
      if (savedFiches[v.video_id]) return true;
      const rec = registry?.videoRecords[v.video_id];
      return Boolean(rec && !rec.isFakeClone197 && (rec.status === 'Extrait' || rec.status === 'Validé'));
    }).length;
    return { validatedCount, totalCount };
  };

  const s1 = getPillarStats('01_', 0, 5);
  const s2 = getPillarStats('02_', 1, 5);
  const s3 = getPillarStats('03_', savedFichesCount >= 1 ? 2 : 0, 7);
  const s4 = getPillarStats(['04_', '06_'], 0, 6);
  const s5 = getPillarStats('05_', 0, 5);
  const s6 = getPillarStats('07_', 0, 4);

  const benchmarkPillars = [
    {
      id: 'structure',
      name: '1. Structure de Marché (Market Structure)',
      description: 'Cartographie directionnelle fondamentale des mouvements institutionnels.',
      icon: TrendingUp,
      subConcepts: ['BOS (Break of Structure)', 'CHoCH (Change of Character)', 'MSS (Market Structure Shift)', 'Structure Interne vs Externe', 'Dealing Range'],
      validatedCount: s1.validatedCount,
      totalCount: s1.totalCount,
      status: s1.validatedCount > 0 ? t('concepts.statusInProgress') : t('concepts.statusToConsolidate'),
      accentColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
    },
    {
      id: 'liquidite',
      name: '2. Liquidité & Chasse aux Stops',
      description: 'Carburant des algorithmes institutionnels (Order Routing & Liquidity Pools).',
      icon: Target,
      subConcepts: ['BSL (Buy-Side Liquidity)', 'SSL (Sell-Side Liquidity)', 'EQH / EQL (Equal Highs/Lows)', 'Inducement (Piège)', 'Liquidity Sweep'],
      validatedCount: s2.validatedCount,
      totalCount: s2.totalCount,
      status: s2.validatedCount > 0 ? t('concepts.statusInProgress') : t('concepts.statusTodo'),
      accentColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    },
    {
      id: 'zones',
      name: '3. Zones de Prix (PD Arrays & Imbalances)',
      description: 'Points de déséquilibre et empreintes algorithmiques majeures sur le carnet.',
      icon: Box,
      subConcepts: ['BPR (Balanced Price Range)', 'FVG (Fair Value Gap)', 'IFVG (Inversion FVG)', 'Order Block (OB)', 'Breaker Block', 'Mitigation Block', 'Consequent Encroachment (50% CE)'],
      validatedCount: s3.validatedCount,
      totalCount: s3.totalCount,
      status: s3.validatedCount > 0 ? t('concepts.statusMasterReady') : t('concepts.statusTodo'),
      accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    },
    {
      id: 'temps',
      name: '4. Temps & Macro (Time & Price)',
      description: 'Alignement algorithmique avec les sessions majeures et les flux macroéconomiques.',
      icon: Calendar,
      subConcepts: ['Killzone Londres', 'Killzone New York', 'Open Asiatique', 'Daily Bias (Biais Journalier)', 'AMD (Accumulation Manipulation Distribution)', 'Power of 3 (PO3)'],
      validatedCount: s4.validatedCount,
      totalCount: s4.totalCount,
      status: s4.validatedCount > 0 ? t('concepts.statusInProgress') : t('concepts.statusTodo'),
      accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    },
    {
      id: 'setups',
      name: "5. Modèles d'Exécution & Setups Standardisés",
      description: "Règles déterministes d'entrée, de gestion du risque et d'invalidation.",
      icon: Zap,
      subConcepts: ['Modèle ICT 2022', 'Silver Bullet (10h-11h NY)', 'Judas Swing', 'London Breakout', 'Optimal Trade Entry (OTE 62%-79%)'],
      validatedCount: s5.validatedCount,
      totalCount: s5.totalCount,
      status: s5.validatedCount > 0 ? t('concepts.statusInProgress') : t('concepts.statusTodo'),
      accentColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    },
    {
      id: 'risque',
      name: '6. Risque & Psychologie Algorithmique',
      description: 'Dimensionnement dynamique des positions et règles strictes de non-intervention.',
      icon: ShieldCheck,
      subConcepts: ['Taille de Risque Fixe (% Equity)', 'Trailing Stop / Breakeven', 'Clôture Partielle (TP1 / TP2)', 'Filtre de News Économiques'],
      validatedCount: s6.validatedCount,
      totalCount: s6.totalCount,
      status: s6.validatedCount > 0 ? t('concepts.statusInProgress') : t('concepts.statusPriority'),
      accentColor: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    },
  ];

  const activeProfile = DOMAIN_PROFILES[selectedDomain];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Taxonomy Overview + Universal Domain Switcher */}
      <div className="quant-card p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>{t('concepts.taxonomyTitle')}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {activeProfile.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl">
              {activeProfile.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl font-mono text-xs bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 font-bold">
              {t('concepts.validatedSpecsBadge', { count: savedFichesCount })}
            </span>
          </div>
        </div>

        {/* 4 Domain Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/80 dark:border-white/10">
          {(Object.keys(DOMAIN_PROFILES) as DomainProfileId[]).map(domId => {
            const isSelected = selectedDomain === domId;
            const meta: Record<DomainProfileId, { label: string; sub: string; icon: React.ReactNode }> = {
              UNIVERSAL_COURSE_COMPILER: { label: '1. Universal Courses', sub: 'Lectures, MOOCs & Textbooks', icon: <BookOpen className="w-4 h-4" /> },
              SOFTWARE_AND_ALGORITHMS: { label: '2. Software & AI', sub: 'CS, Systems & Agentic Code', icon: <Code2 className="w-4 h-4" /> },
              STEM_AND_QUANT_SCIENCE: { label: '3. STEM & Quant Science', sub: 'Math, Physics & Econometrics', icon: <Cpu className="w-4 h-4" /> },
              MARKET_MICROSTRUCTURE_ICT: { label: '4. Benchmark Test #1 (106)', sub: 'HugoFX Test Corpus (6 Pillars)', icon: <Beaker className="w-4 h-4" /> },
            };
            const item = meta[domId];
            return (
              <button
                key={domId}
                type="button"
                onClick={() => setSelectedDomain(domId)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-slate-900 dark:text-white shadow-xs'
                    : 'bg-slate-50/70 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="mt-0.5 text-indigo-500">{item.icon}</div>
                <div>
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[11px] font-mono text-slate-400">{item.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render either the Universal Domain Taxonomy Pillars or the 6 Benchmark #1 Pillars */}
      {selectedDomain !== 'MARKET_MICROSTRUCTURE_ICT' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeProfile.defaultTaxonomy.map((cat, idx) => (
            <div key={cat.id} className="quant-card p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                    MASTER_{cat.id}.md
                  </span>
                  <span className="text-xs font-mono text-emerald-500 font-bold">
                    {activeProfile.primaryFsmName} × {activeProfile.secondaryFsmName}
                  </span>
                </div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                  {t('concepts.pillarLabel', { idx: idx + 1, title: cat.label })}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('concepts.pillarDesc', { id: cat.id })}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.keywords.map(kw => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benchmarkPillars.map(pillar => {
            const Icon = pillar.icon;
            const pct = Math.round((pillar.validatedCount / pillar.totalCount) * 100);

            return (
              <div
                key={pillar.id}
                className="quant-card p-5 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`p-2 rounded-xl border ${pillar.accentColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${pillar.accentColor}`}>
                      {pillar.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                      {pillar.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      {t('concepts.subConcepts')}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {pillar.subConcepts.map(sub => (
                        <span
                          key={sub}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{t('concepts.benchmarkCoverage')}</span>
                    <span className="text-slate-900 dark:text-white font-bold tabular-nums">
                      {pillar.validatedCount} / {pillar.totalCount} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-black/40 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-white/5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
