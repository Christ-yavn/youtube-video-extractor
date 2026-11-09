import test from 'node:test';
import assert from 'node:assert/strict';
import { fr, formatTranslation, resolveLanguage, toggleLanguageHelper } from '../locales/fr.ts';
import { en } from '../locales/en.ts';

const EXPECTED_DOMAINS = [
  'common',
  'nav',
  'header',
  'accueil',
  'videos',
  'fiches',
  'concepts',
  'drive',
  'reglages',
  'modals',
  'toasts',
  'viewer',
] as const;

test('i18n dictionaries cover all 12 UI domains with 100% key symmetry between FR and EN', () => {
  const frDomains = Object.keys(fr).sort();
  const enDomains = Object.keys(en).sort();
  const expectedSorted = [...EXPECTED_DOMAINS].sort();

  assert.deepEqual(frDomains, expectedSorted, 'FR dictionary must define all 12 domains');
  assert.deepEqual(enDomains, expectedSorted, 'EN dictionary must define all 12 domains');

  for (const domain of EXPECTED_DOMAINS) {
    const frKeys = Object.keys(fr[domain]).sort();
    const enKeys = Object.keys(en[domain]).sort();

    assert.deepEqual(
      frKeys,
      enKeys,
      `Domain "${domain}" must have 100% key parity between FR and EN`
    );
  }
});

test('i18n dictionaries contain non-empty, non-whitespace translation strings', () => {
  for (const domain of EXPECTED_DOMAINS) {
    const frSection = fr[domain] as Record<string, string>;
    const enSection = en[domain] as Record<string, string>;

    for (const [key, val] of Object.entries(frSection)) {
      assert.equal(typeof val, 'string', `fr.${domain}.${key} must be a string`);
      assert.ok(val.trim().length > 0, `fr.${domain}.${key} must not be blank`);
    }

    for (const [key, val] of Object.entries(enSection)) {
      assert.equal(typeof val, 'string', `en.${domain}.${key} must be a string`);
      assert.ok(val.trim().length > 0, `en.${domain}.${key} must not be blank`);
    }
  }
});

test('formatTranslation performs parameter interpolation correctly in FR and EN', () => {
  // Single parameter interpolation
  const frBench = formatTranslation(fr, 'accueil.benchmarkTitle', { total: 106 });
  assert.equal(frBench, 'Corpus de Test Réel : 106 Vidéos Techniques YouTube');

  const enBench = formatTranslation(en, 'accueil.benchmarkTitle', { total: 106 });
  assert.equal(enBench, 'Real-World Test Corpus: 106 Technical YouTube Videos');

  // Multiple parameters interpolation
  const frBadge = formatTranslation(fr, 'viewer.compliantBadge', { r: 12, p: 9 });
  assert.equal(frBadge, 'Conforme SCRIBE-ICT v3 (12R / 9P)');

  const enBadge = formatTranslation(en, 'viewer.compliantBadge', { r: 12, p: 9 });
  assert.equal(enBadge, 'SCRIBE-ICT v3 Compliant (12R / 9P)');

  // Model toast interpolation
  const frToast = formatTranslation(fr, 'toasts.modelActive', { model: 'gemini-2.5-pro' });
  assert.equal(frToast, 'Modèle actif : gemini-2.5-pro');

  const enToast = formatTranslation(en, 'toasts.modelActive', { model: 'gemini-2.5-pro' });
  assert.equal(enToast, 'Active model: gemini-2.5-pro');

  // Unsupplied parameter token remains intact
  const unsupplied = formatTranslation(fr, 'toasts.modelActive', {});
  assert.equal(unsupplied, 'Modèle actif : {model}');
});

test('formatTranslation returns key fallback gracefully on unknown key or invalid input', () => {
  // Unknown key path returns the path itself
  assert.equal(formatTranslation(fr, 'nonexistent.key'), 'nonexistent.key');
  assert.equal(formatTranslation(en, 'common.nonexistent'), 'common.nonexistent');

  // Invalid or empty inputs
  assert.equal(formatTranslation(fr, ''), '');
  assert.equal(formatTranslation(null as any, 'common.save'), 'common.save');
  assert.equal(formatTranslation(fr, 'common'), 'common'); // non-string leaf returns key
});

