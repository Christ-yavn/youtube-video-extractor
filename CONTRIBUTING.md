# Contributing to ITC-SMC-EXTRACTOR

Thank you for your interest in contributing to **ITC-SMC-EXTRACTOR**! Our mission is to provide the open-source quantitative finance and algorithmic engineering community with a formal, deterministic, zero-lookahead specification compiler and **Claude Code** bridge for market-microstructure primitives (ICT / Smart Money Concepts).

---

## 1. Core Engineering Principles

Before opening a Pull Request, please ensure your contribution adheres to our four core invariants (documented in [`AGENT.md`](./AGENT.md)):

1. **Strict Causal Execution (Zero Look-Ahead Bias)**: No detector or state transition may access future bar data ($t+k$ for $k > 0$) or unconfirmed intra-bar close prices.
2. **Dual Finite State Machine Compliance**: All structural detectors must separate zone lifecycle (`ZONE_FSM`) from trade execution (`TRADE_FSM`) with pessimistic intra-bar conflict resolution.
3. **Deterministic Linter Verification**: All specification changes must pass `lintFicheV3()` in [`src/utils/pipeline.ts`](./src/utils/pipeline.ts) with a `10/10` codability verdict and zero invented heuristic point scales.
4. **Executable OHLC Fixtures**: Any new market-structure primitive (`FVG`, `BPR`, `OB`, `OTE`, `CISD`, `SMT`) must include both `POSITIVE` and `COUNTER` JSON OHLC bar fixtures.

---

## 2. Development Workflow

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Christ-yavn/ITC-SMC-EXTRACTOR-.git
   cd ITC-SMC-EXTRACTOR-
   ```
2. **Install dependencies**:
   ```bash
   npm install
   # or: bun install
   ```
3. **Run the unit test suite (Node.js 22+)**:
   ```bash
   npm test
   ```
   All 33 unit tests across `pipeline.test.ts`, `ictTaxonomy.test.ts`, and `driveHelpers.test.ts` must pass before submitting a PR.
4. **Test the Claude Code Bridge**:
   ```bash
   python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target python
   ```

---

## 3. Submitting Pull Requests

- Use clear, conventional commit messages (`feat(linter): ...`, `fix(fsm): ...`, `docs(spec): ...`).
- Include unit tests in `src/utils/*.test.ts` for any new parser, taxonomy rule, or linter invariant.
- Link related issues or companion PRs in [`Christ-yavn/bot-quant-`](https://github.com/Christ-yavn/bot-quant-).
