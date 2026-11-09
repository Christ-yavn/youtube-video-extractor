# Codebase Language State Verification & Bilingual i18n Scope Report
**YouTube Video Extractor v4.0 (`ITC-SMC-EXTRACTOR-`)**

- **Date**: 2026-11-09T13:15:00Z
- **Author**: Worker M1 (ECC Audit, Language Verification & Critical Remediation)
- **Target Repository**: `C:\Users\CHRIST\.gemini\antigravity\scratch\ITC-SMC-EXTRACTOR-`
- **Objective**: Empirical verification of codebase language status (R2) and structural specification of the bilingual i18n system (R3/R4)
- **Status**: Verified & Documented (Empirical Scan: 1,408 Lines Across 35 Files in `src/` Containing French Text)

---

## Executive Summary

The original task prompt required verifying whether the codebase is fully in English or exhibits mixed language usage. 

An exhaustive static and empirical analysis confirms that the project is **categorically NOT fully in English**. Instead, the application exists in an **intense, inconsistent hybrid bilingual state**. English and French are juxtaposed side-by-side within the same screens, flows, and components. For example, a user clicking an English sidebar link labeled `"Video Library"` lands on a page entitled `"Registre des 106 Leçons"` with 100% French table columns, filter dropdowns, and batch action buttons. Clicking `"Courses & Specs"` leads to `"Spécifications Formelles (SCRIBE-ICT v3)"`.

To resolve this cognitive dissonance and satisfy Requirements R2 and R3, this report documents the exact language distribution across all components, identifies UI chrome boundaries vs immutable domain data, and enumerates the complete translation dictionary across 12 UI domains for the upcoming bilingual switcher.

---

## 1. Global Empirical Codebase Evidence

### 1.1 Ripgrep / Git Grep Accent Scan Results
Scanning for French accented characters (`[éèêàùçôî]`) across the codebase yields:
- **`src/` directory**: **1,408 matching lines** across **35 distinct files**.
- **`server.ts`**: Multiple error messages, response bodies, and descriptions written in French.
- **`scripts/`**: 7 Python and Node automation scripts with French console logs, comments, and data paths.
- **`docs/`**: Architecture plans and asset descriptions in French (alongside bilingual README Section 11).

### 1.2 Exhaustive List of 35 Files in `src/` Containing French Text
1. `src/App.tsx` (Page titles, categories, action button labels, and 35+ toast notifications)
2. `src/components/AddFicheModal.tsx` (AI Studio manual import modal, 100% French)
3. `src/components/AgentExportModal.tsx` (Claude bridge compilation and fine-tuning exports)
4. `src/components/AutomatedQueueModal.tsx` (Batch extraction orchestrator modal, 100% French)
5. `src/components/ConfirmModal.tsx` (Deletion confirmation dialog, French defaults)
6. `src/components/Drawer.tsx` (Slide-over drawer controls and tooltips)
7. `src/components/FicheViewer.tsx` (Dual-face human/spec viewer, linter diagnostic, 100% French)
8. `src/components/GitHubSyncModal.tsx` (Repository push and synchronization dialog, 100% French)
9. `src/components/IctCandleChartSvg.tsx` (Interactive candlestick chart labels)
10. `src/components/SmartFicheRenderer.tsx` (Formatted markdown specification renderer)
11. `src/data/architectureData.ts` (ICT SMC architecture taxonomy definitions)
12. `src/data/fiches/dg2_OsUXN60_BPR.ts` (Benchmark reference fiche content)
13. `src/data/harvestedVideos.ts` (106 deduplicated YouTube lesson titles and descriptions)
14. `src/data/harvested_videos.json` (Catalog database file)
15. `src/data/sampleExtractedFiche.ts` (Sample extraction template)
16. `src/data/scribePromptV2.ts` (Deterministic extraction prompt with French directives)
17. `src/pages/Accueil.tsx` (Home compiler studio page with mixed English/French cards)
18. `src/pages/Concepts.tsx` (6 domain pillars with French titles and statuses)
19. `src/pages/Fiches.tsx` (100% French Bento KPI metrics, filter bars, and inspectors)
20. `src/pages/GoogleDrive.tsx` (100% French Cloud vault management and cleanup controls)
21. `src/pages/Reglages.tsx` (Mixed English BYOK settings and French algorithmic engine options)
22. `src/pages/Videos.tsx` (100% French 106-lesson registry table and filters)
23. `src/services/batchExtractionService.ts` (Automated extraction batch processor)
24. `src/services/conceptConsolidatorService.ts` (Chronological concept synthesis service)
25. `src/services/geminiExtractionService.ts` (Google GenAI API client and prompt builder)
26. `src/services/googleDriveService.ts` (Google Drive REST client and folder tree organizer)
27. `src/services/traceabilityRegistry.ts` (Lightweight TSV registry management service)
28. `src/utils/apiKeyManager.ts` (API key persistence manager)
29. `src/utils/domainProfiles.ts` (Universal multi-domain course compiler profiles)
30. `src/utils/driveHelpers.test.ts` (Drive helper unit tests)
31. `src/utils/driveHelpers.ts` (Drive file name sanitization and error parser)
32. `src/utils/ictTaxonomy.test.ts` (Taxonomy unit tests)
33. `src/utils/ictTaxonomy.ts` (Taxonomy mapping logic)
34. `src/utils/pipeline.test.ts` (Core pipeline unit tests)
35. `src/utils/pipeline.ts` (Deterministic linter and temporal slicing engine)

