import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Layers,
  Database,
  Terminal,
  Sparkles,
  Play,
  ShieldCheck,
  Key,
} from 'lucide-react';
import {
  buildConsolidatedConcepts,
  generateTrainingDatasetJsonl,
} from '../services/conceptConsolidatorService';
import { FICHE_DG2_OSUXN60_BPR } from '../data/fiches/dg2_OsUXN60_BPR';
import { getActiveAnthropicKey, setActiveAnthropicKey } from '../utils/apiKeyManager';

export type ClaudeCompileTarget =
  | 'course-handbook'
  | 'jsonl-dataset'
  | 'typescript'
  | 'python'
  | 'pinescript'
  | 'audit';

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
  const effectiveFiches = useMemo(() => {
    if (Object.keys(savedFiches).length > 0) return savedFiches;
    return { 'dg2-OsUXN60': FICHE_DG2_OSUXN60_BPR };
  }, [savedFiches]);

  const [activeTab, setActiveTab] = useState<'claude' | 'consolidate' | 'dataset'>(initialTab);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    initialVideoId || Object.keys(effectiveFiches)[0] || 'dg2-OsUXN60'
  );
  const [targetLang, setTargetLang] = useState<ClaudeCompileTarget>('course-handbook');
  const [anthropicKey, setAnthropicKey] = useState<string>(() => getActiveAnthropicKey());
  const [copied, setCopied] = useState(false);
  const [bridgeRunning, setBridgeRunning] = useState(false);
  const [bridgeOutput, setBridgeOutput] = useState<string | null>(null);

  const consolidatedMasters = useMemo(() => buildConsolidatedConcepts(effectiveFiches), [effectiveFiches]);
  const [selectedConceptId, setSelectedConceptId] = useState<string>('BPR');

  const activeMaster = useMemo(() => {
    return (
      consolidatedMasters.find(m => m.conceptId === selectedConceptId) ||
      consolidatedMasters[0] ||
      null
    );
  }, [consolidatedMasters, selectedConceptId]);

  const trainingDataset = useMemo(() => generateTrainingDatasetJsonl(effectiveFiches), [effectiveFiches]);

  if (!isOpen) return null;

  const activeSourceContent =
    selectedSourceId.startsWith('MASTER_') && activeMaster
      ? activeMaster.masterMarkdown
      : effectiveFiches[selectedSourceId] || Object.values(effectiveFiches)[0] || FICHE_DG2_OSUXN60_BPR;

  const buildClaudePromptPack = () => {
    const targetDescriptions: Record<ClaudeCompileTarget, string> = {
      'course-handbook': `TARGET: Complete University & Professional Course Handbook (COURSE_MODULE.md).
- Synthesize Part A (8 pedagogical sections) and Part B (formal rules [R-xx] & parameters [P-xx]) into a complete course chapter.
- Include visual mental models, worked examples with [MM:SS] timestamps, common pitfalls ([REJ-xx]), flashcards, and a graded quiz.`,
      'jsonl-dataset': `TARGET: Multi-Turn SFT & RAG Fine-Tuning Dataset (.jsonl).
- Output valid JSON Lines covering conceptual intuition, formal rule derivation ([R-xx]), edge-case diagnosis ([REJ-xx]), and fixture traces.`,
      typescript: `TARGET: Strict TypeScript (ESM) State Machine Module & Node Test Suite.
- Export typed interfaces for [P-xx], [D-xx], and dual state machines with zero placeholders and an embedded node:test runner.`,
      python: `TARGET: Production Python 3.11+ Engine & Automated Fixture Runner (dataclasses).
- Implement UniversalSpecEngine with dual Finite State Machines, pure methods for every [R-xx] and [REJ-xx], and an assert-based run_fixtures() harness.`,
      pinescript: `TARGET: TradingView Pine Script v5/v6 Indicator & Strategy.
- Declare all [P-xx] and [D-xx] inputs and implement zero-lookahead ZONE_FSM and TRADE_FSM.`,
      audit: `TARGET: Formal Completeness, Causality & Red-Team Audit Report (AUDIT.md).
- Verify mathematical completeness of every rule [R-xx], state transition determinism, and boundary conditions.`,
    };

    return `# ROLE: PRINCIPAL FORMAL SYSTEMS COMPILER & CURRICULUM ARCHITECT (CLAUDE CODE)
# PIPELINE: YOUTUBE VIDEO EXTRACTOR v4.0 -> CLAUDE CODE IMPLEMENTATION

You receive a validated Dual-Layer Video Specification verified by our deterministic 10-criteria linter (lintFicheV3).
Implement ONLY the rules [R-xx], parameters [P-xx], decisions [D-xx], and rejection guards [REJ-xx] defined below with zero placeholders.

${targetDescriptions[targetLang]}

================================================================================
SOURCE SPECIFICATION (${selectedSourceId}):
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

  const handleSaveAnthropicKey = (val: string) => {
    setAnthropicKey(val);
    setActiveAnthropicKey(val);
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
          anthropicKey: anthropicKey.trim() || undefined,
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
      <div className="bg-white dark:bg-[#0F1420] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-orange-500 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                UNIVERSAL COMPILER HUB : CLAUDE CODE BRIDGE • MASTER.md • .JSONL DATASET
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                1. Compile with Claude (6 Targets) • 2. Consolidate Master Bibles • 3. Export SFT/RAG .jsonl Dataset
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
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. Claude Code Compiler Bridge (6 Universal Targets)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('consolidate')}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-t-lg border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'consolidate'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Master Course Consolidation ({consolidatedMasters.length} Concepts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dataset')}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-t-lg border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'dataset'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. AI Fine-Tuning Dataset ({trainingDataset.records.length} .jsonl entries)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'claude' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Source Specification (Video Spec or Consolidated MASTER.md):
                    </label>
                    <select
                      value={selectedSourceId}
                      onChange={e => setSelectedSourceId(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <optgroup label="Extracted Video Specifications">
                        {Object.keys(effectiveFiches).map(vid => (
                          <option key={vid} value={vid}>
                            Video Spec: {vid}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Consolidated Master Bibles (MASTER_<CONCEPT>.md)">
                        {consolidatedMasters.map(m => (
                          <option
                            key={`MASTER_${m.conceptId}`}
                            value={`MASTER_${m.conceptId}`}
                            onClick={() => setSelectedConceptId(m.conceptId)}
                          >
                            MASTER_{m.conceptId} — {m.conceptLabel} ({m.sourcesCount} video(s))
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-orange-500" />
                      <span>Anthropic API Key (Optional if `claude` CLI or `.env` is configured):</span>
                    </label>
                    <input
                      type="password"
                      value={anthropicKey}
                      onChange={e => handleSaveAnthropicKey(e.target.value)}
                      placeholder="sk-ant-api03-... (saved locally in your browser)"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Universal Claude Code Compilation Target (6 Formats):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'course-handbook', label: '1. Course Handbook (.md)' },
                      { id: 'jsonl-dataset', label: '2. AI Dataset (.jsonl)' },
                      { id: 'typescript', label: '3. TypeScript + Tests' },
                      { id: 'python', label: '4. Python + Fixtures' },
                      { id: 'pinescript', label: '5. PineScript v5/v6' },
                      { id: 'audit', label: '6. Red-Team Audit' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTargetLang(opt.id as ClaudeCompileTarget)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-colors text-left ${
                          targetLang === opt.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
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
                    Zero Placeholders • Parameters [P-xx] • Rules [R-xx] • Dual FSM • JSON Verification Fixtures
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(buildClaudePromptPack())}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Claude Pack'}</span>
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
                    <span>Download .md</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRunClaudeBridge}
                    disabled={bridgeRunning}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{bridgeRunning ? 'Compiling...' : 'Compile via Claude Bridge'}</span>
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
                <div className="flex flex-wrap gap-2">
                  {consolidatedMasters.map(m => (
                    <button
                      key={m.conceptId}
                      type="button"
                      onClick={() => setSelectedConceptId(m.conceptId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                        activeMaster?.conceptId === m.conceptId
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      MASTER_{m.conceptId} ({m.sourcesCount})
                    </button>
                  ))}
                </div>

                {activeMaster && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(activeMaster.masterMarkdown)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy MASTER_{activeMaster.conceptId}.md</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          `MASTER_${activeMaster.conceptId}.md`,
                          activeMaster.masterMarkdown
                        )
                      }
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MASTER_{activeMaster.conceptId}.md</span>
                    </button>
                  </div>
                )}
              </div>

              {activeMaster ? (
                <pre className="p-4 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800 whitespace-pre-wrap">
                  {activeMaster.masterMarkdown}
                </pre>
              ) : (
                <div className="text-xs font-mono text-slate-500 p-6 text-center">
                  No specifications available for consolidation.
                </div>
              )}
            </div>
          )}

          {activeTab === 'dataset' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                  <strong>SFT / RAG Dataset (universal_knowledge_dataset.jsonl)</strong> —{' '}
                  {trainingDataset.records.length} multi-turn conversations (Learn • Audit • Code)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(trainingDataset.jsonlContent)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 text-slate-800 dark:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy JSONL</span>
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
                    className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download universal_knowledge_dataset.jsonl</span>
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
