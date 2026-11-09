#!/usr/bin/env python3
"""
Universal Multimodal Video Spec -> Claude Code Compiler Bridge (v4.0)
=====================================================================
Compiles any validated Dual-Layer Video Specification (.md) or Consolidated Master
Concept Bible (MASTER_<CONCEPT>.md) from ANY YouTube channel/course into:
  - `python`          : Strict dataclasses + Dual FSM Engine + JSON Fixture Runner
  - `typescript`      : Strict TypeScript ESM Module + Dual State Machine + Node Test Runner
  - `course-handbook` : Complete University-Grade Pedagogical Course Module + Quizzes & Flashcards
  - `jsonl-dataset`   : Multi-Turn SFT / RAG Fine-Tuning Dataset (.jsonl) grounded in `[R-xx]` & `[MM:SS]`
  - `pinescript`      : TradingView PineScript v5/v6 Zero-Lookahead Indicator/Strategy
  - `audit`           : Red-Team L99 Formal Completeness & Determinism Audit
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT_DIR / "generated_bots"

TARGET_EXTENSIONS = {
    "python": "py",
    "typescript": "ts",
    "course-handbook": "md",
    "jsonl-dataset": "jsonl",
    "pinescript": "pine",
    "audit": "md",
}


def build_claude_coder_prompt(fiche_content: str, target: str) -> str:
    target_instructions = {
        "python": (
            "TARGET ARTIFACT: Production **Python 3.11+ Engine & Automated Fixture Runner** (strict `dataclasses` & type hints).\n"
            "- Implement the dual Finite State Machines (`PRIMARY_FSM` & `SECONDARY_FSM` / `ZONE_FSM` & `TRADE_FSM`) with zero lookahead.\n"
            "- Encode every formal rule `[R-xx]`, parameter `[P-xx]`, decision `[D-xx]`, and rejection guard `[REJ-xx]` as pure, deterministic methods.\n"
            "- Include a self-contained `run_fixtures()` test harness at the bottom that executes the JSON verification fixtures from the specification and verifies 100% state-transition parity via `assert`."
        ),
        "typescript": (
            "TARGET ARTIFACT: Production **TypeScript (ESM, strict mode) State Machine Compiler & Test Suite**.\n"
            "- Export typed interfaces for all parameters `[P-xx]`, decisions `[D-xx]`, state transitions, and events.\n"
            "- Implement deterministic transition functions for both state machines with zero `any` types and zero placeholders.\n"
            "- Include an embedded `node:test` verification suite running the JSON fixtures from the specification."
        ),
        "course-handbook": (
            "TARGET ARTIFACT: **Complete University & Professional Course Handbook (`COURSE_MODULE.md`)**.\n"
            "- Synthesize Part A (8 pedagogical sections) and Part B (formal rules `[R-xx]` & parameters `[P-xx]`) into a publication-ready curriculum chapter.\n"
            "- Include visual mental models, step-by-step worked examples anchored to exact `[MM:SS]` video timestamps, common pitfalls (`[REJ-xx]`), active-recall flashcards, and a graded assessment rubric with answer keys."
        ),
        "jsonl-dataset": (
            "TARGET ARTIFACT: **Multi-Turn SFT & RAG Fine-Tuning Dataset (`.jsonl`)**.\n"
            "- Output valid JSON Lines where each line is a `{\"messages\": [{\"role\": \"system\", ...}, {\"role\": \"user\", ...}, {\"role\": \"assistant\", ...}]}` object.\n"
            "- Cover conceptual intuition, formal rule derivation (`[R-xx]`), edge-case rejection diagnosis (`[REJ-xx]`), parameter sensitivity (`[P-xx]`), and step-by-step trace execution on the JSON fixtures."
        ),
        "pinescript": (
            "TARGET ARTIFACT: **TradingView Pine Script v5/v6 Indicator & Strategy**.\n"
            "- Declare all `[P-xx]` and `[D-xx]` parameters via `input.int`, `input.float`, `input.bool`, `input.string` with exact defaults.\n"
            "- Implement `type Zone` and `type Trade` reproducing `ZONE_FSM` and `TRADE_FSM` with zero lookahead (`barstate.isconfirmed`)."
        ),
        "audit": (
            "TARGET ARTIFACT: **Formal Completeness, Causality & Red-Team Audit Report (`AUDIT.md`)**.\n"
            "- Verify mathematical completeness of every rule `[R-xx]` and determinism of all state machine transitions.\n"
            "- Identify any unguarded boundary conditions, temporal leaks, or missing rejection rules `[REJ-xx]`."
        ),
    }

    chosen_instr = target_instructions.get(target, target_instructions["python"])

    return f"""# ROLE: PRINCIPAL FORMAL SYSTEMS COMPILER & CURRICULUM ARCHITECT (CLAUDE CODE)

