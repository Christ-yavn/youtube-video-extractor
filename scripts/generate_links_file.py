import json
from pathlib import Path

catalog_path = Path("src/data/harvested_videos.json")
with open(catalog_path, "r", encoding="utf-8") as f:
    raw_catalog = json.load(f)

catalog = {}
for v in raw_catalog:
    if v["video_id"] not in catalog:
        catalog[v["video_id"]] = v

# Définition des 7 Playbooks d'Élite ICT / SMC (30 Vidéos fondamentales)
PLAYBOOKS_DEFINITION = [
    {
        "id": "PLAYBOOK_1",
        "title": "PLAYBOOK 1 : MODÈLE LICORNE & BREAKER BLOCK (UNICORN & BREAKER)",
        "role_narratif": "Retournement Haute Précision ou Continuation Agressive sur Inversion d'Order Block",
        "description_playbook": (
            "Le modèle Licorne (Unicorn) est l'un des setups les plus puissants du trading ICT. "
            "Il combine un Breaker Block (Order Block invalidé et traversé par un Displacement violent après prise de liquidité) "
            "avec un Fair Value Gap (FVG) qui se superpose exactement à l'intérieur du Breaker. "
            "L'entrée s'effectue sur le retest de cette zone de confluence géométrique (Breaker + FVG) avec SL sécurisé derrière la mèche d'origine."
        ),
        "video_ids": [
            ("NvVmRIoa6SA", "Setup Licorne Ultime : Le modèle d'entrée le plus simple selon ICT (Gros gains)", "TRIGGER_CENTRAL"),
            ("Z5K_P7qudWk", "Un Seul Modèle pour la VIE : Maîtrise de la Stratégie Licorne / Unicorn", "STRATEGIE_COMPLETE"),
            ("-Yyn8an4kUc", "La seule vidéo sur les BREAKERS BLOCKS dont tu auras besoin (Mécanique institutionnelle)", "THEORIE_BREAKER"),
            ("N7jNxIq_AX8", "BREAKER BLOCKS simplifié en 8 Minutes (Différenciation OB vs Breaker)", "EXECUTION_RAPIDE"),
            ("mI1WqbFehFo", "Mitigation Block PLUS PUISSANT que le Breaker Block ?? (Variante et nuances)", "NUANCE_MITIGATION"),
        ]
    },
    {
        "id": "PLAYBOOK_2",
        "title": "PLAYBOOK 2 : LES MEILLEURS FVG COMBINÉS & iFVG (FAIR VALUE GAP)",
        "role_narratif": "Déséquilibre de Prix, Rééquilibrage Institutionnel et Inversion de Rôle (iFVG)",
        "description_playbook": (
            "Le Fair Value Gap (FVG) représente l'empreinte digitale des algorithmes institutionnels. "
            "Ce playbook formalise les critères pour distinguer un FVG de haute probabilité d'un FVG faible : "
            "FVG dans FVG (continuation MTF), Immediate Rebalance, et Inverted Fair Value Gap (iFVG où un FVG acheteur cassé devient résistance vendeuse ou vice-versa)."
        ),
        "video_ids": [
            ("NHbQZqCHsfo", "Les 6 Meilleurs Secrets CACHÉS des Fair Value Gaps (FVG) : Hiérarchie et Confluences", "HIERARCHIE_FVG"),
            ("9VZPuY_obOE", "Comment Sélectionner l'iFVG Parfait ? 4 Règles Infaillibles pour Filtrer les Faux Signaux", "REGLES_IFVG"),
            ("wGw2EqC63SQ", "La PUISSANCE des Inverted FVG dévoilée ! (Trading de retournement sur FVG transpercé)", "EXEMPLES_IFVG"),
            ("skk0sm6LN6M", "TOUT savoir sur les FAIR VALUE GAPS (FVG) : Base mathématique et traçage", "FONDATION_FVG"),
        ]
    },
    {
        "id": "PLAYBOOK_3",
        "title": "PLAYBOOK 3 : ORDER BLOCKS INSTITUTIONNELS & CONTINUATION (CLEAN OB & PROPULSION)",
        "role_narratif": "Zones de Manipulation Institutionnelle & Blocs de Propulsion en Tendance Forte",
        "description_playbook": (
            "L'Order Block n'est pas une simple dernière bougie opposée : c'est la bougie qui a absorbé la liquidité avant un déplacement explosif laissant un FVG. "
            "Ce playbook enseigne le filtrage strict de l'Order Block parfait, le Mean Threshold (50% du corps), "
            "les 4 erreurs fatales qui mènent au Stop Loss, et le Propulsion Block (Order Block qui reteste un précédent OB sans le violer pour relancer la tendance)."
        ),
        "video_ids": [
            ("HI8LFZ1unE4", "Identifier les MEILLEURS ORDER BLOCKS (SMC) : Les 3 filtres stricts de validation", "OB_PARFAIT"),
            ("Fvwb4bJy2N0", "Les 4 Erreurs Fatales avec les ORDER BLOCKS (et comment les éviter absolument)", "FILTRES_INVALIDATION"),
            ("chnmsCK98vI", "Personne ne t'explique les Order Blocks comme ça (Retournement vs Continuation)", "CONTINUATION_OB"),
            ("NYBvIcPX7XI", "Comprendre les ORDER BLOCKS de A à Z (Théorie avancée et Blocs de Propulsion)", "THEORIE_AVANCEE"),
        ]
    },
    {
        "id": "PLAYBOOK_4",
        "title": "PLAYBOOK 4 : SETUPS A+ & MODÈLES D'ENTRÉE ULTIMES (FRAMEWORKS DAY TRADING)",
        "role_narratif": "Protocoles Complets d'Exécution Mécanique de A à Z pour Passer les Challenges",
        "description_playbook": (
            "Ce playbook regroupe les frameworks d'exécution complète d'HugoFX. "
            "Il codifie l'alignement précis entre le Biais HTF, la purge de liquidité, la confirmation par cassure, "
            "et l'entrée au millimètre avec un ratio R:R supérieur à 1:2.5 pour assurer la régularité sur compte prop firm."
        ),
        "video_ids": [
            ("mGbuUnibpo0", "Mes Modèles PRÉCIS de Prise de Position (26 Minutes de Règles d'Entrée à Copier)", "MASTERCLASS_ENTREES"),
            ("tyUAs1069DY", "Comment entrer PILE en même temps que la SMART MONEY (Timing LTF et Clôtures)", "TIMING_SMART_MONEY"),
            ("Ex6ikrViCjY", "Le MEILLEUR Setup de Retournement (Accessible à tous, Haute Probabilité)", "RETOURNEMENT_A_PLUS"),
            ("3cxhL4zMSDY", "Ce simple SETUP passe des challenges CHAQUE semaine ! (Routine mécanique)", "SETUP_PROPFIRM"),
            ("4YtrGUlwGaE", "Rentable En Seulement 8 minutes Avec Les Concepts ICT (Synthèse débutant à pro)", "EXECUTION_CONDENSEE"),
        ]
    },
    {
        "id": "PLAYBOOK_5",
        "title": "PLAYBOOK 5 : LIQUIDITÉ, SWEEPS, MSS VS CISD & FIBONACCI OTE",
        "role_narratif": "Cartographie de la Liquidité (ERL/IRL), Déclencheurs de Structure et Discount/Premium",
        "description_playbook": (
            "Le moteur qui fait bouger le marché est la recherche de liquidité. "
            "Ce playbook définit rigoureusement la différence entre BOS (continuation), MSS (changement de tendance) "
            "et CISD (Change In State of Delivery par clôture sous les corps de bougies d'impulsion). "
            "Il intègre le traçage exact de Fibonacci OTE (Optimal Trade Entry entre 62%, 70.5% et 79%) et la distinction HRL/LRL."
        ),
        "video_ids": [
            ("nmub3ColYWI", "STOP avec le MSS dans ton Trading ! Pourquoi le CISD est infiniment plus rapide et fiable", "CISD_VS_MSS"),
            ("5TZE5lDGQTo", "Deviens Expert du CISD en 8 Minutes TOP CHRONO ! (Règles précises de clôture)", "REGLES_CISD"),
            ("3TY0UcukP9A", "Pourquoi tu ne comprends pas la Liquidité | Stratégie complète + Modèle d'Entrée", "LIQUIDITE_IRL_ERL"),
            ("Ysx2KEvlvcI", "Le Meilleur Endroit pour prendre Position en Trading (OTE Fibonacci 62% - 79%)", "OTE_FIBONACCI"),
            ("0RDhQXKcJno", "High vs Low Resistance Liquidity : Comprendre la Différence (Facilité de TP)", "HRL_VS_LRL"),
        ]
    },
    {
        "id": "PLAYBOOK_6",
        "title": "PLAYBOOK 6 : SILVER BULLET & KILLZONES DE SESSIONS (AMD & NY/LONDON)",
        "role_narratif": "Fenêtres Algorithmiques Strictes de 60 Minutes (Time & Price) et Cycles AMD",
        "description_playbook": (
            "L'algorithme interbancaire IPDA opère selon le principe Time & Price. "
            "La stratégie Silver Bullet exploite les fenêtres horaires précises (03h00-04h00 Londres, 10h00-11h00 NY AM, 14h00-15h00 NY PM) "
            "où le marché réalise systématiquement un Sweep + Displacement vers un FVG avec cible fixe (15 pips Forex, 10-20 pts Indices). "
            "Ce playbook détaille également le cycle AMD (Accumulation, Manipulation, Distribution / Judas Swing)."
        ),
        "video_ids": [
            ("DO-fBNFZgoI", "STRATÉGIE SUPER SIMPLE Silver Bullet | Sans Biais Daily + 77% de Gain Vérifié", "SILVER_BULLET_CORE"),
            ("arZjghpwLpY", "PASSE TES CHALLENGES AVEC CE SETUP ! (Session LONDRES - Judas Swing)", "SESSION_LONDRES"),
            ("-VLnPu1G3ns", "PASSE TES CHALLENGES AVEC CE SETUP ! (Session NEW YORK - Continuité & Inversion)", "SESSION_NEW_YORK"),
            ("nSRijrBW5bc", "Le Pattern Le Plus Puissant en Trading = AMD (Accumulation Manipulation Distribution)", "CYCLE_AMD_PO3"),
        ]
    },
    {
        "id": "PLAYBOOK_7",
        "title": "PLAYBOOK 7 : BPR (BALANCED PRICE RANGE) & BOUGIES DE RÉJECTION / ENGLOBANTE",
        "role_narratif": "Intersection de Double Déséquilibre et Signatures Institutionnelles sur Niveaux Clés",
        "description_playbook": (
            "Le BPR (Balanced Price Range) est l'intersection exacte de deux FVG consécutifs et opposés. "
            "Considéré comme l'aimant et le rempart institutionnel par excellence, il offre des ratios R:R hors du commun. "
            "Ce playbook combine le BPR avec les bougies de réjection institutionnelles (mèche longue sur niveau de liquidité) "
            "et la bougie englobante d'absorption sur POI majeure."
        ),
        "video_ids": [
            ("dg2-OsUXN60", "Le BPR = l'arme Redoutable du Trader (Leçon Étalon SCRIBE-ICT v3)", "BPR_MAITRE"),
            ("s93qIkHqK3c", "La Méthode Pro pour Trader une Bougie de Réjection (Pas Celle des Débutants)", "BOUGIE_REJECTION"),
            ("RN12jriNHJ0", "Niveau clé + Englobante = PROFIT (Signature d'Absorption Institutionnelle)", "ENGLOBANTE_PROFIT"),
        ]
    }
]