---

## 2. Systematic Structural Breakdown of Language Usage

### 2.1 The Navigation vs. Header Dissonance
The most glaring UX inconsistency occurs between the primary navigation bar and the page headers:

- **Sidebar (`src/components/Sidebar.tsx:40-47`)**: Nav items are hardcoded in **English**:
  - `"Compiler Studio"`
  - `"Video Library"`
  - `"Courses & Specs"`
  - `"Master Concepts"`
  - `"Cloud Backup"`
  - `"API Keys & Settings"`
- **App Header Props (`src/App.tsx:920-981`)**: The corresponding page headers passed into `Header.tsx` are hardcoded in **French**:
  - `videos`: `title: "Registre des 106 Leçons"`, `category: "Corpus YouTube"`, `action: { label: "Télécharger TSV" }`
  - `fiches`: `title: "Spécifications Formelles (SCRIBE-ICT v3)"`, `subtitle: "Double-Face : Leçon Humaine 8 Sections..."`, `category: "Atelier Quant"`, `action: { label: "Ajouter une fiche" }`
  - `concepts`: `title: "Taxonomie & Classification"`, `subtitle: "6 Piliers d'architecture..."`, `category: "Théorie Canonique"`
  - `drive`: `title: "Coffre Google Drive"`, `subtitle: "Sauvegarde Cloud permanente..."`, `action: { label: "Sauvegarder tout sur Drive" }`
  - `reglages`: `title: "Moteur & Réglages LLM"`, `subtitle: "Quotas AI Studio, règles de découpage..."`, `category: "Système"`

When navigating through the application, users experience an immediate language switch between the sidebar they clicked and the page they arrived on.

---

### 2.2 Component & Page Language Inventory