You receive a **Validated Dual-Layer Video Specification** compiled from an educational or technical video lecture and verified by our deterministic 10-criteria linter (`lintFicheV3`).

## STRICT COMPILATION INVARIANTS
1. **100% Source Fidelity**: Implement ONLY the rules `[R-xx]`, parameters `[P-xx]`, decisions `[D-xx]`, and rejection guards `[REJ-xx]` explicitly defined in the specification below. Never hallucinate external rules.
2. **Temporal Causality (Zero Lookahead)**: State transitions at step `t` may only depend on confirmed observations up to `t`.
3. **Dual Finite State Machine Integrity**: Respect every state, guard, and transition priority defined in the specification.
4. **Zero Placeholders**: `TODO`, `TBD`, `pass`, or `// implement here` are strictly forbidden. Deliver complete, immediately usable output.

{chosen_instr}

================================================================================
SOURCE FORMAL SPECIFICATION:
================================================================================

{fiche_content}
"""


def call_anthropic_api(prompt: str, api_key: str) -> str:
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(
            {
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 8192,
                "temperature": 0.1,
                "messages": [{"role": "user", "content": prompt}],
            }
        ).encode("utf-8"),
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=110) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
        blocks = payload.get("content", [])
        return "\n".join(b.get("text", "") for b in blocks if b.get("type") == "text")


def main():
    parser = argparse.ArgumentParser(
        description="Universal Video Specification -> Claude Code Compiler Bridge (v4.0)"
    )
    parser.add_argument(
        "--input",
        required=True,
        help="Path to the validated specification .md or MASTER_<CONCEPT>.md",
    )
    parser.add_argument(
        "--target",
        default="python",
        choices=list(TARGET_EXTENSIONS.keys()),
        help="Compilation target (python, typescript, course-handbook, jsonl-dataset, pinescript, audit)",
    )
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    if not input_path.exists():
        print(f"[ERROR] Specification file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    fiche_content = input_path.read_text(encoding="utf-8")
    prompt = build_claude_coder_prompt(fiche_content, args.target)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    stem = input_path.stem.replace("_spec", "")
    safe_target = args.target.replace("-", "_").upper()
    prompt_out_path = OUT_DIR / f"{stem}_CLAUDE_PROMPT_{safe_target}.md"
    prompt_out_path.write_text(prompt, encoding="utf-8")
    ext = TARGET_EXTENSIONS[args.target]

    # 1. Try Anthropic API if ANTHROPIC_API_KEY is available
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if api_key:
        try:
            generated = call_anthropic_api(prompt, api_key)
            code_path = OUT_DIR / f"{stem}_generated.{ext}"
            code_path.write_text(generated, encoding="utf-8")
            print(f"[OK] Artifact compiled via Claude API: {code_path}\n\n{generated}")
            return
        except Exception as e:
            print(f"[WARN] Anthropic API call failed ({e}), falling back to Claude CLI...")

    # 2. Try `claude` CLI if installed locally
    claude_bin = shutil.which("claude")
    if claude_bin:
        try:
            proc = subprocess.run(
                [claude_bin, "-p", "Compile the formal specification in this prompt with zero omissions."],
                input=prompt,
                text=True,
                capture_output=True,
                encoding="utf-8",
                timeout=110,
            )
            if proc.returncode == 0 and proc.stdout.strip():
                code_path = OUT_DIR / f"{stem}_generated.{ext}"
                code_path.write_text(proc.stdout, encoding="utf-8")
                print(f"[OK] Artifact compiled via Claude Code CLI: {code_path}\n\n{proc.stdout}")
                return
        except Exception as e:
            print(f"[WARN] Claude CLI execution interrupted: {e}")

    # 3. Always deliver the ready-to-paste Master Prompt Pack saved on disk
    print(
        f"[CLAUDE CODE PACK READY] Saved to: {prompt_out_path}\n"
        f"Tip: set ANTHROPIC_API_KEY or run `claude < \"{prompt_out_path}\"` to compile automatically.\n\n"
        + prompt[:1800]
        + "\n\n... [Full compilation pack ready]"
    )


if __name__ == "__main__":
    main()
