import os
import sys
import json
import time
import re
import urllib.request
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).resolve().parent.parent
DOWNLOADS_DIR = Path(r"C:\Users\CHRIST\Downloads\HugoFX_Playbooks_Codage")
FICHES_DIR = DOWNLOADS_DIR / "fiches_techniques"
PACKS_DIR = DOWNLOADS_DIR / "packs_agent_codage"

FICHES_DIR.mkdir(parents=True, exist_ok=True)
PACKS_DIR.mkdir(parents=True, exist_ok=True)

# Dual API Keys for load balancing & quota redundancy
def load_keys():
    k = []
    if os.environ.get("GEMINI_API_KEY"):
        k.append(os.environ.get("GEMINI_API_KEY"))
    if os.environ.get("GEMINI_BACKUP_KEY"):
        k.append(os.environ.get("GEMINI_BACKUP_KEY"))
    env_file = ROOT_DIR / ".env"
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("GEMINI_API_KEY="):
                    val = line.strip().split("=", 1)[1].strip().strip('"').strip("'")
                    if val and val not in k:
                        k.append(val)
                if line.startswith("GEMINI_BACKUP_KEY="):
                    val = line.strip().split("=", 1)[1].strip().strip('"').strip("'")
                    if val and val not in k:
                        k.append(val)
    return k

API_KEYS = load_keys()

# Verified operational models on Google AI Studio
MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
]

# Read Prompt
with open(ROOT_DIR / "src/data/scribePromptV2.ts", "r", encoding="utf-8") as f:
    prompt_file_content = f.read()

start_idx = prompt_file_content.find("export const SCRIBE_PROMPT_V3 = `")
if start_idx != -1:
    prompt_raw = prompt_file_content[start_idx + len("export const SCRIBE_PROMPT_V3 = `"):]
    end_idx = prompt_raw.find("`;")
    MASTER_PROMPT = prompt_raw[:end_idx]
else:
    MASTER_PROMPT = "Tu es SCRIBE-ICT v4, extracteur algorithmique d'élite pour le trading SMC/ICT."

# Catalog
with open(ROOT_DIR / "src/data/harvested_videos.json", "r", encoding="utf-8") as f:
    catalog_list = json.load(f)
catalog = {v["video_id"]: v for v in catalog_list}

