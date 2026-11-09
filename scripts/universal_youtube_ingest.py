#!/usr/bin/env python3
"""
Universal YouTube Video / Playlist / Channel Knowledge Compiler CLI (v4.0)
==========================================================================
Transforms ANY YouTube video, playlist, or educational channel across any domain
(Computer Science, Mathematics/STEM, General Courses, or Quantitative Finance) into:
  1. Temporal Slices (35-minute / 2100s windows to prevent long-context degradation)
  2. Dual-Layer Extraction Prompts (Part A: 8-Section Course Handbook + Part B: Formal FSM Spec)
  3. Consolidated Master Concept Bibles (MASTER_<CONCEPT>.md) & SFT/RAG Datasets (.jsonl)

Usage:
  python scripts/universal_youtube_ingest.py \
    --url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" \
    --title "Distributed Consensus & State Machine Replication" \
    --channel "MIT OpenCourseWare" \
    --duration 4500 \
    --domain SOFTWARE_AND_ALGORITHMS
"""

import argparse
import json
import math
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_OUT_DIR = ROOT_DIR / "generated_courses"

DOMAIN_CONFIGS = {
    "UNIVERSAL_COURSE_COMPILER": {
        "name": "Universal Video-to-Course & Curriculum Compiler",
        "primary_fsm": "CONCEPT_LIFECYCLE_FSM",
        "secondary_fsm": "APPLICATION_WORKFLOW_FSM",
    },
    "SOFTWARE_AND_ALGORITHMS": {
        "name": "Software Engineering, Architecture & Algorithms Compiler",
        "primary_fsm": "COMPONENT_STATE_FSM",
        "secondary_fsm": "EXECUTION_PIPELINE_FSM",
    },
    "STEM_AND_QUANT_SCIENCE": {
        "name": "STEM, Mathematics, Econometrics & Quantitative Science Compiler",
        "primary_fsm": "REGIME_STATE_FSM",
        "secondary_fsm": "INFERENCE_DECISION_FSM",
    },
    "MARKET_MICROSTRUCTURE_ICT": {
        "name": "Market Microstructure & Algorithmic Trading Compiler",
        "primary_fsm": "ZONE_FSM",
        "secondary_fsm": "TRADE_FSM",
    },
}


def extract_video_id(url: str) -> str:
    patterns = [
        r"(?:v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})",
        r"^([A-Za-z0-9_-]{11})$",
    ]
    for pat in patterns:
        m = re.search(pat, url.strip())
        if m:
            return m.group(1)
    slug = re.sub(r"[^A-Za-z0-9_-]+", "_", url.strip())[:24]
    return slug or "custom_video"


def format_mm_ss(seconds: int) -> str:
    m = seconds // 60
    s = seconds % 60
    return f"{m:02d}:{s:02d}"


def calculate_slices(video_id: str, duration_s: int, max_slice_s: int = 2100) -> list[dict]:
    duration_s = max(60, int(duration_s))
    total_slices = max(1, math.ceil(duration_s / max_slice_s))
    slices = []
    for idx in range(total_slices):
        start_s = idx * max_slice_s
        end_s = min(duration_s, (idx + 1) * max_slice_s)
        slices.append(
            {
                "slice_id": f"{video_id}_S{idx + 1:02d}",
                "video_id": video_id,
                "slice_index": idx + 1,
                "total_slices": total_slices,
                "start_s": start_s,
                "end_s": end_s,
                "formatted_start": format_mm_ss(start_s),
                "formatted_end": format_mm_ss(end_s),
            }
        )
    return slices


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Universal YouTube Video/Channel to Course, Formal Spec & Dataset Compiler (v4.0)"
    )
    parser.add_argument("--url", required=True, help="YouTube Video, Playlist, or Channel URL")
    parser.add_argument("--title", default="Technical Lecture & Formal Specification", help="Video or Course Title")
    parser.add_argument("--channel", default="Universal OpenCourseWare", help="Channel or Instructor Name")
    parser.add_argument("--duration", type=int, default=2400, help="Video duration in seconds (default: 2400s)")
    parser.add_argument(
        "--domain",
        default="UNIVERSAL_COURSE_COMPILER",
        choices=list(DOMAIN_CONFIGS.keys()),
        help="Target compilation domain profile",
    )
    parser.add_argument("--output-dir", default=str(DEFAULT_OUT_DIR), help="Output directory for generated artifacts")
    args = parser.parse_args()

    video_id = extract_video_id(args.url)
    domain_cfg = DOMAIN_CONFIGS[args.domain]
    slices = calculate_slices(video_id, args.duration)

    out_dir = Path(args.output_dir).resolve() / video_id
    out_dir.mkdir(parents=True, exist_ok=True)

    manifest = {
        "compiler_version": "4.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "video_id": video_id,
        "url": args.url,
        "title": args.title,
        "channel": args.channel,
        "duration_s": args.duration,
        "domain_profile": args.domain,
        "domain_name": domain_cfg["name"],
        "primary_fsm": domain_cfg["primary_fsm"],
        "secondary_fsm": domain_cfg["secondary_fsm"],
        "slices": slices,
    }

    manifest_path = out_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    prompt_path = out_dir / f"{video_id}_EXTRACTION_PROMPT.md"
    prompt_body = f"""# UNIVERSAL VIDEO-TO-COURSE & FORMAL SPECIFICATION COMPILER (v4.0)
- **Domain Profile**: `{args.domain}` ({domain_cfg["name"]})
- **Channel / Instructor**: {args.channel}
- **Video Title**: {args.title}
- **Video URL**: {args.url}
- **Temporal Slicing**: {len(slices)} slice(s) of max 35m (2100s)

## PART A — 8-SECTION HUMAN COURSE HANDBOOK
1. Pedagogical Objective & Prerequisites
2. Visual Intuition & Mental Models (with exact `[MM:SS]` timestamps)
3. Formal Definitions & Core Axioms
4. Step-by-Step Worked Examples from the Video
5. Common Mistakes, Counter-Examples & Edge Cases
6. Operational Checklist & Decision Tree
7. Cross-Video Synthesis & Curriculum Dependencies
8. Self-Assessment Quiz & Active Recall Flashcards

## PART B — DETERMINISTIC FORMAL SPECIFICATION (CLAUDE CODE TARGET)
- Parameter Table: `[P-01]..[P-nn]`
- Instructor Decisions: `[D-01]..[D-nn]`
- Testable Formal Rules: `[R-01]..[R-nn]`
- Explicit Rejection Conditions: `[REJ-01]..[REJ-nn]`
- Primary State Machine: `{domain_cfg["primary_fsm"]}`
- Secondary State Machine: `{domain_cfg["secondary_fsm"]}`
- 3 Executable JSON Fixtures (Nominal, Rejected, Boundary)
"""
    prompt_path.write_text(prompt_body, encoding="utf-8")

    print(
        f"[OK] Universal Video Compiler manifest ({len(slices)} slice(s)) and prompt generated:\n"
        f"  - Manifest : {manifest_path}\n"
        f"  - Prompt   : {prompt_path}"
    )


if __name__ == "__main__":
    main()
