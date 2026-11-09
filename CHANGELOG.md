# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0] - 2026-11-09
### Added
- **Universal Multi-Domain Video-to-Course & Formal Specification Architecture (`src/utils/domainProfiles.ts`)**:
  - Generalized the compiler beyond market microstructure to support **any** YouTube channel, playlist, or technical video curriculum via 4 pluggable domain profiles:
    1. `UNIVERSAL_COURSE_COMPILER` (University lectures, tutorials, MOOCs -> 8-section study handbooks + `MASTER_<CONCEPT>.md` + `.jsonl` fine-tuning datasets).
    2. `SOFTWARE_AND_ALGORITHMS` (CS lectures, system design, AI engineering -> `COMPONENT_STATE_FSM` × `EXECUTION_PIPELINE_FSM` + TypeScript/Python code generation).
    3. `STEM_AND_QUANT_SCIENCE` (Mathematics, physics, econometrics -> `REGIME_STATE_FSM` × `INFERENCE_DECISION_FSM` + numerical JSON verification fixtures).
    4. `MARKET_MICROSTRUCTURE_ICT` (106-video benchmark dataset -> `ZONE_FSM` × `TRADE_FSM` + zero-lookahead OHLC fixtures).
- **Universal YouTube Channel & Playlist Ingestion CLI (`scripts/universal_youtube_ingest.py`)**:
  - Accepts any YouTube video/playlist URL (`--url`, `--domain`, `--duration`), automatically computes 35-minute (`2100s`) temporal slices to prevent long-context degradation, and outputs structured manifests and dual-layer extraction prompts.
- **Extended Native Claude Code Compiler Bridge (`scripts/claude_agent_bridge.py`)**:
  - Added `--target typescript`, `--target course-handbook`, and `--target jsonl-dataset` alongside `--target python`, `--target pinescript`, and `--target audit`.
- **Expanded Unit Test Suite (`38/38` passing)**:
  - Added `src/utils/domainProfiles.test.ts` testing all 4 universal domain profiles, topic classification, and prompt compilation.

## [3.4.0] - 2026-11-09
### Added
- **Native Claude Code Agent Bridge (`scripts/claude_agent_bridge.py`)**: Direct compilation of validated specifications into executable Python backtesters, PineScript v5/v6 indicators, and formal audit reports via `ANTHROPIC_API_KEY` or `claude -p` CLI.
- **Deterministic 10-Criteria Linter (`lintFicheV3` in `src/utils/pipeline.ts`)**: Enforces zero placeholders, temporal causality, 8-section pedagogical completeness, parameter/decision tables (`[P-xx]`, `[D-xx]`), formal rules (`[R-xx]`, `[REJ-xx]`), dual Finite State Machines, and 3 synthetic JSON fixtures.
- **Chronological Concept Consolidator & Dataset Generator**: Automatically merges multi-video extractions into `MASTER_<CONCEPT>.md` bibles and exports `.jsonl` fine-tuning datasets (`generateTrainingDatasetJsonl`).
- **33 Automated Unit Tests**: Zero-dependency Node.js test suite (`node --experimental-strip-types --test`) verified in GitHub Actions CI.
