/**
 * Phase 3 — Consolidation Chronologique par Concept & Génération du Dataset d'Entraînement (.jsonl)
 * L'unité de valeur est LE CONCEPT (et non la vidéo isolée) :
 * - Regroupe toutes les fiches qui traitent d'un même concept (principal ou secondaire).
 * - Trie les apports par vraie date de publication YouTube (date_video vérifiée).
 * - Produit la Bible Consolidée MASTER_<CONCEPT>.md et le Dataset Fine-Tuning JSONL.
 */

import { HARVESTED_VIDEOS } from '../data/harvestedVideos.ts';
import { deduplicateVideos, lintFicheV3 } from '../utils/pipeline.ts';

export interface ConceptSourceContribution {
  videoId: string;
  titre: string;
  dateVideo: string;
  dureeS: number;
  famille: string;
  playlists: string[];
  modelUsed: string;
  score: number;
  isPrimary: boolean;
  verbalProofs: string[];
  visualProofs: string[];
  examples: string[];
  parameters: string[];
  decisions: string[];
  rules: string[];
  humanLessonExcerpt: string;
  specBlock: string;
  rawContent: string;
}

export interface ConsolidatedConceptMaster {
  conceptId: string;
  conceptLabel: string;
  pilier: string;
  sourcesCount: number;
  earliestDate: string;
  latestDate: string;
  contributions: ConceptSourceContribution[];
  masterMarkdown: string;
}

export interface TrainingJsonlRecord {
  id: string;
  category: 'APPRENDRE_CONCEPT' | 'AUDIT_SETUP_ET_PIEGE' | 'CODER_ALGORITHME_HUGOFX';
  concept: string;
  source_videos: string[];
  date_reference: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export const CANONICAL_CONCEPTS_META: Record<string, { label: string; pilier: string; aliases: string[] }> = {
  FVG: { label: 'Fair Value Gap (FVG / BISI / SIBI)', pilier: 'ZONES_PD_ARRAYS', aliases: ['FVG', 'FAIR VALUE GAP', 'IMBALANCE', 'BISI', 'SIBI'] },
  IFVG: { label: 'Inversion Fair Value Gap (iFVG)', pilier: 'ZONES_PD_ARRAYS', aliases: ['IFVG', 'INVERSION FVG'] },
  BPR: { label: 'Balanced Price Range (BPR)', pilier: 'ZONES_PD_ARRAYS', aliases: ['BPR', 'BALANCED PRICE RANGE'] },
  OB: { label: 'Order Block (OB Institutionnel)', pilier: 'ZONES_PD_ARRAYS', aliases: ['OB', 'ORDER BLOCK', 'ORDERBLOCK'] },
  BREAKER: { label: 'Breaker Block & Mitigation Block', pilier: 'ZONES_PD_ARRAYS', aliases: ['BREAKER', 'MITIGATION'] },
  OTE: { label: 'Optimal Trade Entry (OTE Fibonacci)', pilier: 'ZONES_PD_ARRAYS', aliases: ['OTE', 'OPTIMAL TRADE ENTRY', '0.705', '0.62', '0.79'] },
  PREMIUM_DISCOUNT: { label: 'Premium / Discount & Equilibrium (50%)', pilier: 'ZONES_PD_ARRAYS', aliases: ['PREMIUM', 'DISCOUNT', 'EQUILIBRIUM', 'DEALING RANGE'] },
  SWING: { label: 'Structure de Marché (Swing High/Low, BOS, CHoCH, MSS)', pilier: 'STRUCTURE', aliases: ['SWING', 'BOS', 'CHOCH', 'MSS', 'MARKET STRUCTURE'] },
  LIQUIDITY: { label: 'Liquidité (BSL, SSL, EQH/EQL, Inducement, Sweep)', pilier: 'LIQUIDITE', aliases: ['LIQUIDITE', 'LIQUIDITY', 'BSL', 'SSL', 'EQH', 'EQL', 'SWEEP', 'INDUCEMENT'] },
  KILLZONES: { label: 'Temps, Sessions, Killzones & PO3 (AMD)', pilier: 'TEMPS', aliases: ['KILLZONE', 'KILLZONES', 'LONDON', 'NEW YORK', 'ASIA', 'AMD', 'PO3', 'POWER OF 3'] },
  SILVER_BULLET: { label: 'Setup Silver Bullet & Modèles d’Entrée ICT', pilier: 'SETUPS', aliases: ['SILVER BULLET', 'SILVER_BULLET', 'JUDAS SWING', 'MODELE 2022'] },
  EXECUTION_RISQUE: { label: 'Exécution, Stop Loss, Take Profit & Risque', pilier: 'EXECUTION_RISQUE', aliases: ['STOP LOSS', 'TAKE PROFIT', 'BREAKEVEN', 'RISK', 'RR'] },
};

function extractTableRows(sectionText: string): string[] {
  return sectionText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('|') && !l.includes('---|') && !l.toLowerCase().includes('| id |'));
}

