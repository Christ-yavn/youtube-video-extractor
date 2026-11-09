/**
 * Universal Domain Profiles for Video-to-Course, Formal Specification & Dataset Compilation
 * Allows compiling ANY YouTube channel, playlist, or technical video curriculum into:
 *   1. Structured 8-Section Human Course Handbooks & Consolidated Master Bibles (MASTER_<CONCEPT>.md)
 *   2. Deterministic Formal Specifications ([P-xx], [D-xx], [R-xx], [REJ-xx], Dual FSMs, JSON Fixtures)
 *   3. Multi-Turn SFT / RAG Fine-Tuning Datasets (.jsonl)
 *   4. Production Code & Test Suites via Claude Code (Python, TypeScript, Course Handbook, PineScript)
 */

export type DomainProfileId =
  | 'UNIVERSAL_COURSE_COMPILER'
  | 'SOFTWARE_AND_ALGORITHMS'
  | 'STEM_AND_QUANT_SCIENCE'
  | 'MARKET_MICROSTRUCTURE_ICT';

export interface DomainProfile {
  id: DomainProfileId;
  name: string;
  tagline: string;
  supportedTargets: ('python' | 'typescript' | 'course-handbook' | 'jsonl-dataset' | 'pinescript' | 'audit')[];
  primaryFsmName: string;
  secondaryFsmName: string;
  partASections: string[];
  partBRequirements: string[];
  defaultTaxonomy: { id: string; label: string; keywords: string[] }[];
}

