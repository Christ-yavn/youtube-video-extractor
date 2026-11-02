import fs from 'fs';
import path from 'path';

const DOWNLOADS_DIR = 'C:\\Users\\CHRIST\\Downloads\\HugoFX_Playbooks_Codage';
const FICHES_DIR = path.join(DOWNLOADS_DIR, 'fiches_techniques');
const PACKS_DIR = path.join(DOWNLOADS_DIR, 'packs_agent_codage');

if (!fs.existsSync(FICHES_DIR)) fs.mkdirSync(FICHES_DIR, { recursive: true });
if (!fs.existsSync(PACKS_DIR)) fs.mkdirSync(PACKS_DIR, { recursive: true });

// Dual Keys read securely from environment or .env
function loadEnvKeys() {
  const keys = [];
  if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);
  if (process.env.GEMINI_BACKUP_KEY) keys.push(process.env.GEMINI_BACKUP_KEY);
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf-8').split('\n');
    for (const l of lines) {
      if (l.startsWith('GEMINI_API_KEY=')) {
        const val = l.split('=', 2)[1].trim().replace(/^["']|["']$/g, '');
        if (val && !keys.includes(val)) keys.push(val);
      }
      if (l.startsWith('GEMINI_BACKUP_KEY=')) {
        const val = l.split('=', 2)[1].trim().replace(/^["']|["']$/g, '');
        if (val && !keys.includes(val)) keys.push(val);
      }
    }
  }
  return keys;
}

const API_KEYS = loadEnvKeys();

// Active verified models
const MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];

// Prompt
const promptFile = fs.readFileSync('src/data/scribePromptV2.ts', 'utf-8');
const startIdx = promptFile.indexOf('export const SCRIBE_PROMPT_V3 = `');
const rawPrompt = promptFile.slice(startIdx + 'export const SCRIBE_PROMPT_V3 = `'.length);
const endIdx = rawPrompt.indexOf('`;');
const masterPrompt = rawPrompt.slice(0, endIdx);

// Catalog
const catalogRaw = JSON.parse(fs.readFileSync('src/data/harvested_videos.json', 'utf-8'));
const catalog = new Map();
for (const v of catalogRaw) {
  if (!catalog.has(v.video_id)) catalog.set(v.video_id, v);
}

const TARGET_VIDEOS = [
  { id: 'NvVmRIoa6SA', playbook: 'PLAYBOOK_1', name: 'Licorne_Unicorn_Entree_Simple' },
  { id: 'Z5K_P7qudWk', playbook: 'PLAYBOOK_1', name: 'Licorne_Un_Seul_Modele_Pour_La_Vie' },
  { id: '-Yyn8an4kUc', playbook: 'PLAYBOOK_1', name: 'Breakers_Blocks_Seule_Video_Besoin' },
  { id: 'N7jNxIq_AX8', playbook: 'PLAYBOOK_1', name: 'Breaker_Blocks_Simplifie_8_Min' },
  { id: 'mI1WqbFehFo', playbook: 'PLAYBOOK_1', name: 'Mitigation_Block_Vs_Breaker_Block' },

  { id: 'NHbQZqCHsfo', playbook: 'PLAYBOOK_2', name: 'Secrets_Caches_FVG' },
  { id: '9VZPuY_obOE', playbook: 'PLAYBOOK_2', name: 'Selectionner_IFVG_Parfait_4_Regles' },
  { id: 'wGw2EqC63SQ', playbook: 'PLAYBOOK_2', name: 'Puissance_Inverted_FVG' },
  { id: 'skk0sm6LN6M', playbook: 'PLAYBOOK_2', name: 'Tout_Savoir_Sur_Les_FVG' },

  { id: 'HI8LFZ1unE4', playbook: 'PLAYBOOK_3', name: 'Identifier_Meilleurs_Order_Blocks' },
  { id: 'Fvwb4bJy2N0', playbook: 'PLAYBOOK_3', name: 'Erreurs_Fatales_Order_Blocks' },
  { id: 'chnmsCK98vI', playbook: 'PLAYBOOK_3', name: 'Order_Blocks_Retournement_Vs_Continuation' },
  { id: 'NYBvIcPX7XI', playbook: 'PLAYBOOK_3', name: 'Order_Blocks_De_A_A_Z_Propulsion' },

  { id: 'mGbuUnibpo0', playbook: 'PLAYBOOK_4', name: 'Modeles_Precis_Prise_Position' },
  { id: 'tyUAs1069DY', playbook: 'PLAYBOOK_4', name: 'Entrer_En_Meme_Temps_Que_Smart_Money' },
  { id: 'Ex6ikrViCjY', playbook: 'PLAYBOOK_4', name: 'Meilleur_Setup_Retournement' },
  { id: '3cxhL4zMSDY', playbook: 'PLAYBOOK_4', name: 'Setup_Passe_Challenges_Chaque_Semaine' },
  { id: '4YtrGUlwGaE', playbook: 'PLAYBOOK_4', name: 'Rentable_8_Minutes_Concepts_ICT' },

  { id: 'nmub3ColYWI', playbook: 'PLAYBOOK_5', name: 'STOP_MSS_CISD_Est_Mieux' },
  { id: '5TZE5lDGQTo', playbook: 'PLAYBOOK_5', name: 'Deviens_Expert_CISD_8_Minutes' },
  { id: '3TY0UcukP9A', playbook: 'PLAYBOOK_5', name: 'Comprendre_Liquidite_Strategie_Entree' },
  { id: 'Ysx2KEvlvcI', playbook: 'PLAYBOOK_5', name: 'Meilleur_Endroit_Prendre_Position_OTE' },
  { id: '0RDhQXKcJno', playbook: 'PLAYBOOK_5', name: 'High_Vs_Low_Resistance_Liquidity' },

  { id: 'DO-fBNFZgoI', playbook: 'PLAYBOOK_6', name: 'Strategie_Simple_Silver_Bullet_77_Gain' },
  { id: 'arZjghpwLpY', playbook: 'PLAYBOOK_6', name: 'Passe_Challenges_Session_Londres' },
  { id: '-VLnPu1G3ns', playbook: 'PLAYBOOK_6', name: 'Passe_Challenges_Session_New_York' },
  { id: 'nSRijrBW5bc', playbook: 'PLAYBOOK_6', name: 'Pattern_Plus_Puissant_AMD' },

  { id: 'dg2-OsUXN60', playbook: 'PLAYBOOK_7', name: 'BPR_Arme_Redoutable_Du_Trader' },
  { id: 's93qIkHqK3c', playbook: 'PLAYBOOK_7', name: 'Methode_Pro_Trader_Bougie_Rejection' },
  { id: 'RN12jriNHJ0', playbook: 'PLAYBOOK_7', name: 'Niveau_Cle_Plus_Englobante_Profit' },
];

function cleanSlug(s) {
  return s.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function generateCoderPack(fichePath, packPath, target) {
  const ficheText = fs.readFileSync(fichePath, 'utf-8');
  const packContent = `# 🧠 PACK AGENT DE CODAGE (CLAUDE / GEMINI / GPT-4o)
# SETUP : ${target.name} (Vidéo ${target.id})
# PLAYBOOK : ${target.playbook}
# SOURCE : Chaîne HugoFX (Méthode officielle ICT & Smart Money)

Ce document contient l'intégralité des spécifications mathématiques, seuils et machines à états 
extraits de la formation HugoFX. Il est spécialement calibré pour être donné à un modèle de code 
(Claude 3.7 / GPT-4o / DeepSeek R1) pour générer l'Expert Advisor MQL5 ou le script Pine Script v6.

---

## 1. RÈGLES DE CODAGE STRICTES
1. **Zéro Lookahead** : Une bougie t n'est validée qu'à son 'close' confirmé. Aucune prise d'ordre sur bougie non clôturée.
2. **Double Machine à États** :
   - State Machine 1 : Détection & Vie de la POI (\`ZONE_FSM\`)
   - State Machine 2 : Exécution & Gestion de l'Ordre (\`TRADE_FSM\`)
3. **Seuils & Paramètres** : N'invente aucun chiffre. Utilise exclusivement les paramètres \`[P-xx]\` et \`[D-xx]\` définis ci-dessous.
4. **Filtres de Rejet** : Rejette le setup dès qu'une condition \`[REJ-xx]\` est vraie.

---

## 2. SPÉCIFICATION TECHNIQUE SCRIBE-ICT V4
${ficheText}

---

## 3. PROMPT DE GÉNÉRATION CODE POUR L'AGENT
\`\`\`markdown
Agis en tant que développeur quantitatif senior MQL5 et Pine Script.
En utilisant STRICTEMENT la fiche technique ci-dessus :
1. Crée la classe ou le module de détection autonome du setup '${target.name}'.
2. Implémente la fonction 'is_setup_valid()' vérifiant toutes les règles P-xx et REJ-xx.
3. Implémente la machine à état 'ZONE_FSM' et 'TRADE_FSM'.
4. Implémente la pose des ordres d'entrée, Stop Loss et Take Profit (RR >= 1:2.5).
5. Ne mets aucun placeholder ni TODO. Tout le code doit être fonctionnel.
\`\`\`
`;
  fs.writeFileSync(packPath, packContent, 'utf-8');
}

async function extractVideoWithRetry(vData) {
  const durationS = vData.duree_s || 0;
  const durM = Math.floor(durationS / 60);
  const durS = durationS % 60;
  const durFmt = `${durM.toString().padStart(2, '0')}:${durS.toString().padStart(2, '0')}`;

  const prompt = `${masterPrompt}

================================================================================
MÉTADONNÉES OFFICIELLES YOUTUBE DE CETTE VIDÉO (SOURCE DE VÉRITÉ OBLIGATOIRE) :
================================================================================
- ID_YOUTUBE : "${vData.video_id}"
- URL_YOUTUBE : "${vData.url}"
- TITRE_EXACT : "${vData.titre}"
- DATE_PUBLICATION_EXACTE : "${vData.date_video || '2024-01-01'}"
- DURÉE_TOTALE_EXACTE : ${durationS} secondes (${durFmt})
- TRANCHE_ANALYSÉE : "00:00 - ${durFmt} (Vidéo Intégrale 1/1)"
- PLAYLISTS : "CONCEPTS_SETUPS_PLAYBOOKS"
- FAMILLE_CURSUS : "FORMATION_HUGOFX_ELITE"
- DESCRIPTION_YOUTUBE_ORIGINALE_HUGOFX :
"""
${(vData.description || '').slice(0, 2500)}
"""

CONSIGNES STRICTES :
1. Analyse la vidéo dans son intégralité (de 00:00 à ${durFmt}).
2. Respecte rigoureusement la structure double-face SCRIBE-ICT v3 / v4 :
   - Frontmatter YAML complet
   - Section I : REGISTRE DE PREUVES HORODATÉ (Preuves Verbales [S-01 à S-15+], Preuves Visuelles [F-01 à F-08+], Registre Unique des Exemples [X-01 à X-04+] avec mesures chiffrées réelles)
   - Section II : TABLE UNIQUE DES PARAMÈTRES [P-xx] & DÉCISIONS DE DESIGN [D-xx]
   - Section III : SPÉCIFICATION FORMELLE AGENTIQUE (ZONE_FSM, TRADE_FSM, RÈGLES D'INVALIDATION [REJ-01 à REJ-06], FIXTURES SYNTHÉTIQUES OHLC JSON)
   - Section IV : LEÇON HUMAINE EXPERTE (8 sections complètes avec citation croisée obligatoire de chaque [P-xx], [D-xx], [R-xx] et [REJ-xx]).
3. AUCUN BARÈME INVENTÉ (jamais de "+40 pts").
4. Rédige en français d'élite, exhaustif, sans raccourci ni placeholder.
`;

  for (const model of MODELS) {
    for (let kIdx = 0; kIdx < API_KEYS.length; kIdx++) {
      const key = API_KEYS[kIdx];
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
      
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { fileData: { fileUri: vData.url, mimeType: 'video/*' } },
                { text: prompt }
              ]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 32768
            }
          })
        });

        if (resp.status === 200) {
          const data = await resp.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.length > 2000) {
            return { text, modelInfo: `${model} (Clé ${kIdx + 1})` };
          }
        } else if (resp.status === 503 || resp.status === 429) {
          // Pause and rotate to next key/model
          await new Promise(r => setTimeout(r, 4000));
        }
      } catch (err) {
        // Network or fetch error
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  return null;
}