TARGET_VIDEOS = [
    # Playbook 1 : Licorne & Breaker (5)
    {"id": "NvVmRIoa6SA", "playbook": "PLAYBOOK_1", "name": "Licorne_Unicorn_Entree_Simple"},
    {"id": "Z5K_P7qudWk", "playbook": "PLAYBOOK_1", "name": "Licorne_Un_Seul_Modele_Pour_La_Vie"},
    {"id": "-Yyn8an4kUc", "playbook": "PLAYBOOK_1", "name": "Breakers_Blocks_Seule_Video_Besoin"},
    {"id": "N7jNxIq_AX8", "playbook": "PLAYBOOK_1", "name": "Breaker_Blocks_Simplifie_8_Min"},
    {"id": "mI1WqbFehFo", "playbook": "PLAYBOOK_1", "name": "Mitigation_Block_Vs_Breaker_Block"},

    # Playbook 2 : FVG Combinés & iFVG (4)
    {"id": "NHbQZqCHsfo", "playbook": "PLAYBOOK_2", "name": "Secrets_Caches_FVG"},
    {"id": "9VZPuY_obOE", "playbook": "PLAYBOOK_2", "name": "Selectionner_IFVG_Parfait_4_Regles"},
    {"id": "wGw2EqC63SQ", "playbook": "PLAYBOOK_2", "name": "Puissance_Inverted_FVG"},
    {"id": "skk0sm6LN6M", "playbook": "PLAYBOOK_2", "name": "Tout_Savoir_Sur_Les_FVG"},

    # Playbook 3 : Order Blocks Institutionnels & Continuation (4)
    {"id": "HI8LFZ1unE4", "playbook": "PLAYBOOK_3", "name": "Identifier_Meilleurs_Order_Blocks"},
    {"id": "Fvwb4bJy2N0", "playbook": "PLAYBOOK_3", "name": "Erreurs_Fatales_Order_Blocks"},
    {"id": "chnmsCK98vI", "playbook": "PLAYBOOK_3", "name": "Order_Blocks_Retournement_Vs_Continuation"},
    {"id": "NYBvIcPX7XI", "playbook": "PLAYBOOK_3", "name": "Order_Blocks_De_A_A_Z_Propulsion"},

    # Playbook 4 : Setups A+ & Entrées (5)
    {"id": "mGbuUnibpo0", "playbook": "PLAYBOOK_4", "name": "Modeles_Precis_Prise_Position"},
    {"id": "tyUAs1069DY", "playbook": "PLAYBOOK_4", "name": "Entrer_En_Meme_Temps_Que_Smart_Money"},
    {"id": "Ex6ikrViCjY", "playbook": "PLAYBOOK_4", "name": "Meilleur_Setup_Retournement"},
    {"id": "3cxhL4zMSDY", "playbook": "PLAYBOOK_4", "name": "Setup_Passe_Challenges_Chaque_Semaine"},
    {"id": "4YtrGUlwGaE", "playbook": "PLAYBOOK_4", "name": "Rentable_8_Minutes_Concepts_ICT"},

    # Playbook 5 : Liquidité, Sweeps, CISD & OTE (5)
    {"id": "nmub3ColYWI", "playbook": "PLAYBOOK_5", "name": "STOP_MSS_CISD_Est_Mieux"},
    {"id": "5TZE5lDGQTo", "playbook": "PLAYBOOK_5", "name": "Deviens_Expert_CISD_8_Minutes"},
    {"id": "3TY0UcukP9A", "playbook": "PLAYBOOK_5", "name": "Comprendre_Liquidite_Strategie_Entree"},
    {"id": "Ysx2KEvlvcI", "playbook": "PLAYBOOK_5", "name": "Meilleur_Endroit_Prendre_Position_OTE"},
    {"id": "0RDhQXKcJno", "playbook": "PLAYBOOK_5", "name": "High_Vs_Low_Resistance_Liquidity"},

    # Playbook 6 : Silver Bullet & Killzones (4)
    {"id": "DO-fBNFZgoI", "playbook": "PLAYBOOK_6", "name": "Strategie_Simple_Silver_Bullet_77_Gain"},
    {"id": "arZjghpwLpY", "playbook": "PLAYBOOK_6", "name": "Passe_Challenges_Session_Londres"},
    {"id": "-VLnPu1G3ns", "playbook": "PLAYBOOK_6", "name": "Passe_Challenges_Session_New_York"},
    {"id": "nSRijrBW5bc", "playbook": "PLAYBOOK_6", "name": "Pattern_Plus_Puissant_AMD"},

    # Playbook 7 : BPR & Réjection (3)
    {"id": "dg2-OsUXN60", "playbook": "PLAYBOOK_7", "name": "BPR_Arme_Redoutable_Du_Trader"},
    {"id": "s93qIkHqK3c", "playbook": "PLAYBOOK_7", "name": "Methode_Pro_Trader_Bougie_Rejection"},
    {"id": "RN12jriNHJ0", "playbook": "PLAYBOOK_7", "name": "Niveau_Cle_Plus_Englobante_Profit"},
]

def clean_slug(s: str) -> str:
    s = re.sub(r'[^a-zA-Z0-9_]', '_', s)
    s = re.sub(r'_+', '_', s).strip('_')
    return s

