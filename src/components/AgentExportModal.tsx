import React, { useState, useMemo } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Download,
  Layers,
  Database,
  Terminal,
  Sparkles,
  Play,
  FileCode2,
  ShieldCheck,
} from 'lucide-react';
import {
  buildConsolidatedConcepts,
  generateTrainingDatasetJsonl,
} from '../services/conceptConsolidatorService';

interface AgentExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedFiches: Record<string, string>;
  initialVideoId?: string;
  initialTab?: 'claude' | 'consolidate' | 'dataset';
}

export const AgentExportModal: React.FC<AgentExportModalProps> = ({
  isOpen,
  onClose,
  savedFiches,
  initialVideoId,
  initialTab = 'claude',
}) => {
  const [activeTab, setActiveTab] = useState<'claude' | 'consolidate' | 'dataset'>(initialTab);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(initialVideoId || Object.keys(savedFiches)[0] || 'dg2-OsUXN60');
  const [targetLang, setTargetLang] = useState<'pinescript' | 'python' | 'audit'>('pinescript');
  const [copied, setCopied] = useState(false);
  const [bridgeRunning, setBridgeRunning] = useState(false);
  const [bridgeOutput, setBridgeOutput] = useState<string | null>(null);

  const consolidatedMasters = useMemo(() => buildConsolidatedConcepts(savedFiches), [savedFiches]);
  const [selectedConceptId, setSelectedConceptId] = useState<string>('BPR');

  const activeMaster = useMemo(() => {
    return (
      consolidatedMasters.find(m => m.conceptId === selectedConceptId) ||
      consolidatedMasters[0] ||
      null
    );
  }, [consolidatedMasters, selectedConceptId]);

  const trainingDataset = useMemo(() => generateTrainingDatasetJsonl(savedFiches), [savedFiches]);

  if (!isOpen) return null;

  const activeSourceContent =
    selectedSourceId.startsWith('MASTER_') && activeMaster
      ? activeMaster.masterMarkdown
      : savedFiches[selectedSourceId] || Object.values(savedFiches)[0] || '';

  const buildClaudePromptPack = () => {
    const langSpec =
      targetLang === 'pinescript'
        ? `CIBLE : Indicateur & Stratégie TradingView en Pine Script v5/v6 complet.
- Déclare chaque paramètre P-xx et décision D-xx via input.int / input.float / input.bool.
- Implémente les types Zone et Trade reproduisant strictement ZONE_FSM et TRADE_FSM.
- Garantit ZÉRO lookahead (barstate.isconfirmed == true et lookahead=barmerge.lookahead_off).
- Trace les boîtes (box.new), le niveau 50% (Consequent Encroachment) et les signaux d'entrée/SL/TP.`
        : targetLang === 'python'
          ? `CIBLE : Moteur Algorithmique, Backtester & Runner de Fixtures en Python 3.11+ (dataclasses typées).
- Implémente la classe UniversalSpecEngine avec ZONE_FSM et TRADE_FSM évaluées à la clôture confirmée t.
- Implémente chaque règle atomique R-xx et chaque rejet REJ-xx sans aucun TODO ni pass.
- Exécute automatiquement les Fixtures JSON de la section B6 avec assert pour prouver 100 % de conformité.`
          : `CIBLE : Audit Quantitatif & Critique Red-Team L99.
- Vérifie la complétude mathématique de chaque règle R-xx, des transitions ZONE_FSM / TRADE_FSM et la gestion des conflits intra-bougie.`;

    return `# RÔLE : INGÉNIEUR QUANTITATIF SENIOR & ARCHITECTE ALGORITHMIQUE (CLAUDE CODEUR)
# PIPELINE HYBRIDE : GEMINI PRO (EXTRACTION MULTIMODALE VIDÉO) -> CLAUDE (IMPLÉMENTATION STRICTE)

Tu reçois une spécification formelle SCRIBE-ICT v3 extraite par le compilateur vid?o universel OmniScribe v4.0.
Interdiction formelle d'ajouter de l'ICT générique : code UNIQUEMENT les règles [R-xx], paramètres [P-xx], décisions [D-xx] et rejets [REJ-xx] définis ci-dessous.

${langSpec}

================================================================================
SPÉCIFICATION SOURCE (${selectedSourceId}) :
================================================================================

${activeSourceContent}`;
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = (filename: string, content: string, mime = 'text/markdown;charset=utf-8') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunClaudeBridge = async () => {
    setBridgeRunning(true);
    setBridgeOutput(null);
    try {
      const res = await fetch('/api/claude/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ficheId: selectedSourceId,
          ficheContent: activeSourceContent,
          targetType: targetLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBridgeOutput(`Erreur : ${data.error || res.statusText}`);
      } else {
        setBridgeOutput(data.output || 'Pack généré avec succès dans generated_bots/.');
      }
    } catch (e: any) {
      setBridgeOutput(`Erreur réseau : ${e?.message || String(e)}`);
    } finally {
      setBridgeRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                HUB HYBRIDE L99 : CLAUDE CODEUR • CONSOLIDATION PAR CONCEPT • DATASET IA
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Les 3 sorties du But (§2) : 1. Apprendre (Bible Concept) • 2. Coder (Pont Claude) • 3. Entraîner (JSONL)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-[#0F1420]">
          <button
            type="button"
            onClick={() => setActiveTab('claude')}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-t-lg border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'claude'
                ? 'border-blue-600 text-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. Pont Hybride Claude Codeur (Bot / PineScript)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('consolidate')}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-t-lg border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'consolidate'
                ? 'border-blue-600 text-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Consolidation par Concept ({consolidatedMasters.length} Concepts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dataset')}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-t-lg border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'dataset'
                ? 'border-blue-600 text-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. Dataset d’Entraînement IA ({trainingDataset.records.length} entrées .jsonl)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'claude' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Spécification Source (Fiche Vidéo ou Bible Consolidée) :
                  </label>
                  <select
                    value={selectedSourceId}
                    onChange={e => setSelectedSourceId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <optgroup label="Fiches Vidéos Extraites">
                      {Object.keys(savedFiches).map(vid => (
                        <option key={vid} value={vid}>
                          Fiche Vidéo : {vid}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Bibles Consolidées par Concept (MASTER)">
                      {consolidatedMasters.map(m => (
                        <option
                          key={`MASTER_${m.conceptId}`}
                          value={`MASTER_${m.conceptId}`}
                          onClick={() => setSelectedConceptId(m.conceptId)}
                        >
                          MASTER_{m.conceptId} — {m.conceptLabel} ({m.sourcesCount} vidéo(s))
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cible d'Ingénierie Claude Codeur :
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'pinescript', label: 'Pine Script v5/v6' },
                      { id: 'python', label: 'Bot Python + Fixtures' },
                      { id: 'audit', label: 'Audit Red-Team' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTargetLang(opt.id as any)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-colors ${
                          targetLang === opt.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Garantit 0 % ICT générique • Paramètres P-xx • ZONE_FSM + TRADE_FSM • Validation sur Fixtures OHLC
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(buildClaudePromptPack())}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier le Pack Claude'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        `CLAUDE_PACK_${selectedSourceId}_${targetLang.toUpperCase()}.md`,
                        buildClaudePromptPack()
                      )
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 text-white hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger .md</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRunClaudeBridge}
                    disabled={bridgeRunning}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{bridgeRunning ? 'Exécution...' : 'Exécuter Bridge Claude Local'}</span>
                  </button>
                </div>
              </div>

              {bridgeOutput && (
                <div className="p-3 rounded-lg bg-emerald-950/90 text-emerald-200 border border-emerald-700 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {bridgeOutput}
                </div>
              )}

              <pre className="p-4 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-80 leading-relaxed border border-slate-800">
                {buildClaudePromptPack()}
              </pre>
            </div>
          )}

          {activeTab === 'consolidate' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {consolidatedMasters.map(m => (
                    <button
                      key={m.conceptId}
                      type="button"
                      onClick={() => setSelectedConceptId(m.conceptId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer border transition-colors ${
                        activeMaster?.conceptId === m.conceptId
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m.conceptId} ({m.sourcesCount})
                    </button>
                  ))}
                </div>

                {activeMaster && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(activeMaster.masterMarkdown)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copier MASTER_{activeMaster.conceptId}.md</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(`MASTER_${activeMaster.conceptId}.md`, activeMaster.masterMarkdown)
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger MASTER_{activeMaster.conceptId}.md</span>
                    </button>
                  </div>
                )}
              </div>

              {activeMaster ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
                    <span>
                      <strong>{activeMaster.conceptLabel}</strong> • Pilier :{' '}
                      <span className="text-blue-700 dark:text-blue-300">{activeMaster.pilier}</span>
                    </span>
                    <span>
                      Chronologie vérifiée : <strong>{activeMaster.earliestDate}</strong> →{' '}
                      <strong>{activeMaster.latestDate}</strong> ({activeMaster.sourcesCount} vidéo(s) fusionnée(s))
                    </span>
                  </div>
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800 whitespace-pre-wrap">
                    {activeMaster.masterMarkdown}
                  </pre>
                </div>
              ) : (
                <div className="text-xs font-mono text-slate-500 p-6 text-center">
                  Aucune fiche disponible pour la consolidation.
                </div>
              )}
            </div>
          )}

          {activeTab === 'dataset' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                  <strong>Dataset Fine-Tuning / RAG (universal_knowledge_dataset.jsonl)</strong> —{' '}
                  {trainingDataset.records.length} conversations structurées (Apprendre • Auditer • Coder)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(trainingDataset.jsonlContent)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copier JSONL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        'universal_knowledge_dataset.jsonl',
                        trainingDataset.jsonlContent,
                        'application/jsonl;charset=utf-8'
                      )
                    }
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger universal_knowledge_dataset.jsonl</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800 whitespace-pre-wrap">
                {trainingDataset.jsonlContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
