# AGENT.md — Operational Contract for Autonomous Coding Agents (Claude Code)

## 1. Purpose & Architectural Scope
`ITC-SMC-EXTRACTOR` is an open-source formal specification workbench, deterministic linter (`lintFicheV3`), and **Claude Code compilation bridge** (`scripts/claude_agent_bridge.py`) that compiles discretionary market-microstructure concepts (ICT / Smart Money Concepts: `BPR`, `FVG`, `OB`, `OTE`, `LIQUIDITY_SWEEP`, `CISD`, `MSS`) into **provably causal, zero-lookahead Dual Finite State Machines (`ZONE_FSM` × `TRADE_FSM`)** and executable **Python 3.11+ / Pine Script v5-v6** engines.

Companion statistical validation & ONNX execution repository: **[`Christ-yavn/bot-quant-`](https://github.com/Christ-yavn/bot-quant-)**.

---

## 2. Non-Negotiable Mathematical & Engineering Invariants

1. **Zero Look-Ahead Bias (`t+1` Execution Invariant)**:
   - A bar at index $t$ is evaluated strictly at confirmed bar close (`barstate.isconfirmed` in Pine Script / completed bar event in Python).
   - Any multi-bar structure (such as a 3-candle Fair Value Gap or Balanced Price Range completed at bar $t$) can only transition to `ACTIVE` at bar $t$ close and can only trigger an entry at bar $t+1$ or later.
2. **Dual Finite State Machine (`ZONE_FSM` × `TRADE_FSM`)**:
   - Every compiled concept MUST implement explicit state transitions for both the structural zone (`INACTIVE -> FORMING -> ACTIVE -> MITIGATED / INVALIDATED`) and the execution lifecycle (`IDLE -> ARMED -> ENTERED -> EXITED`), with pessimistic intra-bar conflict resolution (Stop-Loss evaluated before Take-Profit when both levels are touched within the same bar).
3. **Zero Invented Heuristic Scoring**:
   - Arbitrary point systems (e.g., `+30 pts`, `score >= 70/100`) are strictly forbidden and automatically rejected by `lintFicheV3()`. Every rule `[R-xx]`, parameter `[P-xx]`, design decision `[D-xx]`, and rejection condition `[REJ-xx]` must trace back to an explicit evidence ID (`S-xx`, `F-xx`, `X-xx`).
4. **Executable OHLC JSON Fixtures (`B6`)**:
   - Every compiled specification must include deterministic positive (`POSITIVE`) and counter-example (`COUNTER`) OHLC bar sequences (`FX-*-01`) that are asserted automatically by the generated Python runner (`run_fixtures()`).

---

## 3. Essential Commands for Claude Code

### Run the 33 Deterministic Unit Tests
```bash
npm test
# or directly with Node 22+ native TypeScript runner:
node --experimental-strip-types --test src/utils/pipeline.test.ts src/utils/ictTaxonomy.test.ts src/utils/driveHelpers.test.ts
```

### Compile a Formal Specification via the Claude Code Bridge
```bash
# Compile a SCRIBE-ICT v3 specification to a zero-lookahead Python 3.11+ engine + fixture runner:
python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target python

# Compile to a TradingView Pine Script v5/v6 indicator & strategy:
python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target pinescript

# Run a formal Red-Team mathematical completeness audit:
python scripts/claude_agent_bridge.py --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" --target audit
```

### Type-Check the Codebase
```bash
npm run lint
```
