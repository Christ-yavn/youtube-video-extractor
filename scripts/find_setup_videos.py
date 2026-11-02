import json
from pathlib import Path

p = Path(r"C:\Users\CHRIST\.gemini\antigravity\scratch\hugofx-workbench\src\data\harvested_videos.json")
with open(p, "r", encoding="utf-8") as f:
    videos = json.load(f)

dedup = {}
for v in videos:
    vid = v["video_id"]
    if vid not in dedup:
        dedup[vid] = v

items = list(dedup.values())

def find_by_topics():
    categorized = {
        "PLAYBOOK_UNICORN_BREAKER": [],
        "PLAYBOOK_FVG_COMBINES": [],
        "PLAYBOOK_ORDER_BLOCK": [],
        "PLAYBOOK_SETUPS_A_PLUS_ET_ENTREES": [],
        "PLAYBOOK_FIBONACCI_OTE_MSS": [],
        "PLAYBOOK_SILVER_BULLET_SESSIONS": [],
        "PLAYBOOK_BPR_CISD_REJECTION": []
    }
    
    for v in items:
        t = v["titre"].lower()
        d = v.get("description", "").lower()
        full = t + " " + d
        
        # 1. Unicorn & Breaker
        if "licorne" in full or "unicorn" in full or "breaker" in t:
            categorized["PLAYBOOK_UNICORN_BREAKER"].append(v)
        # 2. FVG & Imbalance
        elif "fvg" in t or "fair value gap" in t or "imbalance" in t:
            categorized["PLAYBOOK_FVG_COMBINES"].append(v)
        # 3. Order Block
        elif "order block" in t or "orderblock" in t:
            categorized["PLAYBOOK_ORDER_BLOCK"].append(v)
        # 4. BPR, CISD, Bougie Rejection
        elif "bpr" in t or "cisd" in t or "englobante" in t or "réjection" in t or "rejection" in t or "sweep" in t:
            categorized["PLAYBOOK_BPR_CISD_REJECTION"].append(v)
        # 5. Silver Bullet & Killzones / Sessions
        elif "silver bullet" in full or "killzone" in t or "session" in t or "amd" in t or "po3" in t:
            categorized["PLAYBOOK_SILVER_BULLET_SESSIONS"].append(v)
        # 6. Fibonacci OTE, Structure & MSS
        elif "fibonacci" in full or "ote" in full or "mss" in full or "structure" in t:
            categorized["PLAYBOOK_FIBONACCI_OTE_MSS"].append(v)
        # 7. Setups A+ / Stratégies
        elif any(k in t for k in ["stratégie", "strategie", "setup", "rentable", "modèle", "modele", "entrer", "entrée", "secret", "gains", "retrait"]):
            categorized["PLAYBOOK_SETUPS_A_PLUS_ET_ENTREES"].append(v)

    for cat, vids in categorized.items():
        print(f"\n========================================================")
        print(f"=== {cat} ({len(vids)} vidéos trouvées) ===")
        print(f"========================================================")
        for v in vids:
            dur_m = v["duree_s"] // 60
            dur_s = v["duree_s"] % 60
            desc_first = (v.get("description", "").split("\n")[0])[:120]
            print(f"- [{v['video_id']}] ({dur_m:02d}:{dur_s:02d}) {v['titre']}")
            print(f"  URL : {v['url']}")
            print(f"  Résumé : {desc_first}")

if __name__ == "__main__":
    find_by_topics()
