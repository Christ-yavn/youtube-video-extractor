import json
from pathlib import Path

catalog_path = Path("src/data/harvested_videos.json")
with open(catalog_path, "r", encoding="utf-8") as f:
    vids = {v["video_id"]: v for v in json.load(f)}

playbooks = {
    "PLAYBOOK 1 : MODÈLE LICORNE & BREAKER BLOCK (UNICORN & BREAKER)": [
        "NvVmRIoa6SA",  # LE SETUP LE PLUS RENTABLE DU TRADING (UNICORN SETUP)
        "Z5K_P7qudWk",  # Ce setup de trading est TRÈS puissant ! (STRATÉGIE UNICORN)
        "-Yyn8an4kUc",  # Les SECRETS des BREAKER BLOCKS en trading SMC
        "N7jNxIq_AX8",  # Le secret du Breaker Block
        "mI1WqbFehFo",  # 3 Erreurs Avec Les Breaker Blocks (Trading SMC)
    ],
    "PLAYBOOK 2 : LES MEILLEURS FVG COMBINÉS & iFVG (FAIR VALUE GAP)": [
        "NHbQZqCHsfo",  # Les 3 Meilleurs FVG En Trading SMC (Fair Value Gap)
        "9VZPuY_obOE",  # Le SECRET du FVG (Fair Value Gap) en SMC Trading
        "wGw2EqC63SQ",  # L'erreur FATALE avec les FVG en SMC Trading (Fair value Gap)
        "skk0sm6LN6M",  # 3 Erreurs à Éviter avec l'iFVG (Inverted Fair Value Gap)
    ],
    "PLAYBOOK 3 : ORDER BLOCKS INSTITUTIONNELS & CONTINUATION": [
        "HI8LFZ1unE4",  # L'Order Block PARFAIT en Trading SMC
        "Fvwb4bJy2N0",  # La VÉRITÉ Sur Les Order Blocks (Trading SMC)
        "chnmsCK98vI",  # 3 Erreurs Avec Les Order Blocks (Trading SMC)
        "NYBvIcPX7XI",  # Le Secret Du Propulsion Block (Trading SMC)
    ],
    "PLAYBOOK 4 : SETUPS A+ & MODÈLES D'ENTRÉE ULTIMES": [
        "mGbuUnibpo0",  # LE MEILLEUR SETUP DU MONDE (Trading ICT)
        "tyUAs1069DY",  # Un Setup TRÈS RENTABLE en Trading SMC
        "O0iSfZv8z3A",  # CE SETUP DE TRADING EST TRÈS PUISSANT ! (Stratégie SMC)
        "4YtrGUlwGaE",  # CE SETUP M'A FAIT GAGNER 14 000$ (Stratégie SMC)
        "XNS2k4KMBhU",  # Comment Entrer Au BON Moment Sur Le Marché (Trading SMC)
    ],
    "PLAYBOOK 5 : LIQUIDITÉ, SWEEPS, MSS VS CISD & FIBONACCI OTE": [
        "nmub3ColYWI",  # TOUT Comprendre Sur La LIQUIDITÉ En Trading SMC (En 12 Minutes)
        "5TZE5lDGQTo",  # Le VRAI Secret De La Liquidité En Trading SMC
        "3TY0UcukP9A",  # La VRAIE Différence Entre BOS et CHoCH (Trading SMC)
        "Ysx2KEvlvcI",  # BOS vs MSS vs CISD : Ne Confonds Plus ! (Trading SMC)
        "0RDhQXKcJno",  # Comment Tracer FIBONACCI Comme Un Pro En Trading SMC (OTE)
    ],
    "PLAYBOOK 6 : SILVER BULLET & KILLZONES DE SESSIONS": [
        "DO-fBNFZgoI",  # La Stratégie SILVER BULLET d'ICT Expliquée (Trading SMC)
        "arZjghpwLpY",  # La MEILLEURE Session Pour Trader En SMC ? (Killzones)
        "-VLnPu1G3ns",  # Trader La Session De NEW YORK En Trading SMC
        "nSRijrBW5bc",  # Le Modèle AMD (Accumulation Manipulation Distribution)
    ],
    "PLAYBOOK 7 : BPR (BALANCED PRICE RANGE) & BOUGIES DE RÉJECTION": [
        "dg2-OsUXN60",  # Le BPR : L'Imbalance La Plus Puissante En Trading SMC
        "s93qIkHqK3c",  # La Bougie De Réjection En Trading SMC (Le Secret)
        "RN12jriNHJ0",  # La Bougie Englobante Institutionnelle (Trading SMC)
    ],
}

total_count = sum(len(v_list) for v_list in playbooks.values())
print(f"Total Playbooks: {len(playbooks)}, Total Videos: {total_count}")

for pb_name, pb_ids in playbooks.items():
    print(f"\n{pb_name} ({len(pb_ids)} vidéos):")
    for vid in pb_ids:
        v = vids.get(vid)
        if v:
            dur = f"{v['duree_s']//60:02d}:{v['duree_s']%60:02d}"
            print(f"  - [{vid}] ({dur}) {v['titre']}")
        else:
            print(f"  - [{vid}] NOT FOUND IN CATALOG")