export const DOMAIN_PROFILES: Record<DomainProfileId, DomainProfile> = {
  UNIVERSAL_COURSE_COMPILER: {
    id: 'UNIVERSAL_COURSE_COMPILER',
    name: 'Universal Video-to-Course & Curriculum Compiler',
    tagline: 'Transform any YouTube educational channel, university lecture series, or tutorial playlist into structured study guides, Master Concept Bibles, and .jsonl AI datasets.',
    supportedTargets: ['course-handbook', 'jsonl-dataset', 'python', 'typescript', 'audit'],
    primaryFsmName: 'CONCEPT_LIFECYCLE_FSM',
    secondaryFsmName: 'APPLICATION_WORKFLOW_FSM',
    partASections: [
      '1. Pedagogical Objective & Prerequisites',
      '2. Visual Intuition & Mental Models (with exact [MM:SS] video timestamps)',
      '3. Formal Definitions & Core Axioms',
      '4. Step-by-Step Worked Examples from the Video',
      '5. Common Mistakes, Counter-Examples & Edge Cases',
      '6. Operational Checklist & Decision Tree',
      '7. Cross-Video Synthesis & Curriculum Dependencies',
      '8. Self-Assessment Quiz & Active Recall Flashcards',
    ],
    partBRequirements: [
      'Exhaustive Parameter Table ([P-01]..[P-nn]) with default values and sensitivity bounds',
      'Instructor Design Decisions ([D-01]..[D-nn]) grounded in timestamped quotes',
      'Testable Formal Rules ([R-01]..[R-nn]) and Explicit Exclusions ([REJ-01]..[REJ-nn])',
      'Deterministic Dual State Machines (CONCEPT_LIFECYCLE_FSM & APPLICATION_WORKFLOW_FSM)',
      'JSON Verification Fixtures (1 nominal case, 1 invalid/rejected case, 1 boundary case)',
    ],
    defaultTaxonomy: [
      { id: 'FOUNDATIONS', label: 'Core Foundations & Mental Models', keywords: ['introduction', 'fundamentals', 'basics', 'overview', 'concept'] },
      { id: 'METHODOLOGY', label: 'Step-by-Step Methodology & Workflows', keywords: ['workflow', 'method', 'process', 'protocol', 'framework', 'guide'] },
      { id: 'CASE_STUDIES', label: 'Worked Examples & Applied Case Studies', keywords: ['example', 'case study', 'demo', 'live', 'walkthrough', 'practice'] },
      { id: 'ADVANCED_SYNTHESIS', label: 'Advanced Edge Cases & Master Synthesis', keywords: ['advanced', 'edge case', 'pitfalls', 'masterclass', 'synthesis'] },
    ],
  },

  SOFTWARE_AND_ALGORITHMS: {
    id: 'SOFTWARE_AND_ALGORITHMS',
    name: 'Software Engineering, Architecture & Algorithms Compiler',
    tagline: 'Compile programming tutorials, system design lectures, and CS talks into formal state machines, API contracts, JSON test vectors, and unit-tested TypeScript/Python via Claude Code.',
    supportedTargets: ['typescript', 'python', 'course-handbook', 'jsonl-dataset', 'audit'],
    primaryFsmName: 'COMPONENT_STATE_FSM',
    secondaryFsmName: 'EXECUTION_PIPELINE_FSM',
    partASections: [
      '1. System Problem Statement & Complexity Bounds (Time/Space)',
      '2. Architectural Diagram & Dataflow Walkthrough ([MM:SS] timestamps)',
      '3. Data Structures, Types & Interface Contracts',
      '4. Step-by-Step Algorithm Trace on Video Example',
      '5. Concurrency, Race Conditions & Failure Modes',
      '6. Production Readiness & Security Checklist',
      '7. Integration Patterns & Ecosystem Trade-offs',
      '8. Engineering Interview & Code Review Rubric',
    ],
    partBRequirements: [
      'Configuration & Hyperparameter Table ([P-01]..[P-nn]) with types and defaults',
      'Architectural Trade-off Decisions ([D-01]..[D-nn])',
      'Deterministic Preconditions/Postconditions ([R-01]..[R-nn]) and Error Guards ([REJ-01]..[REJ-nn])',
      'Dual State Machines (COMPONENT_STATE_FSM & EXECUTION_PIPELINE_FSM)',
      'Executable JSON Input/Output Test Vectors (Nominal, Malformed/Rejected, Boundary)',
    ],
    defaultTaxonomy: [
      { id: 'ALGORITHMS_DS', label: 'Algorithms & Data Structures', keywords: ['algorithm', 'tree', 'graph', 'dynamic programming', 'sorting', 'complexity'] },
      { id: 'SYSTEM_DESIGN', label: 'Distributed Systems & Architecture', keywords: ['system design', 'architecture', 'microservice', 'database', 'cache', 'queue'] },
      { id: 'AI_AGENTS_LLM', label: 'AI Engineering, RAG & Agentic Workflows', keywords: ['llm', 'agent', 'rag', 'prompt', 'claude', 'embedding', 'compiler'] },
      { id: 'DEVOPS_SECURITY', label: 'Testing, CI/CD & Security Hardening', keywords: ['test', 'ci/cd', 'security', 'docker', 'kubernetes', 'benchmark'] },
    ],
  },

  STEM_AND_QUANT_SCIENCE: {
    id: 'STEM_AND_QUANT_SCIENCE',
    name: 'STEM, Mathematics, Econometrics & Quantitative Science Compiler',
    tagline: 'Compile academic lectures, math proofs, and quantitative seminars into formal theorems, causal graphs, synthetic verification fixtures, and reproducible Python engines.',
    supportedTargets: ['python', 'course-handbook', 'jsonl-dataset', 'typescript', 'audit'],
    primaryFsmName: 'REGIME_STATE_FSM',
    secondaryFsmName: 'INFERENCE_DECISION_FSM',
    partASections: [
      '1. Mathematical Scope, Notation & Axiom System',
      '2. Geometric / Physical Intuition & Visual Derivations ([MM:SS])',
      '3. Formal Definitions, Theorems & Governing Equations',
      '4. Step-by-Step Numerical Derivation from the Lecture',
      '5. Violated Assumptions, Spurious Correlations & Pathologies',
      '6. Empirical Validation Protocol & Statistical Power',
      '7. Literature Connections & Generalizations',
      '8. Problem Set & Analytical Verification Questions',
    ],
    partBRequirements: [
      'Model Parameters & Thresholds ([P-01]..[P-nn]) with mathematical domains',
      'Specification Choices ([D-01]..[D-nn])',
      'Analytical Invariants ([R-01]..[R-nn]) and Falsification/Rejection Criteria ([REJ-01]..[REJ-nn])',
      'Dual State Machines (REGIME_STATE_FSM & INFERENCE_DECISION_FSM)',
      'Synthetic Numerical JSON Fixtures with exact ground-truth outputs',
    ],
    defaultTaxonomy: [
      { id: 'PROBABILITY_STATS', label: 'Probability, Statistics & Hypothesis Testing', keywords: ['probability', 'statistics', 'distribution', 'hypothesis', 'bayesian', 'martingale'] },
      { id: 'STOCHASTIC_QUANT', label: 'Stochastic Calculus & Quantitative Modeling', keywords: ['stochastic', 'ito', 'volatility', 'diffusion', 'ornstein', 'sharpe'] },
      { id: 'OPTIMIZATION_ML', label: 'Optimization, Control & Machine Learning', keywords: ['convex', 'gradient', 'bellman', 'reinforcement', 'bandit', 'regularization'] },
      { id: 'EMPIRICAL_METHODS', label: 'Causal Inference & Simulation Forensics', keywords: ['causal', 'monte carlo', 'bootstrap', 'backtest', 'entropy', 'prng'] },
    ],
  },

  MARKET_MICROSTRUCTURE_ICT: {
    id: 'MARKET_MICROSTRUCTURE_ICT',
    name: 'Market Microstructure & Algorithmic Trading Compiler (106-Video Benchmark)',
    tagline: 'Compile discretionary market microstructure videos into zero-lookahead ZONE_FSM x TRADE_FSM specifications, synthetic OHLC fixtures, and PineScript/Python backtesters.',
    supportedTargets: ['python', 'pinescript', 'course-handbook', 'jsonl-dataset', 'typescript', 'audit'],
    primaryFsmName: 'ZONE_FSM',
    secondaryFsmName: 'TRADE_FSM',
    partASections: [
      '1. Définition & Objectif Opérationnel du Concept',
      '2. Intuition Visuelle & Analogie du Formateur ([MM:SS])',
      '3. Anatomie Précise & Critères Visuels sur le Graphique',
      '4. Exemples Horodatés de la Vidéo (Bougie par Bougie)',
      '5. Pièges Classiques, Faux Signaux & Invalidation',
      '6. Protocole d’Exécution Pas-à-Pas (Checklist)',
      '7. Confluences & Articulation Multi-Timeframe',
      '8. Résumé Exécutif & Règles d’Or',
    ],
    partBRequirements: [
      'Table exhaustive des Paramètres ([P-01]..[P-nn]) et Décisions ([D-01]..[D-nn])',
      'Règles Formelles sans ambiguïté ([R-01]..[R-nn]) et Rejets ([REJ-01]..[REJ-nn])',
      'Double Machine à États Déterministe (ZONE_FSM & TRADE_FSM) sans lookahead',
      'Résolution pessimiste des conflits intra-bougie (SL prioritaire sur TP)',
      '3 Fixtures JSON OHLC synthétiques (Cas Nominal, Cas Rejeté, Cas Limite)',
    ],
    defaultTaxonomy: [
      { id: 'LIQUIDITY_SWEEPS', label: 'Liquidity Pools, Sweeps & Inducement', keywords: ['liquidity', 'bsl', 'ssl', 'eqh', 'eql', 'sweep', 'inducement', 'stop hunt'] },
      { id: 'IMBALANCE_ZONES', label: 'Fair Value Gaps (FVG), BPR & Inversions (IFVG)', keywords: ['fvg', 'ifvg', 'bpr', 'imbalance', 'vi', 'gap', 'consequent encroachment'] },
      { id: 'ORDER_BLOCKS', label: 'Order Blocks, Breaker Blocks & Mitigation', keywords: ['order block', 'ob', 'breaker', 'mitigation', 'propulsion', 'rejection block'] },
      { id: 'MARKET_STRUCTURE', label: 'BOS, MSS, SMT Divergence & Time/Macro Windows', keywords: ['bos', 'mss', 'choch', 'smt', 'killzone', 'silver bullet', 'amd', 'po3'] },
    ],
  },
};

