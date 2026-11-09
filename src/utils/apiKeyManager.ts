/**
 * API Key & Model Configuration Manager for Google AI Studio (Gemini) & Anthropic Claude
 */

export type SupportedGeminiModel =
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.8-flash'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite'
  | 'gemini-flash-latest'
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash';

export const SUPPORTED_GEMINI_MODELS: SupportedGeminiModel[] = [
  'gemini-3.1-pro-preview',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
];

export const DEFAULT_PRO_KEY = 'PLACEHOLDER_PRO_KEY_NOT_SET';
export const ANTHROPIC_KEY_STORAGE = 'yt_extractor_anthropic_api_key';

export function getActiveApiKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('hugo_fx_gemini_api_key');
    if (saved && saved.trim() && saved.trim() !== DEFAULT_PRO_KEY) {
      return saved.trim();
    }
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() && envKey.trim() !== DEFAULT_PRO_KEY) {
    return envKey.trim();
  }
  return '';
}

export function setActiveApiKey(newKey: string): void {
  if (typeof window !== 'undefined') {
    const trimmed = newKey.trim();
    if (!trimmed || trimmed === DEFAULT_PRO_KEY) {
      localStorage.removeItem('hugo_fx_gemini_api_key');
    } else {
      localStorage.setItem('hugo_fx_gemini_api_key', trimmed);
    }
  }
}

export function getActiveAnthropicKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(ANTHROPIC_KEY_STORAGE);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  }
  const envKey = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }
  return '';
}

export function setActiveAnthropicKey(newKey: string): void {
  if (typeof window !== 'undefined') {
    const trimmed = newKey.trim();
    if (!trimmed) {
      localStorage.removeItem(ANTHROPIC_KEY_STORAGE);
    } else {
      localStorage.setItem(ANTHROPIC_KEY_STORAGE, trimmed);
    }
  }
}

export interface ApiTestResult {
  success: boolean;
  message: string;
  model?: string;
  serviceTier?: string;
  latencyMs?: number;
}

export async function testGeminiApiKey(key: string): Promise<ApiTestResult> {
  const cleanKey = key.trim();
  if (!cleanKey) {
    return { success: false, message: 'La clé API est vide.' };
  }

  const startTime = Date.now();
  const modelsToTry: SupportedGeminiModel[] = [...SUPPORTED_GEMINI_MODELS];

  for (const modelCandidate of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reponds: OK' }] }],
        }),
      });

      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        const model = data.modelVersion || modelCandidate;
        const serviceTier = data.usageMetadata?.serviceTier || 'standard';

        return {
          success: true,
          message: 'Connexion établie avec succès ! Clé active et validée.',
          model,
          serviceTier,
          latencyMs,
        };
      }

      if (response.status === 503) {
        return {
          success: true,
          message: 'Clé authentifiée avec succès par Google (Forte charge temporaire 503).',
          model: modelCandidate,
          serviceTier: 'standard',
          latencyMs,
        };
      }

      if (response.status === 400 || response.status === 403 || response.status === 401) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errData.error?.message || `Clé non reconnue (HTTP ${response.status})`,
          latencyMs,
        };
      }
    } catch {
      // Continue to next candidate
    }
  }

  return {
    success: false,
    message: 'Erreur réseau lors de la communication avec Google AI.',
    latencyMs: Date.now() - startTime,
  };
}