function extractSliceBetween(content: string, startRegex: RegExp, endRegex?: RegExp): string {
  const startMatch = content.match(startRegex);
  if (!startMatch || startMatch.index === undefined) return '';
  const fromStart = content.slice(startMatch.index);
  if (!endRegex) return fromStart;
  const endMatch = fromStart.slice(startMatch[0].length).match(endRegex);
  if (!endMatch || endMatch.index === undefined) return fromStart;
  return fromStart.slice(0, startMatch[0].length + endMatch.index);
}

/**
 * Détecte tous les concepts canoniques enseignés dans une fiche (YAML + corps).
 */
export function detectConceptsInFiche(content: string, videoTitle = ''): { primary: string; all: string[] } {
  const found = new Set<string>();
  const upperTitle = videoTitle.toUpperCase();
  const yamlBlock = content.startsWith('---') ? content.slice(0, content.indexOf('\n---', 3) + 4) : '';
  const combinedHeader = `${yamlBlock}\n${upperTitle}`.toUpperCase();

  let primary = '';

  for (const [conceptId, meta] of Object.entries(CANONICAL_CONCEPTS_META)) {
    for (const alias of meta.aliases) {
      if (combinedHeader.includes(alias)) {
        found.add(conceptId);
        if (!primary) primary = conceptId;
      }
    }
  }

  // Scan body for strongly taught concepts (mentioned >= 2 times)
  const upperBody = content.toUpperCase();
  for (const [conceptId, meta] of Object.entries(CANONICAL_CONCEPTS_META)) {
    for (const alias of meta.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = upperBody.match(new RegExp(`\\b${escaped}\\b`, 'g'));
      if (matches && matches.length >= 2) {
        found.add(conceptId);
        if (!primary) primary = conceptId;
      }
    }
  }

  if (!primary) {
    primary = 'SWING';
    found.add('SWING');
  }

  return { primary, all: Array.from(found) };
}

/**
 * Construit les Bibles Consolidées MASTER_<CONCEPT>.md à partir de toutes les fiches extraites.
 */