| Component / Page | Location | Observed Language State | Key Evidence & Line References |
|---|---|---|---|
| **Header** | `src/components/Header.tsx` | Pure English controls receiving French dynamic titles | L.58: `placeholder="Search videos or courses..."`<br/>L.80: `'Drive Synced'` / `'Local Mode'`<br/>L.93: `'GitHub'`<br/>L.103: `'Switch to Light Mode'` |
| **Sidebar** | `src/components/Sidebar.tsx` | Pure English | L.41–46: Navigation labels (`Compiler Studio`, `Video Library`, etc.)<br/>L.126: `'Validated Sheets'`<br/>L.141–142: `'Linter 10/10 Gate'`, `'38/38 Tests'`<br/>L.151–154: `'Appearance'`, `'Switch to Light'` / `'Switch to Dark'` |
| **Accueil Page** | `src/pages/Accueil.tsx` | Predominantly English with French domain/video data | L.223: `'YouTube Video Extractor v4.0'`<br/>L.234–240: Hero title & description in English<br/>L.246: `'1. Choose extraction domain profile'`<br/>L.296: `'Analyze & Compile'`<br/>L.402, 425, 448: Step cards (`8-Section Course Handbooks`, `10-Criteria Quality Linter`, `Datasets & Claude Code`)<br/>L.473, 483: `'legacy simulation entries'`, `'Clean Vault'`<br/>L.528, 532: `'Validated 10/10 Sheets'`, `'Queued in Benchmark'` |
| **Videos Page** | `src/pages/Videos.tsx` | **100% French** | L.137: `'Filtre Famille :'`<br/>L.150: `'Toutes les familles'`<br/>L.164–182: `'Tous'`, `'Prête'`, `'À faire'`<br/>L.193: `'Trier par ID'`<br/>L.203–226: `'sélectionnée(s)'`, `'sur ... affichées'`, `'Annuler & Supprimer de Drive'`, `'Désélectionner'`<br/>L.247–253: Table headers (`ID Vidéo`, `Titre de la Leçon`, `Tranches 35m`, `Statut Fiche`, `Action Rapide`)<br/>L.339, 363, 377, 386: `'10/10 Prête'`, `'À extraire'`, `'Voir Fiche'`, `'Extraire'` |
| **Fiches Page** | `src/pages/Fiches.tsx` | **100% French** | L.227, 245, 263, 281: Bento KPI cards (`Fiches Validées`, `Règles & Paramètres`, `Preuves vs Absents`, `Coffre Google Drive`)<br/>L.312, 331: `'Filtre Cursus:'`, `'Concept:'`<br/>L.358, 370, 382: Buttons (`Pont Claude Codeur`, `Consolidation par Concept`, `Dataset IA (.jsonl)`)<br/>L.397–407: `'Aucune fiche ne correspond à votre filtre'`, `'Charger la Fiche Étalon FVG'`<br/>L.439, 472, 478, 484, 490: `'10/10 Validée'`, `'atomiques'`, `'variables'`, `'étiquetées'`, `'décisions'`<br/>L.534, 547: `'Copier Spec Code'`, `'Ouvrir Studio'`<br/>L.566, 596, 623: Inspector (`Inspecteur de Modèle`, `'Règles Atomiques Détectées'`, `'À Extraire pour ce Pilier'`) |
| **Concepts Page** | `src/pages/Concepts.tsx` | Mixed English tabs & French benchmark pillars | L.150: `'Multi-Domain Curriculum Taxonomy & MASTER_<CONCEPT>.md Synthesis'`<br/>L.172–175: 4 Domain tabs in English (`1. Universal Courses`, `2. Software & AI`, etc.)<br/>L.71–138: 6 Benchmark #1 Pillars in French (`1. Structure de Marché`, `2. Liquidité & Chasse aux Stops`, `3. Zones de Prix`, `4. Temps & Macro`, `5. Modèles d'Exécution`, `6. Risque & Psychologie`)<br/>L.80, 91, 102, 135: Status badges (`'En cours'`, `'À consolider'`, `'À faire'`, `'MASTER.md Prêt'`, `'Prioritaire'`) |
| **Google Drive Page** | `src/pages/GoogleDrive.tsx` | **100% French** | L.342, 346: `'Coffre Google Drive & Registre de Traçabilité Léger'`, `'toujours connectée'`<br/>L.354, 359: `'Connecté en permanence'`, `'Non connecté'`<br/>L.370, 381: `'Dossier Cloud Dédié'`, `'Ouvrir dans Google Drive'`<br/>L.397, 416: `'fichiers erronés... détectés'`, `'Purger les ... fiches erronées'`<br/>L.430: `'Connectez Google Drive une seule fois'`<br/>L.450–520: Toolbar buttons (`Filtrer les fichiers du coffre...`, `'Classer dans l\'Arborescence ICT'`, `'Push GitHub'`, `'Actualiser'`, `'Exporter Registre TSV'`, `'Purger Drive & Zéro (0/106)'`, `'Déconnexion'`)<br/>L.574: `'Fichiers dans votre dossier Drive'`<br/>L.627, 631, 635: Badges (`Clone 197 lignes`, `BPR Étalon`, `SCRIBE-ICT v3`) |
| **Réglages Page** | `src/pages/Reglages.tsx` | Mixed English BYOK & French Engine settings | L.126–133: `'Panneau de Configuration & Sécurité'`, `'Paramètres du Moteur Algorithmique'`<br/>L.149, 152: `'Clé API Google AI Studio (Compte Pro)'`, `'Actif'`<br/>L.170, 178, 210, 229: `'Configuration persistante :'`, `'Clé API active :'`, `'Enregistrer'`/`'Enregistrée !'`, `'Tester'`/`'Test...'`<br/>L.268, 272: English BYOK (`'Anthropic Claude API Key & Self-Hosted Google Drive Connection'`, `'BYOK (Bring Your Own Keys)'`)<br/>L.301, 341: English (`'Save Key'`, `'Connect Drive'`)<br/>L.366, 369: `'Capacité & Cadence API Gemini'`, `'Mode Illimité (100% Capacité Clé)'`<br/>L.391–417: Maintenance (`'Actions d\'entretien :'`, `'Purger les fiches simulées'`, `'Réinitialiser à zéro (0/106)'`, `'Charger l\'étalon FVG'`)<br/>L.436, 458: `'Prompt Système Déterministe : SCRIBE-ICT v3'`, `'Copier le prompt SCRIBE-ICT v3'`<br/>L.476, 495: `'Export Registre Google Sheets (TSV)'`, `'Télécharger TSV Local'`<br/>L.512, 534: `'Zone de Maintenance & Remise à Zéro Complète'`, `'Réinitialiser Local à 0/106'` |
| **Add Fiche Modal** | `src/components/AddFicheModal.tsx` | **100% French** | L.53, 57: `'Enregistrer une Fiche d\'AI Studio'`, `'Collez le résultat généré par Gemini...'`<br/>L.30–34: Validation messages (`'Fiche complète et valide (Standard SCRIBE-ICT v3)'`, `'Sections manquantes : ...'`, `'Contenu vide ou incomplet'`)<br/>L.94, 99: `'Contenu Markdown de la Fiche :'`, placeholder text<br/>L.119, 129: `'Annuler'`, `'Enregistrer dans la Bibliothèque'` |
| **Automated Queue Modal** | `src/components/AutomatedQueueModal.tsx` | **100% French** | L.221, 230, 234: `'Moteur d\'Extraction Multimodal SCRIBE-ICT v3'`, `'En Pause'`/`'En Cours'`, `'Terminé'`<br/>L.257, 283, 293: `'Minimiser'`, `'API Gemini Illimitée...'`, `'Mode Illimité Actif'`<br/>L.301, 323, 325: `'1. Périmètre de Playlist :'`, `'Toutes'`, `'... à faire'`<br/>L.336: `'2. Modèle Multimodal Vidéo Officiel...'`<br/>L.428–435: `'3. Taille du Lot d\'Exécution :'`, `'5 vidéos'`, `'10 vidéos'`, `'25 vidéos'`, `'Tout le reste'`<br/>L.456, 471, 491: Options (`'3. Options & Sauvegarde :'`, `'Envoi direct du fichier Markdown sur Google Drive'`, `'Forcer la ré-extraction...'`)<br/>L.512–525: Telemetry (`'Progression du Lot :'`, `'Traitement en pause'`, `'Analyse Gemini en cours'`)<br/>L.559: `'Journal d\'Exécution en Direct (SCRIBE-ICT v3)'`<br/>L.603, 618, 629: Finished state (`'Lot Terminé avec Succès !'`, `'Configurer & Lancer un nouveau groupe de vidéos'`, `'Annuler ce lot...'`)<br/>L.648–735: Action buttons (`'Annuler'`, `'Démarrer l\'Extraction'`, `'🛑 Arrêter'`, `'⏭️ Passer cette vidéo'`, `'Reprendre'`, `'Mettre en Pause'`, `'Continuer en arrière-plan'`, `'Consulter les Fiches dans l\'Atelier'`) |
| **Confirm Modal** | `src/components/ConfirmModal.tsx` | French defaults | L.21–22: `confirmLabel = 'Confirmer'`, `cancelLabel = 'Annuler'`<br/>L.74: `'Cette opération supprimera le fichier distant de façon permanente.'` |
| **Drawer** | `src/components/Drawer.tsx` | French tooltips | L.68: `'Réduire la vue'` / `'Agrandir en Plein Écran / Split-View'`<br/>L.78: `'Fermer'` |
| **Fiche Viewer** | `src/components/FicheViewer.tsx` | **100% French** | L.91, 101, 114, 126: `'Conforme SCRIBE-ICT v3'`, `'Révision Requise'`, `'Sauvegarder Drive'`, `'Copié pour l\'Agent !'`<br/>L.150–202: 5 Tabs (`'📖 Vue Cours Humain (8 Sections)'`, `'🤖 Vue Spec & Algorithme 10/10'`, `'🛡️ Preuves & Linter Déterministe'`, `'⚡ Vue Split Côte-à-Côte'`, `'📄 Markdown Brut'`)<br/>L.247: `'Diagnostic du Linter Déterministe SCRIBE-ICT v3'`<br/>L.252–258: Counters (`Règles R-xx`, `Paramètres P-xx`, `Preuves`)<br/>L.265–270: 6 Check items (`'Ordre Causal I → II → III → IV → V'`, `'8 Sections Humaines Chirurgicales'`, `'Double FSM'`, `'Fixtures OHLC Exécutables (B6)'`, `'Zéro Barème Inventé'`, `'Couverture R-xx / P-xx ≥ 80%'`)<br/>L.295: `'Anomalies détectées par le Linter V3 :'`<br/>L.312: `'Replay Interactif des Fixtures OHLC (Section B6)'`<br/>L.333, 345: Columns (`'Leçon Humaine (8 Sections)'` / `'Pour le trader'`, `'Spécification Agentique 10/10'` / `'Pour le code'`)<br/>L.366, 372: `'Taille : ... caractères'`, `'Copier tout le document Markdown'` |
| **GitHub Sync Modal** | `src/components/GitHubSyncModal.tsx` | **100% French** | L.165, 173: `'Synchronisation & Push GitHub'`, `'Poussez l\'intégralité du code...'`<br/>L.194, 201: `'Branche active :'`, `'Dernier commit :'`<br/>L.212, 219: `'Personal Access Token (PAT GitHub) :'`, `'Créer un token GitHub (scope repo)'`<br/>L.245, 258: `'Nom du Repository GitHub :'`, `'Branche Cible :'`<br/>L.279: `'Exporter et committer les ... fiche(s) .md dans le sous-dossier /fiches'`<br/>L.306–361: Buttons (`'Voir le Repository sur GitHub'`, `'Commandes terminal manuelles...'`, `'Fermer'`, `'Pousser le projet complet sur GitHub'`) |
| **Agent Export Modal** | `src/components/AgentExportModal.tsx` | Predominantly English | L.170: `'UNIVERSAL COMPILER HUB : CLAUDE CODE BRIDGE • MASTER.md • .JSONL DATASET'`<br/>L.199–224: Tabs (`'1. Claude Code Compiler Bridge'`, `'2. Master Course Consolidation'`, `'3. AI Fine-Tuning Dataset'`)<br/>L.324–346: Buttons (`'Copy Claude Pack'`, `'Download .md'`, `'Compile via Claude Bridge'`) |
| **App.tsx Toasts** | `src/App.tsx` | **100% French** (35+ toasts) | L.79: `Modèle actif : ${model}`<br/>L.218, 223, 234: `Connexion à Google Drive en cours...`, `Session Google Drive renouvelée avec succès !`, `Échec du renouvellement : ${msg}`<br/>L.280: `Copié dans le presse-papier !`<br/>L.314: `Purge achevée : fiches simulées supprimées et registre mis à jour.`<br/>L.344: `Toutes les vidéos de ce périmètre sont déjà traitées !`<br/>L.498, 531: `Traitement terminé : ${processedCount} fiches réelles extraites !`, `Traitement par lot interrompu.`<br/>L.560, 578: `Lot annulé : ${toDelete.length} vidéo(s) remise(s) à faire.`, `${videoIds.length} vidéo(s) réinitialisée(s)...`<br/>L.605: `Dossier Google Drive entièrement purgé et registre remis à zéro (0 / 106) !`<br/>L.702, 724: `⚡ Fiche ${videoId} classée sur Google Drive...!`, `Fiche ${videoId} enregistrée avec succès !`<br/>L.731: `${Object.keys(imported).length} fiche(s) importée(s) dans votre bibliothèque !`<br/>L.772: `Fiche étalon FVG chargée dans votre bibliothèque !`<br/>L.779: `Veuillez d'abord vous connecter à Google Drive.`<br/>L.865: `${count} fiche(s) sauvegardée(s) et classée(s) sur Google Drive !`<br/>L.916: `Fichier TSV téléchargé avec succès !`<br/>L.1066: `Session Google Drive expirée (jeton OAuth 1h)...` |

