#!/usr/bin/env python3
"""
Phase 1 — Réparation intégrale du catalogue HugoFX (harvested_videos.json & harvestedVideos.ts)
Récupère pour les 105/106 vidéos uniques de la chaîne HugoFX :
  1. La vraie durée en secondes (duree_s) au lieu de 1200 codé en dur
  2. La vraie date de publication (date_video YYYY-MM-DD) au lieu de "2024-01-01"
  3. La vraie description YouTube complète d'HugoFX au lieu de "Leçon X de la playlist..."
"""

import json
import os
import re
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Dict, Any, Optional

import yt_dlp

ROOT_DIR = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT_DIR / "src" / "data" / "harvested_videos.json"
TS_PATH = ROOT_DIR / "src" / "data" / "harvestedVideos.ts"


def fetch_from_watch_html(video_id: str) -> Optional[Dict[str, Any]]:
    """Extraction ultra-rapide depuis ytInitialPlayerResponse + microformat de la page YouTube."""
    url = f"https://www.youtube.com/watch?v={video_id}&hl=fr"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="ignore")

        m = re.search(r"var ytInitialPlayerResponse\s*=\s*(\{.+?\});\s*(?:var|</script>)", html)
        if not m:
            m = re.search(r"ytInitialPlayerResponse\s*=\s*(\{.+?\});", html)
        if not m:
            return None

        data = json.loads(m.group(1))
        video_details = data.get("videoDetails", {})
        microformat = data.get("microformat", {}).get("playerMicroformatRenderer", {})

        length_sec = int(video_details.get("lengthSeconds") or 0)
        short_desc = video_details.get("shortDescription") or ""
        title = video_details.get("title") or ""
        publish_date = (
            microformat.get("publishDate")
            or microformat.get("uploadDate")
            or ""
        )
        if publish_date and "T" in publish_date:
            publish_date = publish_date.split("T")[0]

        if length_sec > 0 and publish_date:
            return {
                "video_id": video_id,
                "duree_s": length_sec,
                "date_video": publish_date,
                "description": short_desc.strip(),
                "titre_yt": title.strip(),
                "source": "watch_html",
            }
    except Exception:
        pass
    return None


def fetch_from_ytdlp(video_id: str) -> Optional[Dict[str, Any]]:
    """Fallback robuste via yt_dlp Python API."""
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "extract_flat": False,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
            duration = int(info.get("duration") or 0)
            upload_date = info.get("upload_date") or ""
            if len(upload_date) == 8:
                date_str = f"{upload_date[0:4]}-{upload_date[4:6]}-{upload_date[6:8]}"
            else:
                date_str = "2024-01-01"
            description = (info.get("description") or "").strip()
            title = (info.get("title") or "").strip()
            if duration > 0:
                return {
                    "video_id": video_id,
                    "duree_s": duration,
                    "date_video": date_str,
                    "description": description,
                    "titre_yt": title,
                    "source": "yt_dlp",
                }
    except Exception as e:
        print(f"[WARN] yt-dlp failed for {video_id}: {e}")
    return None


def fetch_video_metadata(video_id: str) -> Dict[str, Any]:
    res = fetch_from_watch_html(video_id)
    if res and res["duree_s"] > 0 and res["date_video"] != "2024-01-01":
        return res
    res2 = fetch_from_ytdlp(video_id)
    if res2:
        return res2
    return {
        "video_id": video_id,
        "duree_s": 0,
        "date_video": "2024-01-01",
        "description": "",
        "titre_yt": "",
        "source": "failed",
    }


def main():
    t0 = time.time()
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    unique_ids = sorted({item["video_id"] for item in catalog})
    print(f"[INFO] Catalogue chargé : {len(catalog)} entrées brutes, {len(unique_ids)} vidéos uniques.")

    results: Dict[str, Dict[str, Any]] = {}
    with ThreadPoolExecutor(max_workers=12) as pool:
        future_map = {pool.submit(fetch_video_metadata, vid): vid for vid in unique_ids}
        done_count = 0
        for fut in as_completed(future_map):
            vid = future_map[fut]
            done_count += 1
            meta = fut.result()
            results[vid] = meta
            if done_count % 15 == 0 or done_count == len(unique_ids) or vid in ("XNS2k4KMBhU", "dg2-OsUXN60", "J_zu5gnN_Xc"):
                print(
                    f"  [{done_count}/{len(unique_ids)}] {vid} -> duree={meta['duree_s']}s | "
                    f"date={meta['date_video']} | desc={len(meta['description'])} chars ({meta['source']})"
                )

    updated_count = 0
    for item in catalog:
        vid = item["video_id"]
        meta = results.get(vid)
        if meta and meta["duree_s"] > 0:
            item["duree_s"] = meta["duree_s"]
            item["date_video"] = meta["date_video"]
            if meta["description"]:
                item["description"] = meta["description"]
            updated_count += 1

    # Sauvegarde dans harvested_videos.json
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    # Sauvegarde dans harvestedVideos.ts
    ts_content = (
        "// ============================================================================\n"
        "// CATALOGUE VÉRIFIÉ YOUTUBE (Généré par scripts/repair_catalog_metadata.py)\n"
        "// Contient les vraies durées (duree_s), vraies dates de publication (date_video)\n"
        "// et vraies descriptions YouTube d'HugoFX pour les 110 entrées (4 playlists).\n"
        "// ============================================================================\n\n"
        "export const HARVESTED_VIDEOS = "
        + json.dumps(catalog, ensure_ascii=False, indent=2)
        + ";\n"
    )
    with open(TS_PATH, "w", encoding="utf-8") as f:
        f.write(ts_content)

    elapsed = time.time() - t0
    still_1200 = sum(1 for item in catalog if item["duree_s"] == 1200)
    still_2024 = sum(1 for item in catalog if item["date_video"] == "2024-01-01")
    over_35min = sum(1 for meta in results.values() if meta["duree_s"] > 2100)
    print(f"\n[OK] Catalogue réparé en {elapsed:.1f}s : {updated_count}/{len(catalog)} entrées mises à jour.")
    print(f"     Entrées encore à 1200s : {still_1200}")
    print(f"     Entrées encore à 2024-01-01 : {still_2024}")
    print(f"     Vidéos > 35 min (2100s) détectées : {over_35min}")


if __name__ == "__main__":
    main()
