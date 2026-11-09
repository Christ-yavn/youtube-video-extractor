/**
 * French Dictionary (fr.ts)
 * Comprehensive 12-domain UI translations for YouTube Video Extractor v4.0.0
 * 100% key parity with en.ts
 */

export const fr = {
  common: {
    save: 'Enregistrer',
    saved: 'Enregistré !',
    cancel: 'Annuler',
    close: 'Fermer',
    search: 'Rechercher',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Information',
    refresh: 'Actualiser',
    download: 'Télécharger',
    copy: 'Copier',
    copied: 'Copié !',
    retry: 'Réessayer',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    back: 'Retour',
    next: 'Suivant',
    actions: 'Actions',
    status: 'Statut',
    all: 'Tous',
    filter: 'Filtrer',
    reset: 'Réinitialiser',
    minimize: 'Minimiser',
  },

  nav: {
    compilerStudio: 'Studio Compilateur',
    videoLibrary: 'Bibliothèque Vidéos',
    coursesSpecs: 'Cours & Spécifications',
    masterConcepts: 'Concepts Maîtres',
    cloudBackup: 'Coffre Cloud',
    apiSettings: 'Clés API & Réglages',
    validatedSheets: 'Fiches Validées',
    appearance: 'Apparence',
    switchToLight: 'Passer en mode Clair',
    switchToDark: 'Passer en mode Sombre',
    sync: 'Synchro',
    linterGate: 'Contrôle Linter 10/10',
    testCount: '38/38 Tests',
    language: 'Langue',
  },

  header: {
    searchPlaceholder: 'Rechercher vidéos ou cours...',
    searchAria: 'Rechercher vidéos et cours',
    ctrlK: 'Ctrl+K',
    localMode: 'Mode Local',
    driveSynced: 'Drive Synchronisé',
    driveConnected: 'Connecté ({email})',
    driveDisconnected: 'Sauvegarde Google Drive personnelle',
    gitHubSync: 'Synchronisation GitHub',
    githubTitle: 'Dépôt GitHub',
    switchLanguage: 'Passer en Anglais',
    themeToggleTitle: 'Basculer mode Clair ou Sombre',
    langToggleTitle: 'Passer en Anglais / Switch to English',
  },

  accueil: {
    heroBadge: 'YouTube Video Extractor v4.0',
    heroCompilerBadge: 'Compilateur Anthropic Claude Code',
    heroTitle: 'Transformez n\'importe quelle vidéo YouTube en',
    heroTitleAccent: 'cours structurés & code exécutable',
    heroSubtitle: 'Collez un lien YouTube ci-dessous. Les vidéos longues sont automatiquement découpées en tranches de 35 minutes, vérifiées par notre linter à 10 critères et compilées en manuels de cours, datasets .jsonl ou modules Python et TypeScript exécutables.',
    quickStats: 'Statistiques Rapides',
    recentExtracts: 'Extractions Récentes',
    startBatch: 'Démarrer Mode Automatique',
    viewLibrary: 'Voir la Bibliothèque',
    architectureTitle: 'Architecture & Pipeline Multimodal',
    step1Domain: '1. Choisir le profil de domaine d\'extraction',
    urlPlaceholder: 'Collez une URL YouTube (ex. https://www.youtube.com/watch?v=...)',
    analyzeButton: 'Analyser & Compiler ({count} × 35m)',
    tryExample: 'Essayer un exemple :',
    hideDetails: 'Masquer les détails',
    videoDetails: 'Détails vidéo ({min} min)',
    channelLabel: 'Chaîne ou Université',
    lectureTitleLabel: 'Titre du cours ou de la vidéo',
    durationLabel: 'Durée (min)',
    step1Title: '1. Manuels de Cours en 8 Sections',
    step1Desc: 'Construit un guide d\'étude structuré pour chaque vidéo avec horodatages [MM:SS] exacts, explications visuelles, exemples détaillés et fiches mémo.',
    step1Btn: 'Consulter les Fiches de Cours',
    step2Title: '2. Linter de Qualité à 10 Critères',
    step2Desc: 'Vérifie automatiquement chaque fiche extraite selon 10 critères stricts, rejetant les approximations et validant paramètres, règles et machines à états.',
    step2Btn: 'Inspecter la Fiche Étalon 10/10',
    step3Title: '3. Datasets IA & Claude Code',
    step3Desc: 'Fusionne les playlists en chapitres MASTER_<CONCEPT>.md, exporte des datasets .jsonl et compile les spécifications en Python ou TypeScript via Claude.',
    step3Btn: 'Ouvrir le Compilateur Claude Code',
    benchmarkBadge: 'Test de Charge Inclus — Benchmark #1',
    benchmarkTitle: 'Corpus de Test Réel : {total} Vidéos Techniques YouTube',
    benchmarkDesc: 'Ce dépôt comprend un corpus complet de 106 vidéos techniques (HugoFX) utilisé comme premier test de charge pour le découpage en tranches de 35 minutes, le dédoublonnage multi-playlists et la validation 10/10.',
    browseVideos: 'Parcourir les {total} Vidéos',
    validatedSheets: 'Fiches Validées 10/10 :',
    queuedInBenchmark: 'En attente dans le Benchmark :',
    openNextQueued: 'Ouvrir la prochaine vidéo en attente',
    showMap: 'Afficher la carte des 106 vidéos',
    hideMap: 'Masquer la carte des 106 vidéos',
    clonesWarning: '{count} entrées de simulation obsolètes détectées dans le coffre Cloud.',
    cleanVault: 'Nettoyer le Coffre',
  },

  videos: {
    title: 'Registre des 106 Leçons',
    subtitle: 'Corpus complet de 106 vidéos avec découpage 35m et statuts d\'extraction',
    searchPlaceholder: 'Rechercher par titre ou identifiant...',
    allVideos: 'Toutes les vidéos',
    statusFilter: 'Filtrer par statut',
    filterPillar: 'Filtrer par pilier',
    tableHeaders: 'Entêtes du registre',
    actions: 'Actions rapides',
    duration: 'Durée',
    source: 'Source YouTube',
    familyFilter: 'Filtre Famille :',
    allFamilies: 'Toutes les familles',
    statusAll: 'Tous ({count})',
    statusReady: 'Prête ({count})',
    statusTodo: 'À faire ({count})',
    sortById: 'Trier par ID',
    selectedCount: '{count} sélectionnée(s)',
    ofDisplayed: 'sur {count} affichées',
    cancelAndRemoveDrive: '⏪ Annuler & Supprimer de Drive',
    cancelling: 'Annulation...',
    deselect: 'Désélectionner',
    tableThId: 'ID Vidéo',
    tableThTitle: 'Titre de la Leçon',
    tableThPlaylist: 'Playlist',
    tableThDuration: 'Durée',
    tableThSlices: 'Tranches 35m',
    tableThStatus: 'Statut Fiche',
    tableThAction: 'Action Rapide',
    badgeReady: '10/10 Prête',
    badgeClone: 'Clone 197L',
    badgeError: 'Erreur',
    badgeToExtract: 'À extraire',
    viewFiche: 'Voir Fiche',
    extract: 'Extraire',
    openInDrive: 'Ouvrir dans Google Drive',
    viewOnYoutube: 'Voir sur YouTube',
    slicesCount: '{count} tranche',
    slicesCountPlural: '{count} tranches',
  },

  fiches: {
    title: 'Spécifications Formelles (SCRIBE-ICT v3)',
    subtitle: 'Double-Face : Leçon Humaine 8 Sections + Spécification 10/10',
    filterPillar: 'Filtrer par pilier',
    emptyState: 'Aucune fiche trouvée',
    downloadTsv: 'Télécharger TSV',
    batchExtract: 'Extraction par Lot',
    viewFiche: 'Consulter la fiche',
    copyMarkdown: 'Copier le Markdown',
    kpiValidated: 'Fiches Validées',
    kpiValidatedSub: 'Standard 10/10 Double-Face',
    kpiRules: 'Règles & Paramètres',
    kpiRulesSub: 'Unités relatives (ATR, % CE)',
    kpiProofs: 'Preuves vs Absents',
    kpiProofsSub: '{count} décisions [ABSENT] tracées',
    kpiDrive: 'Coffre Google Drive',
    kpiDriveSynced: '● Synchronisé en direct',
    kpiDriveOffline: '○ Déconnecté',
    syncDrive: 'Sync Drive',
    filterCurriculum: 'Filtre Cursus :',
    allCurriculums: 'Toutes',
    conceptFilter: 'Concept :',
    claudeBridge: 'Pont Claude Codeur',
    consolidateConcepts: 'Consolidation par Concept',
    datasetExport: 'Dataset IA (.jsonl)',
    noFiches: 'Aucune fiche ne correspond à votre filtre',
    noFichesSub: 'Chargez une fiche échantillon étalon ou lancez le Mode Automatique pour extraire les fiches.',
    loadDemoFiche: 'Charger la Fiche Étalon FVG',
    atomicRules: 'atomiques',
    variableParams: 'variables',
    labeledProofs: 'étiquetées',
    absentDecisions: 'décisions',
    charCount: '{count} caractères',
    copySpecCode: 'Copier Spec Code',
    copied: 'Copié !',
    openStudio: 'Ouvrir Studio',
    modelInspector: 'Inspecteur de Modèle',
    detectedRules: 'Règles Atomiques Détectées',
    deterministic: 'Déterministe',
    toExtractForPillar: 'À Extraire pour ce Pilier',
    viewRegistry: 'Voir Registre →',
  },

  concepts: {
    title: 'Taxonomie & Classification',
    subtitle: '6 Piliers d\'architecture canonique et consolidations MASTER',
    pillarsList: 'Liste des piliers d\'architecture',
    rulesCount: '{count} règles formelles',
    examplesCount: '{count} exemples annotés',
    generateMaster: 'Générer MASTER_<CONCEPT>.md',
    trainingDataset: 'Exporter Dataset d\'Entraînement',
    taxonomyTitle: 'Taxonomie Multi-Domaines & Synthèses MASTER_<CONCEPT>.md',
    validatedSpecsBadge: '{count} Spécifications Validées',
    pillarLabel: 'Pilier {idx} : {title}',
    pillarDesc: 'Regroupe et consolide chronologiquement toutes les leçons YouTube extraites correspondant à ce pilier en un chapitre maître MASTER_{id}.md et un dataset .jsonl.',
    benchmarkCoverage: 'Couverture du Benchmark',
    subConcepts: 'Sous-concepts (Benchmark #1) :',
    statusInProgress: 'En cours',
    statusToConsolidate: 'À consolider',
    statusTodo: 'À faire',
    statusMasterReady: 'MASTER.md Prêt',
    statusPriority: 'Prioritaire',
  },

  drive: {
    title: 'Coffre Google Drive',
    subtitle: 'Sauvegarde Cloud permanente et synchronisation du registre',
    statusConnected: 'Connecté en permanence',
    statusDisconnected: 'Non connecté',
    connectButton: 'Connecter Google Drive',
    disconnectButton: 'Déconnexion',
    syncNow: 'Synchroniser Maintenant',
    backupAll: 'Sauvegarder tout sur Drive',
    expiredBanner: 'Session expirée : renouveler la connexion Drive',
    driveTitle: 'Coffre Google Drive & Registre de Traçabilité Léger',
    driveSubtitle: 'Votre session reste toujours connectée. Les fichiers .md sont stockés exclusivement sur Google Drive (zéro saturation mémoire dans l\'application).',
    dedicatedFolder: 'Dossier Cloud Dédié :',
    openDriveFolder: 'Ouvrir dans Google Drive',
    clonesDetectedTitle: '{count} fichiers erronés (clones de 197 lignes) détectés sur Google Drive',
    clonesActionRequired: 'ACTION REQUISE',
    clonesDesc: 'Ces fichiers sont des copies statiques issues de l\'ancien générateur. Votre vraie fiche étalon (dg2-OsUXN60) sera conservée intacte.',
    purgeClonesBtn: 'Purger les {count} fiches erronées',
    connectDriveTitle: 'Connectez Google Drive une seule fois',
    connectDriveDesc: 'Vos identifiants sont mémorisés dans votre navigateur. Vous n\'aurez plus besoin de vous reconnecter à chaque session.',
    searchFilter: 'Filtrer les fichiers du coffre...',
    reorganizeTree: 'Classer dans l\'Arborescence ICT',
    reorganizing: 'Classement...',
    pushGithub: 'Push GitHub',
    refresh: 'Actualiser',
    exportTsv: 'Exporter Registre TSV',
    purgeDriveZero: 'Purger Drive & Zéro (0/106)',
    disconnect: 'Déconnexion',
    filesInDrive: 'Fichiers dans votre dossier Drive ({count})',
    erroneousCount: '{count} erronés',
    authenticCount: '{count} authentiques',
    loadingFiles: 'Chargement des fichiers depuis Google Drive...',
    noFiles: 'Aucun fichier dans ce dossier Google Drive',
    noFilesSub: 'Lancez le mode automatique pour commencer l\'extraction multimodale réelle des 106 vidéos.',
    sizeLabel: 'Taille : {size}',
    modifiedLabel: 'Modifié : {date}',
    previewTooltip: 'Aperçu à la demande',
    deleteTooltip: 'Supprimer du Drive',
  },

  reglages: {
    title: 'Moteur & Réglages LLM',
    subtitle: 'Quotas AI Studio, clés API, prompt système et maintenance',
    languageSectionTitle: 'Langue de l\'Interface',
    languageSectionDesc: 'Basculez instantanément l\'application entre le Français et l\'Anglais sans rechargement de page.',
    frOption: 'Français (FR)',
    enOption: 'English (EN)',
    geminiTitle: 'Clé API Google AI Studio',
    anthropicTitle: 'Clé API Anthropic Claude & Connexions BYOK',
    quotasTitle: 'Capacité & Cadence API Gemini',
    promptTemplates: 'Prompts Système Déterministes',
    maintenanceZone: 'Zone de Maintenance & Remise à Zéro',
    resetAll: 'Réinitialiser Local à 0/106',
    headerTag: 'Panneau de Configuration & Sécurité',
    headerTitle: 'Paramètres du Moteur Algorithmique',
    headerDesc: 'Gestion des clés d\'inférence Gemini Pro, quotas journaliers, garde-fous et exports Google Sheets.',
    geminiKeySection: 'Clé API Google AI Studio (Compte Pro)',
    active: 'Actif',
    persistentConfig: 'Configuration persistante :',
    persistentConfigDesc: 'Si le champ ci-dessous est vide, le serveur utilise automatiquement la variable d\'environnement GEMINI_API_KEY (.env). Vous pouvez aussi renseigner une clé personnalisée et tester la connectivité réelle sur les 4 modèles Gemini.',
    activeApiKey: 'Clé API active :',
    defaultEnvKey: 'Clé serveur (.env) par défaut',
    refKey: 'Réf : ...{ref}',
    geminiPlaceholder: 'Collez votre clé API Gemini (commençant par AQ... ou AIza...)',
    save: 'Enregistrer',
    saved: 'Enregistrée !',
    testKey: 'Tester',
    testingKey: 'Test...',
    anthropicSection: 'Clé API Anthropic Claude & Connexion Google Drive Personnelle',
    byok: 'BYOK (Vos Propres Clés)',
    anthropicDesc: 'Toute personne qui clone ce dépôt peut connecter sa propre clé API Anthropic Claude (pour la compilation de cours/code) et son propre jeton OAuth Google Drive ou configuration Firebase.',
    anthropicKeyLabel: '1. Clé API Anthropic Claude (ANTHROPIC_API_KEY)',
    anthropicKeyPlaceholder: 'sk-ant-api03-...',
    anthropicKeyDesc: 'Utilisée par scripts/claude_agent_bridge.py et la modale du Compilateur Claude Code.',
    driveTokenLabel: '2. Jeton OAuth2 Google Drive Personnel (ou JSON Firebase)',
    driveTokenPlaceholder: 'Collez le jeton Drive OAuth (ya29.a0...) ou le JSON Firebase',
    driveTokenDesc: 'Optionnel : l\'application fonctionne à 100% localement sans Google Drive.',
    connectDrive: 'Connecter Drive',
    unlimitedModeTitle: 'Capacité & Cadence API Gemini',
    unlimitedModeBadge: 'Mode Illimité (100% Capacité Clé)',
    unlimitedModeSub: 'Plafond artificiel supprimé. Cadence autorégulée avec compte à rebours visible en cas de 429.',
    unlimitedMaxUnlocked: 'Cadence Maximale Débloquée',
    maintenanceActions: 'Actions d\'entretien :',
    purgeSimulatedFiches: 'Purger les fiches simulées (< 15 Ko)',
    resetZero: 'Réinitialiser à zéro (0/106)',
    loadFvgSample: 'Charger l\'étalon FVG',
    scribePromptTitle: 'Prompt Système Déterministe : SCRIBE-ICT v3',
    scribePromptBadge: 'Version Double-Face 10/10',
    copyScribePrompt: 'Copier le prompt SCRIBE-ICT v3',
    exportTsvTitle: 'Export Registre Google Sheets (TSV)',
    exportTsvSub: 'Télécharger la base complète des 106 vidéos dédoublonnées avec statuts.',
    exportTsvMaster: 'Registre Maître (106 Vidéos Uniques)',
    exportTsvBtn: 'Télécharger TSV Local',
    maintenanceZoneTitle: 'Zone de Maintenance & Remise à Zéro Complète',
    maintenanceZoneSub: 'Réinitialiser les compteurs, vider la bibliothèque et purger le Drive pour repartir à 0 / 106.',
    resetLocalBtn: 'Réinitialiser Local à 0/106',
  },

  modals: {
    addFicheTitle: 'Enregistrer une Fiche d\'AI Studio',
    addFicheSub: 'Collez le résultat généré par Gemini pour vérifier les balises et l\'archiver.',
    addFicheContentLabel: 'Contenu Markdown de la Fiche :',
    addFichePlaceholder: 'Collez ici la réponse de Gemini (avec frontmatter YAML, registre de preuves et spécification)...',
    addFicheSaveBtn: 'Enregistrer dans la Bibliothèque',
    queueTitle: 'Moteur d\'Extraction Multimodal SCRIBE-ICT v3',
    queueSub: 'Spécifications 10/10 : Causalité formelle, Machine à états, OHLC math et sauvegarde Google Drive',
    queueScopeLabel: '1. Périmètre de Playlist :',
    queueModelLabel: '2. Modèle Multimodal Vidéo Officiel (avec Fallback Cascade 4 Modèles) :',
    queueBatchLabel: '3. Taille du Lot d\'Exécution :',
    queueOptionsLabel: '3. Options & Sauvegarde :',
    queueDirectUpload: 'Envoi direct du fichier Markdown sur Google Drive',
    queueForceReExtract: 'Forcer la ré-extraction des vidéos déjà traitées',
    queueStartBtn: 'Démarrer l\'Extraction ({count} vidéos)',
    queueStopBtn: '🛑 Arrêter',
    queueSkipBtn: '⏭️ Passer cette vidéo',
    queuePauseBtn: 'Mettre en Pause',
    queueResumeBtn: 'Reprendre',
    queueBackgroundBtn: 'Continuer en arrière-plan',
    queueFinishedTitle: 'Lot Terminé avec Succès !',
    queueNewBatchBtn: '🔄 Configurer & Lancer un nouveau groupe de vidéos',
    queueRollbackBtn: '⏪ Annuler ce lot (Supprimer de Google Drive + Remettre en À faire)',
    queueViewInStudioBtn: 'Consulter les Fiches dans l\'Atelier',
    githubTitle: 'Synchronisation & Push GitHub',
    githubSub: 'Poussez l\'intégralité du code et de vos fiches vers votre repository GitHub en un clic.',
    branchName: 'Branche Cible :',
    commitMessage: 'Message de Commit :',
    pushButton: 'Pousser le projet complet sur GitHub',
    pushingButton: 'Envoi en cours vers GitHub...',
    confirmTitle: 'Êtes-vous sûr ?',
    confirmDesc: 'Cette action est irréversible. Voulez-vous continuer ?',
    confirmDefaultTitle: 'Êtes-vous sûr ?',
    confirmDefaultCancel: 'Annuler',
    confirmDefaultConfirm: 'Confirmer',
    confirmPermanentDeleteWarning: 'Cette opération supprimera le fichier distant de façon permanente.',
    githubSyncTitle: 'Synchronisation & Push GitHub',
    githubSyncSub: 'Poussez l\'intégralité du code et de vos {count} fiches vers votre repository GitHub en un clic.',
    githubPushBtn: 'Pousser le projet complet sur GitHub',
    githubPushing: 'Envoi en cours vers GitHub...',
  },

  toasts: {
    modelActive: 'Modèle actif : {model}',
    tsvDownloaded: 'Fichier TSV téléchargé avec succès !',
    purgeCompleted: 'Purge achevée : fiches simulées supprimées et registre mis à jour.',
    driveExpired: 'Session Google Drive expirée (jeton OAuth 1h)...',
    syncSuccess: 'Synchronisation Google Drive effectuée avec succès !',
    errorGeneric: 'Une erreur est survenue lors du traitement.',
    copySuccess: 'Copié dans le presse-papier !',
    languageSwitched: 'Langue basculée en Français',
    driveConnecting: 'Connexion à Google Drive en cours...',
    driveConnected: 'Session Google Drive renouvelée avec succès !',
    driveRenewFailed: 'Échec du renouvellement : {msg}',
    allVideosProcessed: 'Toutes les vidéos de ce périmètre sont déjà traitées !',
    batchCompleted: 'Traitement terminé : {count} fiches réelles extraites !',
    batchInterrupted: 'Traitement par lot interrompu.',
    batchCancelled: 'Lot annulé : {count} vidéo(s) remise(s) à faire.',
    videosReset: '{count} vidéo(s) réinitialisée(s) ({deleted} fichier(s) supprimé(s) de Drive).',
    vaultPurged: 'Dossier Google Drive entièrement purgé et registre remis à zéro (0 / 106) !',
    registryReset: 'Registre de traçabilité réinitialisé à zéro (0 / 106).',
    sheetSavedOnDrive: '⚡ Fiche {id} classée sur Google Drive ({path}) !',
    sheetSavedLocal: 'Fiche {id} enregistrée localement.',
    sheetsImported: '{count} fiche(s) importée(s) dans votre bibliothèque !',
    fvgSampleLoaded: 'Fiche étalon FVG chargée dans votre bibliothèque !',
    pleaseConnectDrive: 'Veuillez d\'abord vous connecter à Google Drive.',
    sheetNotFound: 'Contenu de fiche introuvable.',
    driveExpiredBanner: 'Session Google Drive expirée (jeton OAuth 1h) : Renouvelez la session en 1 clic pour poursuivre la synchronisation Cloud.',
    renewDriveBtn: 'Renouveler Session Drive',
  },

  viewer: {
    ficheTitle: 'Visualiseur de Fiche Technique',
    metricsTab: 'Métriques & Linter',
    markdownTab: 'Markdown Brut',
    copyButton: 'Copier la Fiche',
    downloadButton: 'Télécharger .md',
    closeDrawer: 'Fermer le tiroir',
    tabHuman: '📖 Vue Cours Humain (8 Sections)',
    tabAgent: '🤖 Vue Spec & Algorithme 10/10',
    tabLinter: '🛡️ Preuves & Linter Déterministe',
    tabSplit: '⚡ Vue Split Côte-à-Côte',
    tabRaw: '📄 Markdown Brut',
    compliantBadge: 'Conforme SCRIBE-ICT v3 ({r}R / {p}P)',
    revisionRequiredBadge: 'Révision Requise ({count} anomalie(s))',
    saveDrive: 'Sauvegarder Drive',
    copyForClaude: 'Copier pour Claude/Opus',
    copiedForAgent: 'Copié pour l\'Agent !',
    linterAuditTitle: 'Diagnostic du Linter Déterministe SCRIBE-ICT v3 ({verdict})',
    humanColTitle: 'Leçon Humaine (8 Sections)',
    humanColSub: 'Pour le trader',
    agentColTitle: 'Spécification Agentique 10/10',
    agentColSub: 'Pour le code',
    copyFullMarkdown: 'Copier tout le document Markdown',
  },
} as const;

