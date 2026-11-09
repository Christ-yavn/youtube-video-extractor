import React, { useState } from 'react';
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Table, 
  ShieldAlert, 
  Sparkles,
  Layers,
  HelpCircle,
  Sliders,
  FolderSync,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Zap,
  Globe
} from 'lucide-react';
import { 
  PILOTE_PROTOCOL, 
  RISQUES_ET_PARADES, 
  REGISTRY_COLUMNS,
  WORKFLOW_STEPS 
} from '../data/architectureData';
import { SCRIBE_ICT_V2_PROMPT } from '../data/scribePromptV2';
import { 
  getActiveApiKey, 
  setActiveApiKey, 
  getActiveAnthropicKey,
  setActiveAnthropicKey,
  testGeminiApiKey, 
  ApiTestResult 
} from '../utils/apiKeyManager';
import { connectWithManualDriveToken, CUSTOM_FIREBASE_CONFIG_KEY } from '../services/googleDriveService';
import { useLanguage } from '../context/LanguageContext';

interface ReglagesProps {
  onExportTSV: () => void;
  totalVideosCount: number;
  dailyQuotaLimit: number;
  onUpdateDailyQuotaLimit: (limit: number) => void;
  onResetToZero?: () => void;
  onLoadSampleFiche?: () => void;
  onPurgeFakeClones?: () => void;
}

