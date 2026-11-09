# AGENT.md — Operational Contract for Autonomous Coding Agents (Claude Code)

## 1. Purpose & Architectural Scope
`youtube-video-extractor` (`v4.0.0`) is an open-source **Universal Video-to-Course, Formal Specification, AI Dataset, and Code Compiler** coupled with a **10-criteria deterministic linter (`lintFicheV3`)** and a **Native Claude Code Compiler Bridge** (`scripts/claude_agent_bridge.py` and `src/components/AgentExportModal.tsx`).

It transforms educational and technical YouTube videos, university lecture playlists, and multi-video channels across **4 Universal Domain Profiles** (`src/utils/domainProfiles.ts`):
1. `UNIVERSAL_COURSE_COMPILER`: University courses, MOOCs, and general educational playlists (`CONCEPT_LIFECYCLE_FSM` × `APPLICATION_WORKFLOW_FSM`).
2. `SOFTWARE_AND_ALGORITHMS`: Computer science lectures, system design, and AI engineering (`COMPONENT_STATE_FSM` × `EXECUTION_PIPELINE_FSM`).
3. `STEM_AND_QUANT_SCIENCE`: Mathematics, physics, statistics, and econometrics (`REGIME_STATE_FSM` × `INFERENCE_DECISION_FSM`).
4. `MARKET_MICROSTRUCTURE_ICT`: Discretionary market microstructure and algorithmic finance (`ZONE_FSM` × `TRADE_FSM` — includes the 106-video Benchmark Test #1 corpus).

Companion quantitative verification skill & scientific Python repository: **[`Christ-yavn/quant-pod`](https://github.com/Christ-yavn/quant-pod)**.

---

## 2. Core Engineering & Verification Invariants

1. **Automatic 35-Minute Temporal Slicing (`calculateSlices`)**:
   - Any video longer than 35 minutes (`2,100 seconds`) must be segmented into sequential 35-minute windows (`_S01`, `_S02`, ...) so multimodal extraction never suffers from mid-lecture context degradation.
2. **Dual-Layer Specification Contract (Part A Human Course + Part B Machine Spec)**:
   - Every extracted sheet must contain both **Part A** (all 8 pedagogical course sections anchored to exact `[MM:SS]` timestamps within `duree_s`) and **Part B** (formal parameters `[P-xx]`, decisions `[D-xx]`, testable rules `[R-xx]`, rejection guards `[REJ-xx]`, Dual Finite State Machines, and 3 parseable JSON verification fixtures).
3. **Deterministic 10-Criteria Quality Gate (`lintFicheV3`)**:
   - Placeholder tokens (`TODO`, `TBD`, `...`, `etc.`), out-of-bounds timestamps, and invented heuristic point systems (e.g., arbitrary `score >= 70/100` scales not present in the source lecture) are automatically rejected by `lintFicheV3()`.
4. **Zero Hardcoded Credentials (BYOK Architecture)**:
   - `src/utils/apiKeyManager.ts` and `src/services/googleDriveService.ts` enforce strict secret hygiene. Users provide their own `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, and optional Google Drive OAuth token via local environment variables or browser `localStorage`.

---

## 3. Essential Commands for Claude Code

### Run the 38 Deterministic Unit Tests
```bash
npm test
# Runs: node --experimental-strip-types --test src/utils/pipeline.test.ts src/utils/ictTaxonomy.test.ts src/utils/driveHelpers.test.ts src/utils/domainProfiles.test.ts
```

### Ingest a YouTube Video via the Universal CLI
```bash
python scripts/universal_youtube_ingest.py \
  --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" \
  --title "Distributed Consensus & State Machine Replication" \
  --channel "MIT OpenCourseWare" \
  --duration 4500 \
  --domain SOFTWARE_AND_ALGORITHMS
```

### Compile a Validated Specification via the Claude Code Bridge
```bash
# Compile to a complete University/Pedagogical Course Handbook:
python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target course-handbook

# Compile to a multi-turn .jsonl RAG / Fine-Tuning Dataset:
python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target jsonl-dataset

# Compile to a strict TypeScript ESM state-machine module + test suite:
python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target typescript

# Compile to a Python 3.11+ engine + automated JSON fixture runner:
python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target python

# Run a formal Red-Team completeness and causality audit:
python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target audit
```

### Type-Check & Build the Web Studio
```bash
npm run lint
npm run build
```