async function run() {
  console.log('=== BATCH EXTRACTION ENGINE NODE (DOUBLE CLE + CASCADE 3.6/3.5) ===');
  const total = TARGET_VIDEOS.length;
  let done = 0;

  for (let i = 0; i < total; i++) {
    const target = TARGET_VIDEOS[i];
    const slug = `HugoFX_Fiche_${target.id}_${cleanSlug(target.name)}.md`;
    const ficheFile = path.join(FICHES_DIR, slug);
    const packFile = path.join(PACKS_DIR, `PACK_CODER_${target.id}_${cleanSlug(target.name)}.md`);

    console.log(`\n[${i + 1}/${total}] ${target.id} (${target.name}) - ${target.playbook}...`);

    if (fs.existsSync(ficheFile) && fs.statSync(ficheFile).size > 2000) {
      console.log(`  -> Fiche déjà prête (${fs.statSync(ficheFile).size} octets).`);
      if (!fs.existsSync(packFile) || fs.statSync(packFile).size < 1000) {
        generateCoderPack(ficheFile, packFile, target);
      }
      done++;
      continue;
    }

    const vData = catalog.get(target.id);
    if (!vData) {
      console.log(`  -> ERREUR: Vidéo non trouvée dans le catalogue.`);
      continue;
    }

    console.log(`  -> Analyse multimodale en cours via Gemini (${vData.url})...`);
    const t0 = Date.now();
    const result = await extractVideoWithRetry(vData);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

    if (result && result.text) {
      console.log(`  -> SUCCÈS en ${elapsed}s via ${result.modelInfo} (${result.text.length} caractères) !`);
      fs.writeFileSync(ficheFile, result.text, 'utf-8');
      generateCoderPack(ficheFile, packFile, target);
      done++;
    } else {
      console.log(`  -> ÉCHEC après rotation complète. Passage à la suivante.`);
    }

    // Petite pause de courtoisie de 3 secondes pour ne pas engorger l'API
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n=== BATCH TERMINÉ : ${done}/${total} VIDÉOS VALIDÉES ET SAUVEGARDÉES ===`);
  console.log(`Dossier Fiches Techniques : ${FICHES_DIR}`);
  console.log(`Dossier Packs Codage      : ${PACKS_DIR}`);
}

run();