type DeepString<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepString<T[K]>;
};

export type TranslationDict = DeepString<typeof fr>;

/**
 * Pure format translation helper for parameter interpolation and fallback handling.
 * Resolves dot-delimited key paths (e.g. "common.save", "toasts.modelActive").
 */
export function formatTranslation(
  dict: Record<string, any>,
  key: string,
  params?: Record<string, string | number>
): string {
  if (!dict || typeof dict !== 'object' || !key) return key;

  const parts = key.split('.');
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return key;
    }
  }

  if (typeof current !== 'string') {
    return key;
  }

  if (!params) {
    return current;
  }

  return current.replace(/\{(\w+)\}/g, (match, paramName) => {
    if (params && paramName in params && params[paramName] !== undefined && params[paramName] !== null) {
      return String(params[paramName]);
    }
    return match;
  });
}

/**
 * Resolves preferred language given stored preference and optional browser language.
 */
export function resolveLanguage(
  stored?: string | null,
  browser?: string | null
): 'fr' | 'en' {
  if (stored === 'fr' || stored === 'en') {
    return stored;
  }
  if (typeof browser === 'string' && browser.toLowerCase().startsWith('fr')) {
    return 'fr';
  }
  return 'en';
}

/**
 * Language toggle helper: 'fr' <-> 'en'
 */
export function toggleLanguageHelper(current: 'fr' | 'en'): 'fr' | 'en' {
  return current === 'fr' ? 'en' : 'fr';
}