def build_extraction_prompt(v_data: dict) -> str:
    duree_s = v_data.get("duree_s", 0)
    dur_m = duree_s // 60
    dur_s = duree_s % 60
    dur_fmt = f"{dur_m:02d}:{dur_s:02d}"

    return f"""{MASTER_PROMPT}

================================================================================
MÉTADONNÉES OFFICIELLES YOUTUBE DE CETTE VIDÉO (SOURCE DE VÉRITÉ OBLIGATOIRE) :
================================================================================
- ID_YOUTUBE : "{v_data['video_id']}"
- URL_YOUTUBE : "{v_data['url']}"
- TITRE_EXACT : "{v_data['titre']}"
- DATE_PUBLICATION_EXACTE : "{v_data.get('date_video', '2024-01-01')}"
- DURÉE_TOTALE_EXACTE : {duree_s} secondes ({dur_fmt})
- TRANCHE_ANALYSÉE : "00:00 - {dur_fmt} (Vidéo Intégrale 1/1)"
- PLAYLISTS : "CONCEPTS_SETUPS_PLAYBOOKS"
- FAMILLE_CURSUS : "FORMATION_HUGOFX_ELITE"
- DESCRIPTION_YOUTUBE_ORIGINALE_HUGOFX :
\"\"\"
{(v_data.get('description', '') or '')[:2500]}
\"\"\"

CONSIGNES STRICTES :
1. Analyse la vidéo dans son intégralité (de 00:00 à {dur_fmt}).
2. Respecte rigoureusement la structure double-face SCRIBE-ICT v3 / v4 :
   - Frontmatter YAML complet
   - Section I : REGISTRE DE PREUVES HORODATÉ (Preuves Verbales [S-01 à S-15+], Preuves Visuelles [F-01 à F-08+], Registre Unique des Exemples [X-01 à X-04+] avec mesures chiffrées réelles)
   - Section II : TABLE UNIQUE DES PARAMÈTRES [P-xx] & DÉCISIONS DE DESIGN [D-xx]
   - Section III : SPÉCIFICATION FORMELLE AGENTIQUE (ZONE_FSM, TRADE_FSM, RÈGLES D'INVALIDATION [REJ-01 à REJ-06], FIXTURES SYNTHÉTIQUES OHLC JSON)
   - Section IV : LEÇON HUMAINE EXPERTE (8 sections complètes avec citation croisée obligatoire de chaque [P-xx], [D-xx], [R-xx] et [REJ-xx]).
3. AUCUN BARÈME INVENTÉ (jamais de "+40 pts").
4. Rédige en français d'élite, exhaustif, sans raccourci ni placeholder.
"""

def generate_with_gemini(video_url: str, prompt_text: str):
    url_base = "https://generativelanguage.googleapis.com/v1beta/models/"
    
    # Try models in order, with key rotation and backoff
    for model_name in MODELS:
        for key_idx, key in enumerate(API_KEYS):
            full_endpoint = f"{url_base}{model_name}:generateContent?key={key}"
            req_body = {
                "contents": [{
                    "parts": [
                        {"fileData": {"fileUri": video_url, "mimeType": "video/*"}},
                        {"text": prompt_text}
                    ]
                }],
                "generationConfig": {
                    "temperature": 0.1,
                    "maxOutputTokens": 65536
                }
            }
            
            for attempt in range(2):
                try:
                    req = urllib.request.Request(
                        full_endpoint,
                        data=json.dumps(req_body).encode("utf-8"),
                        headers={"Content-Type": "application/json"},
                        method="POST"
                    )
                    with urllib.request.urlopen(req, timeout=90) as resp:
                        if resp.status == 200:
                            data = json.loads(resp.read().decode("utf-8"))
                            cand = data.get("candidates", [])
                            if cand and "content" in cand[0] and "parts" in cand[0]["content"]:
                                text = cand[0]["content"]["parts"][0].get("text", "")
                                if text and len(text) > 800:
                                    return text, f"{model_name} (Cle {key_idx+1})"
                except Exception as e:
                    err_str = str(e)
                    if "503" in err_str or "429" in err_str:
                        # Temporary server spike -> short backoff
                        time.sleep(4)
                    else:
                        time.sleep(2)
            time.sleep(2)
        
    return None, None