test('translation lookup accuracy across all 12 domains in FR and EN', () => {
  const spotChecks: Array<{
    key: string;
    expectedFr: string;
    expectedEn: string;
  }> = [
    { key: 'common.save', expectedFr: 'Enregistrer', expectedEn: 'Save' },
    { key: 'nav.compilerStudio', expectedFr: 'Studio Compilateur', expectedEn: 'Compiler Studio' },
    { key: 'header.localMode', expectedFr: 'Mode Local', expectedEn: 'Local Mode' },
    { key: 'accueil.quickStats', expectedFr: 'Statistiques Rapides', expectedEn: 'Quick Stats' },
    { key: 'videos.tableThId', expectedFr: 'ID Vidéo', expectedEn: 'Video ID' },
    { key: 'fiches.kpiValidated', expectedFr: 'Fiches Validées', expectedEn: 'Validated Sheets' },
    { key: 'concepts.pillarsList', expectedFr: 'Liste des piliers d\'architecture', expectedEn: 'Architecture pillars list' },
    { key: 'drive.statusConnected', expectedFr: 'Connecté en permanence', expectedEn: 'Permanently Connected' },
    { key: 'reglages.languageSectionTitle', expectedFr: 'Langue de l\'Interface', expectedEn: 'Interface Language' },
    { key: 'modals.addFicheTitle', expectedFr: 'Enregistrer une Fiche d\'AI Studio', expectedEn: 'Save a Sheet from AI Studio' },
    { key: 'toasts.copySuccess', expectedFr: 'Copié dans le presse-papier !', expectedEn: 'Copied to clipboard!' },
    { key: 'viewer.tabHuman', expectedFr: '📖 Vue Cours Humain (8 Sections)', expectedEn: '📖 8-Section Human Course' },
  ];

  for (const check of spotChecks) {
    const actualFr = formatTranslation(fr, check.key);
    const actualEn = formatTranslation(en, check.key);

    assert.equal(actualFr, check.expectedFr, `FR lookup mismatch for ${check.key}`);
    assert.equal(actualEn, check.expectedEn, `EN lookup mismatch for ${check.key}`);
  }
});

test('resolveLanguage correctly resolves stored preferences and browser fallbacks', () => {
  // Stored preference takes precedence
  assert.equal(resolveLanguage('fr', 'en-US'), 'fr');
  assert.equal(resolveLanguage('en', 'fr-FR'), 'en');

  // If stored is absent, browser language starting with 'fr' resolves to 'fr'
  assert.equal(resolveLanguage(null, 'fr-FR'), 'fr');
  assert.equal(resolveLanguage(undefined, 'fr-CA'), 'fr');
  assert.equal(resolveLanguage('', 'FR'), 'fr');

  // Otherwise defaults to 'en'
  assert.equal(resolveLanguage(null, 'en-US'), 'en');
  assert.equal(resolveLanguage(null, 'en-GB'), 'en');
  assert.equal(resolveLanguage(null, 'es-ES'), 'en');
  assert.equal(resolveLanguage(null, 'de-DE'), 'en');
  assert.equal(resolveLanguage(null, null), 'en');
  assert.equal(resolveLanguage(undefined, undefined), 'en');
});

test('toggleLanguageHelper alternates between fr and en', () => {
  assert.equal(toggleLanguageHelper('fr'), 'en');
  assert.equal(toggleLanguageHelper('en'), 'fr');
});

test('i18n constants and total vocabulary volume are valid', () => {
  let totalKeys = 0;
  for (const domain of EXPECTED_DOMAINS) {
    totalKeys += Object.keys(fr[domain]).length;
  }

  // Ensure robust dictionary volume across 12 domains (> 150 unique keys)
  assert.ok(totalKeys >= 150, `Expected at least 150 translated keys across domains, got ${totalKeys}`);
});
