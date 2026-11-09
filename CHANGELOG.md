# Changelog

All notable changes to **ITC-SMC-EXTRACTOR** are documented in this file.

## [3.4.0] - 2026-11-09
### Added
- **Bilingual (English + French) Open-Source Technical Documentation**: Full English specification of the `SCRIBE-ICT v3/v4` formal compiler, dual Finite State Machine (`ZONE_FSM` × `TRADE_FSM`) architecture, and native **Claude Code** bridge (`scripts/claude_agent_bridge.py`).
- **OpenSSF & Open-Source Governance Suite**: Added `LICENSE` (MIT), `AGENT.md` (Claude Code operational contract), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and automated GitHub Actions CI workflow (`.github/workflows/ci.yml`).
- **Cross-Repository Ecosystem Integration**: Linked formal feature/FSM specifications with the companion statistical validation & ONNX runtime execution engine [`Christ-yavn/bot-quant-`](https://github.com/Christ-yavn/bot-quant-).

### Fixed
- Synchronized `SUPPORTED_GEMINI_MODELS` assertion in `src/utils/pipeline.test.ts` so all **33/33 deterministic unit tests** pass in CI (`npm test`).
- Standardized `package.json` metadata (`itc-smc-extractor@3.4.0`, MIT license, repository links, and native Node 22 test runner script).

## [3.3.0] - 2026-11-02
### Added
- **Claude Code & Anthropic API Bridge (`scripts/claude_agent_bridge.py`)**: Compiles `<<<CONCEPT_SPEC_V3>>>` specifications and `MASTER_<CONCEPT>.md` consolidated bibles directly into zero-lookahead **Python 3.11+** engines (with automated JSON OHLC fixture runners) and **TradingView Pine Script v5/v6** indicators.
- **Deterministic Linter L99 (`lintFicheV3` in `src/utils/pipeline.ts`)**: Automated verification of autoregressive causal section order (`I -> II -> III -> IV -> V`), real video duration bounds (`duree_s`), anti-invented scoring rules, dual FSM presence, and cross-coverage between formal rules (`R-xx`, `P-xx`, `REJ-xx`) and human documentation.
- **Chronological Concept Consolidator & Fine-Tuning Dataset Generator (`src/services/conceptConsolidatorService.ts`)**: Generates `MASTER_<CONCEPT>.md` and `hugofx_training_dataset.jsonl`.