---

## 3. Scope Boundary: UI Chrome vs. Immutable Domain Data

A critical principle for the internationalization system is cleanly distinguishing between **user-facing UI controls** and **immutable domain dataset strings**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Translation Scope Boundaries                        │
└────────────────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐       ┌──────────────────────────────────┐
│      TRANSLATABLE UI CHROME     │       │     IMMUTABLE DOMAIN DATA        │
│  - Navigation links & badges    │       │  - YouTube lesson titles (titre) │
│  - Page titles & subtitles      │       │  - YouTube video descriptions    │
│  - Table headers & status pills │       │  - Actual Markdown fiche bodies  │
│  - Buttons & action tooltips    │       │  - PineScript AST tokens / code  │
│  - Modal dialogs & tabs         │       │  - Gemini / Claude system prompt │
│  - Form input placeholders      │       │    deterministic contracts       │
│  - Dynamic toast notifications  │       │  - Harvested video durations/IDs │
└─────────────────────────────────┘       └──────────────────────────────────┘
```

- **Translating UI Chrome**: Translates all navigation, buttons, table headers, toasts, modal explanations, and status indicators.
- **Preserving Domain Data**: Retains raw YouTube video titles (e.g. `"FORMATION TRADING DÉBUTANT [LEÇON 1] : Les Bases"`) and generated specification markdown intact. Modifying domain video titles would invalidate YouTube URL matching and break test hashes.

---

## 4. Translation Scope: The 12 UI Domains

To ensure 100% dictionary coverage, the translation schema is decomposed into 12 structured domains:

1. **`common`**: General action verbs and states (`confirm`, `cancel`, `close`, `save`, `saved`, `copy`, `copied`, `delete`, `search`, `filter`, `refresh`, `download`, `reset`, `actions`, `status`, `error`, `warning`, `info`, `success`, `loading`, `all`, `minimize`).
2. **`nav`**: Primary navigation items in `Sidebar.tsx` (`compilerStudio`, `videoLibrary`, `coursesAndSpecs`, `masterConcepts`, `cloudBackup`, `apiSettings`, `sync`, `validatedSheets`, `linterGate`, `testCount`, `appearance`, `switchToLight`, `switchToDark`, `language`).
3. **`header`**: Header elements in `Header.tsx` (`searchPlaceholder`, `searchAria`, `driveConnected`, `driveDisconnected`, `driveConnectedTitle`, `driveDisconnectedTitle`, `githubTitle`, `themeToggleTitle`, `langToggleTitle`).
4. **`accueil`**: Home studio page in `Accueil.tsx` (`heroBadge`, `heroCompilerBadge`, `heroTitle`, `heroTitleAccent`, `heroSubtitle`, `step1Domain`, `urlPlaceholder`, `analyzeButton`, `tryExample`, `hideDetails`, `videoDetails`, `channelLabel`, `lectureTitleLabel`, `durationLabel`, `step1Title`, `step1Desc`, `step1Btn`, `step2Title`, `step2Desc`, `step2Btn`, `step3Title`, `step3Desc`, `step3Btn`, `benchmarkBadge`, `benchmarkTitle`, `benchmarkDesc`, `browseVideos`, `validatedSheets`, `queuedInBenchmark`, `openNextQueued`, `showMap`, `hideMap`, `clonesWarning`, `cleanVault`).
5. **`videos`**: Lesson library table and filters in `Videos.tsx` (`familyFilter`, `allFamilies`, `statusAll`, `statusReady`, `statusTodo`, `sortById`, `selectedCount`, `ofDisplayed`, `cancelAndRemoveDrive`, `cancelling`, `deselect`, `tableThId`, `tableThTitle`, `tableThPlaylist`, `tableThDuration`, `tableThSlices`, `tableThStatus`, `tableThAction`, `badgeReady`, `badgeClone`, `badgeError`, `badgeToExtract`, `viewFiche`, `extract`, `openInDrive`, `viewOnYoutube`, `slicesCount`, `slicesCountPlural`).
6. **`fiches`**: Quantitative workshop and KPI cards in `Fiches.tsx` (`kpiValidated`, `kpiValidatedSub`, `kpiRules`, `kpiRulesSub`, `kpiProofs`, `kpiProofsSub`, `kpiDrive`, `kpiDriveSynced`, `kpiDriveOffline`, `syncDrive`, `filterCurriculum`, `allCurriculums`, `conceptFilter`, `claudeBridge`, `consolidateConcepts`, `datasetExport`, `noFiches`, `noFichesSub`, `loadDemoFiche`, `atomicRules`, `variableParams`, `labeledProofs`, `absentDecisions`, `charCount`, `copySpecCode`, `copied`, `openStudio`, `modelInspector`, `detectedRules`, `deterministic`, `toExtractForPillar`, `viewRegistry`).
7. **`concepts`**: Canonical taxonomy and synthesis in `Concepts.tsx` (`taxonomyTitle`, `validatedSpecsBadge`, `pillarLabel`, `pillarDesc`, `benchmarkCoverage`, `subConcepts`, `statusInProgress`, `statusToConsolidate`, `statusTodo`, `statusMasterReady`, `statusPriority`).
8. **`drive`**: Cloud vault page in `GoogleDrive.tsx` (`driveTitle`, `driveSubtitle`, `statusConnected`, `statusDisconnected`, `dedicatedFolder`, `openDriveFolder`, `clonesDetectedTitle`, `clonesActionRequired`, `clonesDesc`, `purgeClonesBtn`, `connectDriveTitle`, `connectDriveDesc`, `searchFilter`, `reorganizeTree`, `reorganizing`, `pushGithub`, `refresh`, `exportTsv`, `purgeDriveZero`, `disconnect`, `filesInDrive`, `erroneousCount`, `authenticCount`, `loadingFiles`, `noFiles`, `noFilesSub`, `sizeLabel`, `modifiedLabel`, `previewTooltip`, `deleteTooltip`).
9. **`reglages`**: Configuration and settings page in `Reglages.tsx` (`headerTag`, `headerTitle`, `headerDesc`, `geminiKeySection`, `active`, `persistentConfig`, `persistentConfigDesc`, `activeApiKey`, `defaultEnvKey`, `refKey`, `geminiPlaceholder`, `save`, `saved`, `testKey`, `testingKey`, `anthropicSection`, `byok`, `anthropicDesc`, `anthropicKeyLabel`, `anthropicKeyPlaceholder`, `anthropicKeyDesc`, `driveTokenLabel`, `driveTokenPlaceholder`, `driveTokenDesc`, `connectDrive`, `unlimitedModeTitle`, `unlimitedModeBadge`, `unlimitedModeSub`, `unlimitedMaxUnlocked`, `maintenanceActions`, `purgeSimulatedFiches`, `resetZero`, `loadFvgSample`, `scribePromptTitle`, `scribePromptBadge`, `copyScribePrompt`, `exportTsvTitle`, `exportTsvSub`, `exportTsvMaster`, `exportTsvBtn`, `maintenanceZoneTitle`, `maintenanceZoneSub`, `resetLocalBtn`).
10. **`modals`**: Dialog overlays across the application (`addFicheTitle`, `addFicheSub`, `addFicheContentLabel`, `addFichePlaceholder`, `addFicheSaveBtn`, `queueTitle`, `queueSub`, `queueScopeLabel`, `queueModelLabel`, `queueBatchLabel`, `queueOptionsLabel`, `queueDirectUpload`, `queueForceReExtract`, `queueStartBtn`, `queueStopBtn`, `queueSkipBtn`, `queuePauseBtn`, `queueResumeBtn`, `queueBackgroundBtn`, `queueFinishedTitle`, `queueNewBatchBtn`, `queueRollbackBtn`, `queueViewInStudioBtn`, `confirmDefaultTitle`, `confirmDefaultCancel`, `confirmDefaultConfirm`, `confirmPermanentDeleteWarning`, `githubSyncTitle`, `githubSyncSub`, `githubPushBtn`, `githubPushing`).
11. **`toasts`**: Dynamic notification alerts in `App.tsx` (`modelActive`, `driveConnecting`, `driveConnected`, `driveRenewFailed`, `copiedToClipboard`, `purgeClonesDone`, `allVideosProcessed`, `batchCompleted`, `batchInterrupted`, `batchCancelled`, `videosReset`, `vaultPurged`, `registryReset`, `sheetSavedOnDrive`, `sheetSavedLocal`, `sheetsImported`, `fvgSampleLoaded`, `pleaseConnectDrive`, `sheetNotFound`, `tsvDownloaded`, `driveExpiredBanner`, `renewDriveBtn`).
12. **`viewer`**: Fiche Viewer split and linter tabs in `FicheViewer.tsx` (`tabHuman`, `tabAgent`, `tabLinter`, `tabSplit`, `tabRaw`, `compliantBadge`, `revisionRequiredBadge`, `saveDrive`, `copyForClaude`, `copiedForAgent`, `linterAuditTitle`, `humanColTitle`, `humanColSub`, `agentColTitle`, `agentColSub`, `copyFullMarkdown`).

---

## 5. Technical Architecture Recommendation for Milestone 2

### 5.1 Zero-External-Dependency Architecture
To maintain zero additional runtime dependencies and safeguard the ultra-fast execution of `node --experimental-strip-types --test`:
- Build a lightweight native React Context: `src/context/LanguageContext.tsx`.
- Structure dictionaries: `src/i18n/en.ts` and `src/i18n/fr.ts` unified through `src/i18n/index.ts`.
- Expose a strongly typed hook `useLanguage()` providing:
  - `language`: `'fr' | 'en'`
  - `setLanguage(lang)`
  - `toggleLanguage()`
  - `isFrench`, `isEnglish`
  - `t(path, params)`: Supports key paths (e.g. `'videos.badgeReady'`) and variable interpolation (e.g. `{count}`).

### 5.2 Persistence & Layout Stability
- Store preference under `localStorage.getItem('yt_extractor_language_v4')`.
- Default to `'fr'` (to seamlessly maintain familiar behavior for current users while providing 1-click EN toggle).
- Synchronize with `document.documentElement.lang = language`.
- Header placement: Add an elegant, compact `FR | EN` segmented button in `Header.tsx` directly adjacent to the theme toggle button. Fixed height (`h-9`) and uniform 2-character widths guarantee zero layout shift, visual jitter, or wrapping artifacts.

---

## 6. Independent Verification Commands

To independently verify the linguistic evidence reported here:

```powershell
# 1. Count lines with French accented characters in src/
cd "C:\Users\CHRIST\.gemini\antigravity\scratch\ITC-SMC-EXTRACTOR-"
git grep -E -n "[éèêàùçôî]" src/ | Measure-Object -Line
# Verified result: 1,408 lines

# 2. Count distinct files with French text in src/
git grep -E -l "[éèêàùçôî]" src/ | Measure-Object -Line
# Verified result: 35 files

# 3. Check French lines in scripts and server.ts
git grep -E -l "[éèêàùçôî]" server.ts scripts/
```