export function buildConsolidatedConcepts(fichesMap: Record<string, string>): ConsolidatedConceptMaster[] {
  const catalogDedup = deduplicateVideos(HARVESTED_VIDEOS as any);
  const videoLookup = new Map(catalogDedup.map(v => [v.video_id, v]));

  const byConcept = new Map<string, ConceptSourceContribution[]>();

  for (const [rawKey, content] of Object.entries(fichesMap)) {
    if (!content || content.trim().length < 200) continue;

    // Extract video_id from YAML or key
    const vidMatch = content.match(/video_id:\s*["']?([a-zA-Z0-9_-]{11})["']?/);
    const videoId = vidMatch ? vidMatch[1] : rawKey.replace(/^FICHE-ICT-/, '');
    const catVideo = videoLookup.get(videoId);

    const titreMatch = content.match(/titre(?:_video)?:\s*["']?([^"'\n]+)["']?/);
    const titre = catVideo?.titre || (titreMatch ? titreMatch[1].trim() : videoId);

    // Always prefer real verified catalog date over old "2024-01-01" or "A_VERIFIER_REGISTRE"
    const yamlDateMatch = content.match(/date_video:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
    const dateVideo =
      catVideo?.date_video && catVideo.date_video !== '2024-01-01'
        ? catVideo.date_video
        : yamlDateMatch
          ? yamlDateMatch[1]
          : '2024-01-01';

    const dureeS = catVideo?.duree_s || 1200;
    const famille = catVideo?.famille || 'CONCEPTS_SETUPS';
    const playlists = catVideo?.playlists || ['P1'];

    const lint = lintFicheV3(content);
    const { primary, all } = detectConceptsInFiche(content, titre);

    const sec1 = extractSliceBetween(content, /## I\.\s+REGISTRE DE PREUVES/i, /## II\.\s+TABLE UNIQUE/i);
    const sec2 = extractSliceBetween(content, /## II\.\s+TABLE UNIQUE/i, /<<<CONCEPT_SPEC_V3|## III\./i);
    const sec3 = extractSliceBetween(content, /<<<CONCEPT_SPEC_V3/i, /<<<FIN_CONCEPT_SPEC_V3>>>/i);
    const sec4 = extractSliceBetween(content, /## IV\.\s+LEÇON HUMAINE/i, /## V\.|<<<FIN_FICHE_V3>>>/i);

    const sBlock = extractSliceBetween(sec1, /### 1\./i, /### 2\./i);
    const fBlock = extractSliceBetween(sec1, /### 2\./i, /### 3\./i);
    const xBlock = extractSliceBetween(sec1, /### 3\./i);
    const pBlock = extractSliceBetween(sec2, /### 1\./i, /### 2\./i);
    const dBlock = extractSliceBetween(sec2, /### 2\./i);
    const rBlock = extractSliceBetween(sec3, /### B3\.|### B2\.\s+Règles/i, /### B4\.|### B3\.\s+Double/i);

    for (const conceptId of all) {
      const contribution: ConceptSourceContribution = {
        videoId,
        titre,
        dateVideo,
        dureeS,
        famille,
        playlists,
        modelUsed: lint.densityMetrics.modelUsed,
        score: lint.computedScore,
        isPrimary: conceptId === primary,
        verbalProofs: extractTableRows(sBlock),
        visualProofs: extractTableRows(fBlock),
        examples: extractTableRows(xBlock),
        parameters: extractTableRows(pBlock),
        decisions: extractTableRows(dBlock),
        rules: extractTableRows(rBlock),
        humanLessonExcerpt: sec4.trim(),
        specBlock: sec3.trim(),
        rawContent: content,
      };

      const list = byConcept.get(conceptId) || [];
      list.push(contribution);
      byConcept.set(conceptId, list);
    }
  }

  const masters: ConsolidatedConceptMaster[] = [];

  for (const [conceptId, contributions] of byConcept.entries()) {
    // Tri chronologique strict par date de publication vérifiée
    contributions.sort((a, b) => a.dateVideo.localeCompare(b.dateVideo));
    const meta = CANONICAL_CONCEPTS_META[conceptId] || {
      label: conceptId,
      pilier: 'ZONES_PD_ARRAYS',
      aliases: [conceptId],
    };

    const earliestDate = contributions[0]?.dateVideo || 'N/A';
    const latestDate = contributions[contributions.length - 1]?.dateVideo || 'N/A';

    const timelineRows = contributions
      .map(
        (c, idx) =>
          `| ${idx + 1} | \`${c.dateVideo}\` | **${c.titre}** (\`${c.videoId}\`) | \`${c.famille}\` (${c.playlists.join(',')}) | ${
            c.isPrimary ? '🎯 Concept Principal' : '🔗 Confluence / Multi-concept'
          } | \`${c.score}/10\` |`
      )
      .join('\n');

    const consolidatedS = contributions
      .flatMap(c => c.verbalProofs.map(row => `| \`${c.videoId}\` (\`${c.dateVideo}\`) ${row}`))
      .join('\n');

    const consolidatedX = contributions
      .flatMap(c => c.examples.map(row => `| \`${c.videoId}\` (\`${c.dateVideo}\`) ${row}`))
      .join('\n');

    const consolidatedP = contributions
      .flatMap(c => c.parameters.map(row => `| \`${c.videoId}\` ${row}`))
      .join('\n');

    const consolidatedD = contributions
      .flatMap(c => c.decisions.map(row => `| \`${c.videoId}\` ${row}`))
      .join('\n');

    const consolidatedR = contributions
      .flatMap(c => c.rules.map(row => `| \`${c.videoId}\` ${row}`))
      .join('\n');

    const masterMarkdown = `---
schema_version: "SCRIBE-ICT-MASTER-CONCEPT-v4.0"
concept_id: "${conceptId}"
concept_label: "${meta.label}"
pilier_canonique: "${meta.pilier}"
sources_videos_count: ${contributions.length}
periode_couverte: "${earliestDate} -> ${latestDate}"
videos_sources: [${contributions.map(c => `"${c.videoId}"`).join(', ')}]
---

# 🏛️ BIBLE CONSOLIDÉE DU CONCEPT : ${meta.label} (\`MASTER_${conceptId}\`)

> **Unité de valeur = LE CONCEPT (§2)** : Ce document fusionne par ordre chronologique de publication vérifiée les enseignements, critères visuels, seuils paramétriques, exemples graphiques et décisions de design d'HugoFX sur **${meta.label}** à travers **${contributions.length} vidéo(s)**.

---

## I. CHRONOLOGIE & ÉVOLUTION DU FORMATEUR SUR CE CONCEPT

| Ordre | Date de Publication | Vidéo Source | Famille & Playlist | Rôle dans la vidéo | Score Qualité |
|---|---|---|---|---|---|
${timelineRows}

---

## II. REGISTRE CONSOLIDÉ DES PREUVES VERBALES D'HUGOFX (\`S-xx\`)

| Source (\`Video\` & \`Date\`) | ID | Repère | Citation exacte | Nature |
|---|---|---|---|---|
${consolidatedS || '| — | — | — | Aucune citation extraite | — |'}

---

## III. REGISTRE CONSOLIDÉ DES EXEMPLES GRAPHIQUES & DIVERGENCES \`DIT ≠ FAIT\` (\`X-xx\`)

| Source (\`Video\` & \`Date\`) | ID | Type | Actif & UT | Session | Mesures observées | Déroulé & Résultat |
|---|---|---|---|---|---|---|
${consolidatedX || '| — | — | — | — | — | Aucun exemple mesuré | — |'}

---

## IV. TABLE UNIFIÉE DES PARAMÈTRES (\`P-xx\`) & DÉCISIONS DE DESIGN (\`D-xx\`)

### 1. Paramètres Algorithmiques Consolidés
| Source | ID | Nom technique | Unité | Défaut | Plage | Mesures | Preuve | Statut |
|---|---|---|---|---|---|---|---|---|
${consolidatedP || '| — | — | — | — | — | — | — | — | — |'}

### 2. Décisions de Design Consolidées (Zones Grises Tranchées)
| Source | ID | Point non tranché | Pourquoi c'est bloquant | Options | Défaut recommandé | Justification |
|---|---|---|---|---|---|---|
${consolidatedD || '| — | — | — | — | — | — | — |'}

---

## V. RÈGLES ATOMIQUES DE DÉTECTION & EXÉCUTION CONSOLIDÉES (\`R-xx\`)

| Source | ID | Condition Formelle (OHLC + Paramètres) | Conséquence (THEN / ELSE) | Preuve & Confiance |
|---|---|---|---|---|
${consolidatedR || '| — | — | — | — | — |'}

---

## VI. SPÉCIFICATIONS AGENTIQUES DE RÉFÉRENCE (\`<<<CONCEPT_SPEC_V3>>>\`)

${contributions
  .map(
    c => `### Spécification issue de \`${c.videoId}\` (${c.dateVideo} — ${c.titre})\n\n\`\`\`markdown\n${c.specBlock}\n\`\`\``
  )
  .join('\n\n')}

---

## VII. COURS MAGISTRAL CONSOLIDÉ (SYNTHÈSE CHRONOLOGIQUE DES LEÇONS HUMAINES)

${contributions
  .map(
    c => `### 📖 Apport du ${c.dateVideo} — ${c.titre} (\`${c.videoId}\`)\n\n${c.humanLessonExcerpt}`
  )
  .join('\n\n---\n\n')}

<<<FIN_MASTER_CONCEPT_${conceptId}>>>
`;

    masters.push({
      conceptId,
      conceptLabel: meta.label,
      pilier: meta.pilier,
      sourcesCount: contributions.length,
      earliestDate,
      latestDate,
      contributions,
      masterMarkdown,
    });
  }

  return masters.sort((a, b) => b.sourcesCount - a.sourcesCount || a.conceptId.localeCompare(b.conceptId));
}

/**
 * Génère le Dataset d'Entraînement IA (.jsonl) pour les 3 usages finaux (Apprendre, Auditer, Coder).
 */
export function generateTrainingDatasetJsonl(fichesMap: Record<string, string>): {
  records: TrainingJsonlRecord[];
  jsonlContent: string;
} {
  const masters = buildConsolidatedConcepts(fichesMap);
  const records: TrainingJsonlRecord[] = [];

  const systemPrompt =
    "Tu es un expert quantitatif et formateur ICT/SMC formé exclusivement sur le corpus vérifié d'HugoFX. " +
    "Tu appliques strictement ses définitions géométriques OHLC, ses filtres de liquidité (Sweep préalable, Premium/Discount, OTE, Killzones), " +
    "et tu signales explicitement toute zone grise [ABSENT] par une Décision de Design [D-xx] sans jamais inventer de règles génériques.";

  for (const master of masters) {
    const sourceIds = master.contributions.map(c => c.videoId);
    const primaryContrib = master.contributions.find(c => c.isPrimary) || master.contributions[0];
    if (!primaryContrib) continue;

    // 1. Record APPRENDRE_CONCEPT
    records.push({
      id: `train_${master.conceptId.toLowerCase()}_learn`,
      category: 'APPRENDRE_CONCEPT',
      concept: master.conceptId,
      source_videos: sourceIds,
      date_reference: master.latestDate,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Explique en détail le concept "${master.conceptLabel}" tel qu'enseigné par HugoFX : définition, détection pas à pas sur le graphique, critères qui distinguent un bon setup d'un mauvais, confluences requises et erreurs fatales à éviter.`,
        },
        {
          role: 'assistant',
          content: primaryContrib.humanLessonExcerpt || master.masterMarkdown,
        },
      ],
    });

    // 2. Record AUDIT_SETUP_ET_PIEGE
    records.push({
      id: `train_${master.conceptId.toLowerCase()}_audit`,
      category: 'AUDIT_SETUP_ET_PIEGE',
      concept: master.conceptId,
      source_videos: sourceIds,
      date_reference: master.latestDate,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Quelles sont les preuves exactes (citations verbales S-xx, observations visuelles F-xx, exemples mesurés X-xx) et les divergences éventuelles DIT ≠ FAIT d'HugoFX sur ${master.conceptLabel} ?`,
        },
        {
          role: 'assistant',
          content: [
            `### Preuves Verbales Consolidées (${master.conceptId})`,
            ...primaryContrib.verbalProofs,
            `\n### Exemples Graphiques & Divergences DIT ≠ FAIT`,
            ...primaryContrib.examples,
          ].join('\n'),
        },
      ],
    });

    // 3. Record CODER_ALGORITHME_HUGOFX
    if (primaryContrib.specBlock) {
      records.push({
        id: `train_${master.conceptId.toLowerCase()}_code`,
        category: 'CODER_ALGORITHME_HUGOFX',
        concept: master.conceptId,
        source_videos: sourceIds,
        date_reference: master.latestDate,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Fournis la spécification algorithmique complète 10/10 (Paramètres P-xx, Décisions D-xx, Règles atomiques R-xx, Double Machine à États ZONE_FSM & TRADE_FSM et Fixtures OHLC) pour coder ${master.conceptLabel} fidèlement à HugoFX sans aucun lookahead.`,
          },
          {
            role: 'assistant',
            content: primaryContrib.specBlock,
          },
        ],
      });
    }
  }

  const jsonlContent = records.map(r => JSON.stringify(r)).join('\n');
  return { records, jsonlContent };
}