def generate_coder_pack(fiche_path: Path, pack_path: Path, v_info: dict):
    with open(fiche_path, "r", encoding="utf-8") as f:
        fiche_text = f.read()

    pack_content = f"""# 🧠 PACK AGENT DE CODAGE (CLAUDE / GEMINI / GPT-4o)
# SETUP : {v_info['name']} (Vidéo {v_info['id']})
# PLAYBOOK : {v_info['playbook']}
# SOURCE : Chaîne HugoFX (Méthode officielle ICT & Smart Money)

Ce document contient l'intégralité des spécifications mathématiques, seuils et machines à états 
extraits de la formation HugoFX. Il est spécialement calibré pour être donné à un modèle de code 
(Claude 3.7 / GPT-4o / DeepSeek R1) pour générer l'Expert Advisor MQL5 ou le script Pine Script v6.

---

## 1. RÈGLES DE CODAGE STRICTES
1. **Zéro Lookahead** : Une bougie t n'est validée qu'à son 'close' confirmé. Aucune prise d'ordre sur bougie non clôturée.
2. **Double Machine à États** :
   - State Machine 1 : Détection & Vie de la POI (`ZONE_FSM`)
   - State Machine 2 : Exécution & Gestion de l'Ordre (`TRADE_FSM`)
3. **Seuils & Paramètres** : N'invente aucun chiffre. Utilise exclusivement les paramètres `[P-xx]` et `[D-xx]` définis ci-dessous.
4. **Filtres de Rejet** : Rejette le setup dès qu'une condition `[REJ-xx]` est vraie.

---

## 2. SPÉCIFICATION TECHNIQUE SCRIBE-ICT V4
{fiche_text}

---

## 3. PROMPT DE GÉNÉRATION CODE POUR L'AGENT
```markdown
Agis en tant que développeur quantitatif senior MQL5 et Pine Script.
En utilisant STRICTEMENT la fiche technique ci-dessus :
1. Crée la classe ou le module de détection autonome du setup '{v_info['name']}'.
2. Implémente la fonction 'is_setup_valid()' vérifiant toutes les règles P-xx et REJ-xx.
3. Implémente la machine à état 'ZONE_FSM' et 'TRADE_FSM'.
4. Implémente la pose des ordres d'entrée, Stop Loss et Take Profit (RR >= 1:2.5).
5. Ne mets aucun placeholder ni TODO. Tout le code doit être fonctionnel.
```
"""
    with open(pack_path, "w", encoding="utf-8") as f:
        f.write(pack_content)

def main():
    print("=== PIPELINE BATCH HUGOFX PLAYBOOKS (DOUBLE CLE + CASCADE 3.6/3.5) ===", flush=True)
    total = len(TARGET_VIDEOS)
    success = 0

    for i, target in enumerate(TARGET_VIDEOS, 1):
        vid = target["id"]
        v_name = target["name"]
        pb = target["playbook"]
        slug = f"HugoFX_Fiche_{vid}_{clean_slug(v_name)}.md"
        fiche_file = FICHES_DIR / slug
        pack_file = PACKS_DIR / f"PACK_CODER_{vid}_{clean_slug(v_name)}.md"

        print(f"\n[{i}/{total}] Traitement {vid} ({v_name}) - {pb}...", flush=True)

        # Skip if fiche already exists and > 2000 bytes
        if fiche_file.exists() and fiche_file.stat().st_size > 2000:
            print(f"  -> Deja existante ({fiche_file.stat().st_size} octets). Creation/Verification Pack...", flush=True)
            if not pack_file.exists() or pack_file.stat().st_size < 1000:
                generate_coder_pack(fiche_file, pack_file, target)
            success += 1
            continue

        # Fetch video data
        v_data = catalog.get(vid)
        if not v_data:
            print(f"  -> ERREUR: Video {vid} non trouvee dans le catalogue.", flush=True)
            continue

        prompt = build_extraction_prompt(v_data)
        print(f"  -> Appel API Gemini multimodal sur {v_data['url']}...", flush=True)
        start_time = time.time()
        fiche_text, model_info = generate_with_gemini(v_data["url"], prompt)
        elapsed = time.time() - start_time

        if fiche_text:
            print(f"  -> Succes en {elapsed:.1f}s via {model_info} ({len(fiche_text)} carac). Sauvegarde...", flush=True)
            with open(fiche_file, "w", encoding="utf-8") as f:
                f.write(fiche_text)
            generate_coder_pack(fiche_file, pack_file, target)
            success += 1
        else:
            print(f"  -> ECHEC sur {vid}. Passage a la suivante.", flush=True)

        # Polite breathing delay between videos to prevent Google AI spikes
        time.sleep(3)

    print(f"\n=== FIN DU BATCH : {success}/{total} VIDEOS TRAITEES ===", flush=True)
    print(f"Fiches techniques : {FICHES_DIR}", flush=True)
    print(f"Packs de codage   : {PACKS_DIR}", flush=True)

if __name__ == "__main__":
    main()