export const Reglages: React.FC<ReglagesProps> = ({ 
  onExportTSV, 
  totalVideosCount,
  dailyQuotaLimit,
  onUpdateDailyQuotaLimit,
  onResetToZero,
  onLoadSampleFiche,
  onPurgeFakeClones,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'language': true,
    'apiKey': true,
    'quota': true,
    'export': true,
    'prompt_v2': false,
    'tranches': false,
    'pilote': false,
    'risques': false,
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // API Key state (Gemini + Anthropic Claude + Self-Hosted Google Drive)
  const [apiKey, setApiKey] = useState<string>(() => getActiveApiKey());
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<ApiTestResult | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [anthropicKey, setAnthropicKey] = useState<string>(() => getActiveAnthropicKey());
  const [anthropicSaved, setAnthropicSaved] = useState<boolean>(false);
  const [manualDriveToken, setManualDriveToken] = useState<string>('');
  const [driveConfigMsg, setDriveConfigMsg] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveApiKey = () => {
    const trimmed = apiKey.trim();
    setActiveApiKey(trimmed);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    try {
      const res = await testGeminiApiKey(apiKey.trim());
      setTestResult(res);
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Erreur inconnue lors du test',
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header Banner */}
      <div className="quant-card p-6 bg-white dark:bg-[#0F1420] border-l-4 border-l-blue-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>{t('reglages.headerTag')}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('reglages.headerTitle')}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t('reglages.headerDesc')}
          </p>
        </div>
      </div>

      <div className="space-y-4">

        {/* Section Langue de l'Interface / Interface Language */}
        <div className="quant-card p-5 bg-white dark:bg-[#0F1420] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {t('reglages.languageSectionTitle')}
              </h4>
              <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 px-2 py-0.5 rounded font-mono font-bold border border-indigo-200 dark:border-indigo-500/20">
                {language.toUpperCase()}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('reglages.languageSectionDesc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                language === 'fr'
                  ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-500/15 dark:border-indigo-500/40 text-indigo-900 dark:text-white ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-black/30 dark:hover:bg-black/50 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🇫🇷</span>
                <div className="text-left">
                  <div className="font-bold text-xs sm:text-sm">{t('reglages.frOption')}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Français</div>
                </div>
              </div>
              {language === 'fr' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-500/15 dark:border-indigo-500/40 text-indigo-900 dark:text-white ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-black/30 dark:hover:bg-black/50 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🇬🇧</span>
                <div className="text-left">
                  <div className="font-bold text-xs sm:text-sm">{t('reglages.enOption')}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">English</div>
                </div>
              </div>
              {language === 'en' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
            </button>
          </div>
        </div>

        {/* Section Clé API Google AI Studio / Gemini Pro */}
        <div className="quant-card overflow-hidden bg-white dark:bg-[#0F1420]">
          <button
            type="button"
            onClick={() => toggleSection('apiKey')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Key className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{t('reglages.geminiKeySection')}</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('reglages.active')}
                </span>
                <span className="text-[11px] bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-200 dark:border-blue-500/20">
                  gemini-2.5-pro | gemini-3.1-pro-preview | gemini-3-flash-preview | gemini-2.5-flash
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t('reglages.headerDesc')}
              </p>
            </div>
            {openSections['apiKey'] ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
          </button>

          {openSections['apiKey'] && (
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/[0.08] space-y-4 text-xs font-mono text-slate-700 dark:text-slate-300">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 rounded-xl flex items-start gap-3">
                <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-sans">
                  <span className="font-bold">{t('reglages.persistentConfig')} </span>
                  {t('reglages.persistentConfigDesc')}
                </div>
              </div>

              {/* Key Input & Actions */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>{t('reglages.activeApiKey')}</span>
                  <span className="text-slate-400 font-normal">
                    {apiKey ? t('reglages.refKey', { ref: apiKey.slice(-6) }) : t('reglages.defaultEnvKey')}
                  </span>
                </label>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={t('reglages.geminiPlaceholder')}
                      className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 font-mono text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                      title={showApiKey ? 'Masquer' : 'Afficher'}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveApiKey}
                      className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {isSaved ? <Check className="w-3.5 h-3.5 text-white" /> : null}
                      <span>{isSaved ? t('reglages.saved') : t('reglages.save')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(apiKey, 'api_key_copy')}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200"
                      title="Copier la clé"
                    >
                      {copiedKey === 'api_key_copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleTestKey}
                      disabled={isTestingKey}
                      className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingKey ? 'animate-spin' : ''}`} />
                      <span>{isTestingKey ? t('reglages.testingKey') : t('reglages.testKey')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Test Result Display */}
              {testResult && (
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.model && (
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      Modèle : {testResult.model}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Capacité & Cadence API Gemini (Mode Illimité) */}
        {/* Section Anthropic Claude Code & Self-Hosted Google Drive Credentials */}
        <div className="quant-card p-5 space-y-4 bg-white dark:bg-[#0F1420]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500" />
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {t('reglages.anthropicSection')}
              </h4>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-500/20 font-bold">
              {t('reglages.byok')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('reglages.anthropicDesc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                {t('reglages.anthropicKeyLabel')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder={t('reglages.anthropicKeyPlaceholder')}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setActiveAnthropicKey(anthropicKey);
                    setAnthropicSaved(true);
                    setTimeout(() => setAnthropicSaved(false), 2500);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                >
                  {anthropicSaved ? t('reglages.saved') : t('reglages.save')}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                {t('reglages.anthropicKeyDesc')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                {t('reglages.driveTokenLabel')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={manualDriveToken}
                  onChange={(e) => setManualDriveToken(e.target.value)}
                  placeholder={t('reglages.driveTokenPlaceholder')}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const raw = manualDriveToken.trim();
                    if (!raw) return;
                    try {
                      if (raw.startsWith('{')) {
                        JSON.parse(raw);
                        localStorage.setItem(CUSTOM_FIREBASE_CONFIG_KEY, raw);
                        setDriveConfigMsg('Firebase config saved! Reload page to enable Google Popup.');
                      } else {
                        connectWithManualDriveToken(raw);
                        setDriveConfigMsg('Google Drive OAuth token connected!');
                      }
                    } catch (err: any) {
                      setDriveConfigMsg(err?.message || 'Invalid format');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  {t('reglages.connectDrive')}
                </button>
              </div>
              {driveConfigMsg ? (
                <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {driveConfigMsg}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500">
                  {t('reglages.driveTokenDesc')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="quant-card overflow-hidden bg-white dark:bg-[#0F1420]">
          <button
            type="button"
            onClick={() => toggleSection('quota')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{t('reglages.unlimitedModeTitle')}</h4>
                <span className="font-mono text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('reglages.unlimitedModeBadge')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t('reglages.unlimitedModeSub')}</p>
            </div>
            {openSections['quota'] ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
          </button>

          {openSections['quota'] && (
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/[0.08] space-y-4 text-xs font-mono text-slate-700 dark:text-slate-300">
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl space-y-2 font-sans">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-xs font-mono uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t('reglages.unlimitedMaxUnlocked')}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('reglages.unlimitedModeSub')}
                </p>
              </div>

              {/* Maintenance Tools */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 pt-3">
                <span className="text-slate-600 font-semibold">{t('reglages.maintenanceActions')}</span>
                <div className="flex items-center gap-2">
                  {onPurgeFakeClones && (
                    <button
                      type="button"
                      onClick={onPurgeFakeClones}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t('reglages.purgeSimulatedFiches')}</span>
                    </button>
                  )}
                  {onResetToZero && (
                    <button
                      type="button"
                      onClick={onResetToZero}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors cursor-pointer"
                    >
                      {t('reglages.resetZero')}
                    </button>
                  )}
                  {onLoadSampleFiche && (
                    <button
                      type="button"
                      onClick={onLoadSampleFiche}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
                    >
                      {t('reglages.loadFvgSample')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section SCRIBE-ICT Prompt */}
        <div className="quant-card overflow-hidden bg-white dark:bg-[#0F1420]">
          <button
            type="button"
            onClick={() => toggleSection('prompt_v2')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{t('reglages.scribePromptTitle')}</h4>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                  {t('reglages.scribePromptBadge')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('reglages.headerDesc')}
              </p>
            </div>
            {openSections['prompt_v2'] ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
          </button>

          {openSections['prompt_v2'] && (
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/[0.08] space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">{t('reglages.copyScribePrompt')}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(SCRIBE_ICT_V2_PROMPT, 'scribe_copy')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold border border-blue-200 transition-colors cursor-pointer"
                >
                  {copiedKey === 'scribe_copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{t('reglages.copyScribePrompt')}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                {SCRIBE_ICT_V2_PROMPT}
              </pre>
            </div>
          )}
        </div>

        {/* Section Export TSV */}
        <div className="quant-card overflow-hidden bg-white dark:bg-[#0F1420]">
          <button
            type="button"
            onClick={() => toggleSection('export')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{t('reglages.exportTsvTitle')}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t('reglages.exportTsvSub')}</p>
            </div>
            {openSections['export'] ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
          </button>

          {openSections['export'] && (
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/[0.08] space-y-4 text-xs font-mono text-slate-700 dark:text-slate-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{t('reglages.exportTsvMaster')}</span>
                  <p className="text-slate-500 mt-0.5">{t('reglages.exportTsvSub')}</p>
                </div>
                <button
                  type="button"
                  onClick={onExportTSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('reglages.exportTsvBtn')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section Maintenance & Remise à Zéro */}
        <div className="quant-card overflow-hidden bg-white dark:bg-[#0F1420] border-t-2 border-t-red-600">
          <button
            type="button"
            onClick={() => toggleSection('maintenance')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-red-600 dark:text-red-400 text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>{t('reglages.maintenanceZoneTitle')}</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{t('reglages.maintenanceZoneSub')}</p>
            </div>
            {openSections['maintenance'] ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
          </button>

          {openSections['maintenance'] && (
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/[0.08] space-y-4 text-xs font-mono">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-50/50 dark:bg-rose-950/20 rounded-xl border border-red-200 dark:border-rose-900/40">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">{t('reglages.resetZero')}</span>
                  <p className="text-slate-500 dark:text-slate-400">
                    {t('reglages.maintenanceZoneSub')}
                  </p>
                </div>
                {onResetToZero && (
                  <button
                    type="button"
                    onClick={() => onResetToZero()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all shrink-0 cursor-pointer"
                  >
                    {t('reglages.resetLocalBtn')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
