#!/usr/bin/env python3
"""
Phase 4 — Pont Hybride Gemini (Œil Multimodal) -> Claude Codeur (Ingénieur Quantitatif)
Inspiré de bradautomates/claude-video, adapté en mode SCRIBE-ICT v3/v4 :
  - Prend en entrée une fiche SCRIBE-ICT v3 (.md) ou une Bible Consolidée (MASTER_<CONCEPT>.md)
  - Extrait les paramètres P-xx, décisions D-xx, règles R-xx, machines à états ZONE_FSM/TRADE_FSM et Fixtures OHLC
  - Génère le Pack d'Exécution Claude Codeur et, si `claude` CLI ou ANTHROPIC_API_KEY est présent,
    génère directement le code PineScript v5 / Python Backtester.
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


def build_claude_coder_prompt(fiche_content: str, target: str) -> str:
    target_instructions = {
        "pinescript": (
            "CIBLE D'IMPLÉMENTATION : Indicateur & Stratégie TradingView en **Pine Script v5/v6** complet.\n"
            "- Déclare tous les paramètres `P-xx` et `D-xx` via `input.int`, `input.float`, `input.bool`, `input.string` avec leurs valeurs par défaut exactes.\n"
            "- Implémente un type `type Zone` et `type Trade` reproduisant exactement `ZONE_FSM` et `TRADE_FSM`.\n"
            "- Garantit ZÉRO lookahead (`barstate.isconfirmed` et `request.security(..., lookahead=barmerge.lookahead_off)`).\n"
            "- Trace visuellement les boîtes (box.new), les niveaux 50% (Consequent Encroachment) et affiche les labels d'état."
        ),
        "python": (
            "CIBLE D'IMPLÉMENTATION : Moteur de Détection, Backtester Vectorisé/Événementiel & Exécuteur de Fixtures en **Python 3.11+ (typage strict dataclasses)**.\n"
            "- Crée une classe `HugoFXConceptEngine` implémentant `ZONE_FSM` et `TRADE_FSM` bougie par bougie sans lookahead.\n"
            "- Implémente chaque règle `R-xx` et chaque condition de rejet `REJ-xx` sous forme de méthodes pures.\n"
            "- Intègre en bas du fichier un runner `run_fixtures()` qui exécute automatiquement les Fixtures JSON de la section B6 et vérifie avec `assert` que les états attendus sont reproduits à 100 %."
        ),
        "audit": (
            "CIBLE D'IMPLÉMENTATION : Audit Quantitatif & Critique Red-Team L99.\n"
            "- Vérifie la complétude mathématique de chaque règle `R-xx` et la déterminisme des transitions `ZONE_FSM` / `TRADE_FSM`.\n"
            "- Identifie tout cas limite intra-bougie ou multi-timeframe restant et propose un protocole de backtest statistique."
        ),
    }

    chosen_instr = target_instructions.get(target, target_instructions["pinescript"])

    return f"""# RÔLE : INGÉNIEUR QUANTITATIF SENIOR & ARCHITECTE ALGORITHMIQUE (CLAUDE CODEUR)

Tu reçois une **Spécification Formelle SCRIBE-ICT v3** extraite directement d'une vidéo de formation d'HugoFX par notre moteur multimodal Gemini Pro.

## RÈGLES ABSOLUES (INTERDICTION DE L'ICT GÉNÉRIQUE)
1. **Fidélité 100 % au Formateur** : Tu codes UNIQUEMENT les règles `[R-xx]`, paramètres `[P-xx]`, décisions `[D-xx]` et rejets `[REJ-xx]` présents dans la fiche ci-dessous. Tu n'ajoutes AUCUNE règle ICT générique extérieure non mentionnée dans la fiche.
2. **Zéro Lookahead** : Une bougie `t` n'est évaluée qu'à sa clôture confirmée. Un FVG ou Swing formé en `t` ne peut déclencher une entrée qu'à partir de `t+1`.
3. **Double Machine à États** : Respecte strictement les transitions de `ZONE_FSM` et `TRADE_FSM` ainsi que la résolution pessimiste des conflits intra-bougie.
4. **Zéro Placeholder** : Interdiction formelle d'écrire `TODO`, `pass`, ou `// implement here`. Le code livré doit être exécutable immédiatement.

{chosen_instr}

================================================================================
FICHE DE SPÉCIFICATION SOURCE (SCRIBE-ICT v3) :
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
            " content-type": "application/json",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=110) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
        blocks = payload.get("content", [])
        return "\n".join(b.get("text", "") for b in blocks if b.get("type") == "text")


def main():
    parser = argparse.ArgumentParser(description="Pont Hybride Gemini -> Claude Codeur")
    parser.add_argument("--input", required=True, help="Chemin vers la fiche .md ou MASTER_<CONCEPT>.md")
    parser.add_argument("--target", default="pinescript", choices=["pinescript", "python", "audit"])
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    if not input_path.exists():
        print(f"[ERREUR] Fichier introuvable : {input_path}", file=sys.stderr)
        sys.exit(1)

    fiche_content = input_path.read_text(encoding="utf-8")
    prompt = build_claude_coder_prompt(fiche_content, args.target)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    stem = input_path.stem.replace("_spec", "")
    prompt_out_path = OUT_DIR / f"{stem}_CLAUDE_PROMPT_{args.target.upper()}.md"
    prompt_out_path.write_text(prompt, encoding="utf-8")

    # 1. Try Anthropic API if ANTHROPIC_API_KEY is available
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if api_key:
        try:
            generated = call_anthropic_api(prompt, api_key)
            ext = "pine" if args.target == "pinescript" else ("py" if args.target == "python" else "md")
            code_path = OUT_DIR / f"{stem}_generated.{ext}"
            code_path.write_text(generated, encoding="utf-8")
            print(f"[OK] Code généré par Claude API dans : {code_path}\n\n{generated}")
            return
        except Exception as e:
            print(f"[WARN] Appel API Anthropic échoué ({e}), tentative via CLI claude...")

    # 2. Try `claude` CLI if installed locally
    claude_bin = shutil.which("claude")
    if claude_bin:
        try:
            proc = subprocess.run(
                [claude_bin, "-p", "Implémente la spécification contenue dans ce prompt sans aucune omission."],
                input=prompt,
                text=True,
                capture_output=True,
                encoding="utf-8",
                timeout=110,
            )
            if proc.returncode == 0 and proc.stdout.strip():
                ext = "pine" if args.target == "pinescript" else ("py" if args.target == "python" else "md")
                code_path = OUT_DIR / f"{stem}_generated.{ext}"
                code_path.write_text(proc.stdout, encoding="utf-8")
                print(f"[OK] Code généré via Claude Code CLI dans : {code_path}\n\n{proc.stdout}")
                return
        except Exception as e:
            print(f"[WARN] Exécution Claude CLI interrompue : {e}")

    # 3. Always deliver the ready-to-paste Master Prompt Pack saved on disk
    print(
        f"[PACK CLAUDE PRÊT] Pack sauvegardé dans : {prompt_out_path}\n"
        f"Astuce : définissez ANTHROPIC_API_KEY ou lancez `claude < \"{prompt_out_path}\"` pour générer le bot automatiquement.\n\n"
        + prompt[:2500]
        + "\n\n... [Pack complet prêt]"
    )


if __name__ == "__main__":
    main()
