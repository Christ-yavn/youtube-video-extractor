import json
from pathlib import Path

p = Path(r"C:\Users\CHRIST\.gemini\antigravity\scratch\hugofx-workbench\src\data\harvested_videos.json")
with open(p, "r", encoding="utf-8") as f:
    videos = json.load(f)

print("VIDEOS FIBONACCI / OTE / LIQUIDITE / SETUP:")
for v in videos:
    text = (v["titre"] + " " + v.get("description", "")).lower()
    if any(k in text for k in ["fibonacci", "ote", "0.705", "0.62", "modèle", "modele d'entrée", "favoris"]):
        dur_m = v["duree_s"] // 60
        dur_s = v["duree_s"] % 60
        print(f"- [{v['video_id']}] ({dur_m:02d}:{dur_s:02d}) {v['titre']}")
        print(f"  URL: {v['url']}")