export function getDomainProfile(domainId?: string): DomainProfile {
  if (domainId && domainId in DOMAIN_PROFILES) {
    return DOMAIN_PROFILES[domainId as DomainProfileId];
  }
  return DOMAIN_PROFILES.UNIVERSAL_COURSE_COMPILER;
}

export function listDomainProfiles(): DomainProfile[] {
  return Object.values(DOMAIN_PROFILES);
}

export function classifyVideoTopicByDomain(
  title: string,
  description: string,
  domainId: DomainProfileId = 'UNIVERSAL_COURSE_COMPILER'
): { categoryId: string; categoryLabel: string; matchedKeywords: string[] } {
  const profile = getDomainProfile(domainId);
  const haystack = `${title} ${description}`.toLowerCase();

  let bestCategory = profile.defaultTaxonomy[0];
  let bestMatches: string[] = [];

  for (const cat of profile.defaultTaxonomy) {
    const matches = cat.keywords.filter((kw) => haystack.includes(kw.toLowerCase()));
    if (matches.length > bestMatches.length) {
      bestMatches = matches;
      bestCategory = cat;
    }
  }

  return {
    categoryId: bestCategory.id,
    categoryLabel: bestCategory.label,
    matchedKeywords: bestMatches,
  };
}

export function buildUniversalExtractionPrompt(options: {
  domainId?: DomainProfileId;
  channelName: string;
  videoTitle: string;
  videoUrl: string;
  sliceIndex?: number;
  totalSlices?: number;
  startTimestamp?: string;
  endTimestamp?: string;
}): string {
  const profile = getDomainProfile(options.domainId);
  const sliceHeader =
    options.totalSlices && options.totalSlices > 1
      ? `Tranche ${options.sliceIndex ?? 1}/${options.totalSlices} (${options.startTimestamp ?? '00:00'} -> ${options.endTimestamp ?? '35:00'})`
      : 'Vidéo Complète';

  const sectionsList = profile.partASections.map((s) => `   - ${s}`).join('\n');
  const partBList = profile.partBRequirements.map((r) => `   - ${r}`).join('\n');

  return `# UNIVERSAL VIDEO-TO-COURSE & FORMAL SPECIFICATION COMPILER (${profile.id})
- **Source Channel / Instructor**: ${options.channelName}
- **Video Title**: ${options.videoTitle}
- **Video URL**: ${options.videoUrl}
- **Temporal Window**: ${sliceHeader}
- **Domain Profile**: ${profile.name}

## MISSION
Compile this video into a dual-layer specification combining a comprehensive human curriculum handbook (Part A) and a 100% deterministic, zero-placeholder machine specification (Part B) ready for **Claude Code** compilation.

### PART A — STRUCTURED PEDAGOGICAL COURSE HANDBOOK (8 OBLIGATORY SECTIONS)
${sectionsList}

### PART B — DETERMINISTIC FORMAL SPECIFICATION & CLAUDE CODE TARGET
${partBList}
   - Primary State Machine: \`${profile.primaryFsmName}\`
   - Secondary State Machine: \`${profile.secondaryFsmName}\`
   - Zero placeholders (\`TODO\`, \`TBD\`, \`...\`, \`etc.\` are strictly rejected by the deterministic linter).
`;
}