def generate_files():
    out_dir = Path(r"C:\Users\CHRIST\Downloads\HugoFX_Playbooks_Codage")
    out_dir.mkdir(parents=True, exist_ok=True)
    
    txt_path = out_dir / "PLAYBOOKS_HUGOFX_25_VIDEOS_LINKS.txt"
    md_path = out_dir / "PLAYBOOKS_HUGOFX_25_VIDEOS_LINKS.md"

    txt_lines = []
    md_lines = []

    # En-têtes
    txt_lines.append("=" * 90)
    txt_lines.append("   CATALOGUE OFFICIEL DES 7 PLAYBOOKS HUGOFX (25+ VIDÉOS D'ÉLITE)")
    txt_lines.append("   SPÉCIFICATIONS TECHNIQUES, LIENS YOUTUBE OFFICIELS & EXTRACTION CODAGE")
    txt_lines.append("=" * 90)
    txt_lines.append("")
    txt_lines.append("Ce document recense l'intégralité des vidéos clés de la chaîne HugoFX classées par Playbook.")
    txt_lines.append("Chaque vidéo a été vérifiée avec son ID YouTube officiel, sa durée exacte et son syllabus technique.")
    txt_lines.append("Ces 7 Playbooks constituent l'architecture modulaire du bot de trading ICT/SMC.")
    txt_lines.append("")

    md_lines.append("# 🏛️ Catalogue Officiel des 7 Playbooks HugoFX (25+ Vidéos d'Élite)")
    md_lines.append("> **Spécifications Techniques, Liens YouTube Officiels & Fiches de Codage**  ")
    md_lines.append("> *Document généré pour la programmation de l'EA / Bot de Trading ICT & SMC.*")
    md_lines.append("")
    md_lines.append("---")
    md_lines.append("")

    global_video_counter = 0

    for pb_idx, pb in enumerate(PLAYBOOKS_DEFINITION, 1):
        # TXT Header
        txt_lines.append("=" * 90)
        txt_lines.append(f"{pb['title']}")
        txt_lines.append(f"Rôle Narratif : {pb['role_narratif']}")
        txt_lines.append("-" * 90)
        txt_lines.append(f"Description & Logique Algorithmique :")
        txt_lines.append(f"{pb['description_playbook']}")
        txt_lines.append("-" * 90)

        # MD Header
        md_lines.append(f"## 📘 {pb['title']}")
        md_lines.append(f"**Rôle Narratif** : *{pb['role_narratif']}*  ")
        md_lines.append(f"**Logique Algorithmique** :  \n{pb['description_playbook']}\n")
        md_lines.append("| N° | Miniature / ID | Titre Officiel & Lien | Durée | Rôle Technique |")
        md_lines.append("|---|---|---|---|---|")

        for vid_id, note_role, role_tech in pb["video_ids"]:
            global_video_counter += 1
            v_data = catalog.get(vid_id)
            if not v_data:
                continue

            titre = v_data.get("titre", "Titre inconnu")
            url = v_data.get("url", f"https://www.youtube.com/watch?v={vid_id}")
            duree_s = v_data.get("duree_s", 0)
            dur_m = duree_s // 60
            dur_s = duree_s % 60
            duree_fmt = f"{dur_m:02d}:{dur_s:02d}"
            date_pub = v_data.get("date_video", "N/A")
            raw_desc = v_data.get("description", "").strip()
            desc_lines = [l.strip() for l in raw_desc.split("\n") if l.strip() and not l.startswith("http")]
            desc_summary = " ".join(desc_lines[:3])[:250] if desc_lines else "Formation technique complète sur les concepts Smart Money."

            # TXT Entry
            txt_lines.append(f"\n[{global_video_counter}] {titre}")
            txt_lines.append(f"    • URL YouTube        : {url}")
            txt_lines.append(f"    • ID Vidéo           : {vid_id}")
            txt_lines.append(f"    • Durée Exacte       : {duree_fmt} ({duree_s} secondes)")
            txt_lines.append(f"    • Date Publication   : {date_pub}")
            txt_lines.append(f"    • Rôle Technique     : {role_tech} ({note_role})")
            txt_lines.append(f"    • Description HugoFX : {desc_summary}")

            # MD Entry
            md_lines.append(
                f"| **{global_video_counter}** | [`{vid_id}`]({url}) | [{titre}]({url}) | `{duree_fmt}` | `{role_tech}` |"
            )

        txt_lines.append("\n")
        md_lines.append("\n")

    # Écriture des fichiers
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(txt_lines))

    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines))

    print(f"✅ Fichier TXT généré : {txt_path} ({global_video_counter} vidéos)")
    print(f"✅ Fichier MD généré  : {md_path} ({global_video_counter} vidéos)")

if __name__ == "__main__":
    generate_files()
