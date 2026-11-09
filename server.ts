import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { SCRIBE_PROMPT_V3 } from './src/data/scribePromptV2.ts';
import { calculateSlices, lintFicheV3 } from './src/utils/pipeline.ts';
import { buildUniversalExtractionPrompt, getDomainProfile, type DomainProfileId } from './src/utils/domainProfiles.ts';
import { DEFAULT_PRO_KEY, SUPPORTED_GEMINI_MODELS } from './src/utils/apiKeyManager.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/gemini/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.1-pro-preview',
    supportedModels: SUPPORTED_GEMINI_MODELS,
  });
});

// Real Multimodal Gemini Extraction Handler with Multi-Generational Fallback & Self-Refine
async function handleGeminiExtraction(req: express.Request, res: express.Response) {
  const rawBodyKey = typeof req.body.apiKey === 'string' ? req.body.apiKey.trim() : '';
  const customKey = rawBodyKey && rawBodyKey !== DEFAULT_PRO_KEY ? rawBodyKey : '';
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurée. Renseignez votre clé API Google AI Studio dans Réglages.' });
  }

  const { video, slice: reqSlice, videoMetadata: reqVideoMetadata, repairContext } = req.body;
  if (!video || !video.url || !video.video_id) {
    return res.status(400).json({ error: 'Données vidéo manquantes ou invalides.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const durationS = typeof video.duree_s === 'number' && video.duree_s > 0 ? video.duree_s : 0;
    const autoSlices = !reqSlice && durationS > 2100 ? calculateSlices(video.video_id, durationS, 35) : [];
    const slicesToProcess = reqSlice
      ? [reqSlice]
      : autoSlices.length > 1
        ? autoSlices
        : [undefined];
    const formattedDuration = `${Math.floor(durationS / 60)}:${(durationS % 60).toString().padStart(2, '0')}`;
    const primarySlice = slicesToProcess[0];
    const trancheStr = primarySlice
      ? `${primarySlice.formatted_start} - ${primarySlice.formatted_end} (Tranche ${primarySlice.slice_index}/${primarySlice.total_slices})`
      : `00:00 - ${formattedDuration} (Vidéo Intégrale 1/1)`;

    const buildBasePromptForSlice = (activeSlice?: any) => {
      const activeTrancheStr = activeSlice
        ? `${activeSlice.formatted_start} - ${activeSlice.formatted_end} (Tranche ${activeSlice.slice_index}/${activeSlice.total_slices})`
        : `00:00 - ${formattedDuration} (Vidéo Intégrale 1/1)`;
      const maxSecForSlice = activeSlice && typeof activeSlice.end_s === 'number' ? activeSlice.end_s : durationS;
      const maxFormatted = `${Math.floor(maxSecForSlice / 60)}:${(maxSecForSlice % 60).toString().padStart(2, '0')}`;

      const activeDomainId = (req.body.domainId || video.domainId) as DomainProfileId | undefined;
      const profilePrompt = (activeDomainId && activeDomainId !== 'MARKET_MICROSTRUCTURE_ICT')
        ? buildUniversalExtractionPrompt({
            domainId: activeDomainId,
            channelName: video.chaine || 'YouTube Instructor',
            videoTitle: video.titre,
            videoUrl: video.url,
            sliceIndex: activeSlice?.slice_index,
            totalSlices: activeSlice?.total_slices,
            startTimestamp: activeSlice?.formatted_start || '00:00',
            endTimestamp: activeSlice?.formatted_end || maxFormatted,
          })
        : SCRIBE_PROMPT_V3;

      return `${profilePrompt}

================================================================================
MÉTADONNÉES VÉRIFIÉES YOUTUBE DE CETTE VIDÉO (SOURCE DE VÉRITÉ) :
================================================================================
- ID_YOUTUBE : "${video.video_id}"
- URL_YOUTUBE : "${video.url}"
- TITRE_EXACT : "${video.titre}"
- DATE_PUBLICATION_EXACTE : "${video.date_video || '2024-01-01'}"
- DURÉE_TOTALE_EXACTE : ${durationS} secondes (${formattedDuration})
- TRANCHE_ANALYSÉE : "${activeTrancheStr}"
- PLAYLISTS : "${(video.playlists || []).join(', ')}"
- FAMILLE_CURSUS : "${video.famille || 'CONCEPTS_SETUPS'}"
- DESCRIPTION_YOUTUBE_ORIGINALE_HUGOFX :
"""
${(video.description || 'Aucune description fournie.').slice(0, 2500)}
"""

CONSIGNES IMPÉRATIVES POUR CETTE EXTRACTION :
1. COUVERTURE TEMPORELLE INTÉGRALE : Analyse la vidéo depuis le début de la tranche jusqu'à ${maxSecForSlice} secondes (${maxFormatted}). N'arrête JAMAIS ton analyse au milieu de la vidéo ! Si la vidéo enseigne plusieurs concepts successifs (ex: Swing, Liquidité, Premium/Discount, OTE, FVG, Order Block + Modèle d'entrée en fin de vidéo), tu DOIS couvrir 100 % des concepts jusqu'à ${maxFormatted}.
2. INTERDICTION DES TIMESTAMPS HORS-BORNE : Aucun timestamp cité ne doit dépasser ${maxSecForSlice} secondes (${maxFormatted}).
3. DENSITÉ NIVEAU ÉTALON BPR (320 à 480 LIGNES) :
   - Section I.1 : Au moins 15 à 25 citations verbales exactes [S-01 à S-nn] réparties sur toute la durée de la vidéo.
   - Section I.2 : Au moins 5 à 10 preuves visuelles précises [F-01 à F-nn] (bougies, tracés, prix lus sur l'axe droit TradingView, bascules d'UT).
   - Section I.3 : Tous les exemples graphiques montrés mesurés avec leurs vrais prix/pips et toute divergence ⚖️ DIT ≠ FAIT [X-01 à X-nn].
   - Section IV (Leçon Humaine en 8 sections) : Rédige un cours magistral complet et détaillé d'au moins 150 lignes (minimum 4 000 caractères pour la Section IV), expliquant pas à pas comment HugoFX repère l'objet, comment il distingue un bon d'un mauvais setup, avec quoi il le combine, et comment il exécute.
4. COUVERTURE CROISÉE 100 % : Chaque identifiant [R-...], [P-...] et [REJ-...] défini en Sections II et III DOIT apparaître entre crochets dans la Section IV.
5. ZÉRO BARÈME INVENTÉ : N'écris jamais "+40 pts" ou "+30 pts".
`;
    };

    const basePrompt = buildBasePromptForSlice(primarySlice);

    const buildSelfRefineSuffix = (errors: string[], missingRuleCitations: string[], draft: string) => `

==================================================
AUTO-REPAIR LINTER DÉTERMINISTE (SELF-REFINE SCRIBE-ICT v3) :
==================================================
Le brouillon précédent présente des non-conformités détectées par lintFicheV3 :
- Erreurs : ${errors.join(' | ') || 'Aucune'}
- Règles / Paramètres non cités dans la Section IV (Leçon Humaine) : ${missingRuleCitations.join(', ') || 'Aucun'}

BROUILLON À CORRIGER :
${draft}

INSTRUCTION DE RÉPARATION :
Régénère la fiche COMPLÈTE corrigée (de --- jusqu'à <<<FIN_FICHE_V3>>>) en corrigeant toutes les erreurs ci-dessus et en citant explicitement chaque règle R-xx, paramètre P-xx et rejet REJ-xx entre crochets dans la Section IV.
`;

    const prompt = repairContext && repairContext.previousDraft
      ? basePrompt + buildSelfRefineSuffix(
          repairContext.errors || [],
          repairContext.missingRuleCitations || [],
          repairContext.previousDraft
        )
      : basePrompt;

    // Multi-generational Fallback Model Pipeline: requested -> gemini-3.1-pro-preview -> gemini-3.8-flash -> gemini-3.5-flash -> gemini-3.1-flash-lite
    const requestedModel = req.body.model || process.env.GEMINI_MODEL || 'gemini-3.1-pro-preview';
    const strictProOnly = Boolean(req.body.strictProOnly);
    const fallbackCandidates = strictProOnly
      ? [requestedModel, 'gemini-3.1-pro-preview', 'gemini-3.8-flash'].filter((v, i, a) => a.indexOf(v) === i)
      : [
          requestedModel,
          ...SUPPORTED_GEMINI_MODELS.filter(m => m !== requestedModel),
        ];

    const buildVideoPart = (activeSlice?: any) => {
      const videoMetadata =
        reqVideoMetadata && typeof reqVideoMetadata.startOffset === 'string' && typeof reqVideoMetadata.endOffset === 'string'
          ? reqVideoMetadata
          : activeSlice && typeof activeSlice.start_s === 'number' && typeof activeSlice.end_s === 'number'
            ? { startOffset: `${activeSlice.start_s}s`, endOffset: `${activeSlice.end_s}s` }
            : undefined;

      return {
        fileData: {
          fileUri: video.url,
          mimeType: 'video/*',
        },
        ...(videoMetadata ? { videoMetadata } : {}),
      };
    };

    const callGeminiWithFallback = async (slicePrompt: string, activeSlice?: any) => {
      const vPart = buildVideoPart(activeSlice);
      let resp: any = null;
      let modelUsedNow = requestedModel;
      let errLast: Error | null = null;

      for (const candidate of fallbackCandidates) {
        try {
          modelUsedNow = candidate;
          resp = await ai.models.generateContent({
            model: candidate,
            contents: [
              {
                role: 'user',
                parts: [
                  vPart as any,
                  {
                    text: slicePrompt,
                  },
                ],
              },
            ],
            config: {
              temperature: 0.1,
              maxOutputTokens: 65536,
            },
          });

          if (resp && resp.text) {
            return { resp, modelUsedNow, vPart };
          }
        } catch (err: unknown) {
          errLast = err instanceof Error ? err : new Error(String(err));
          const errMsg = errLast.message || '';
          const is404 = errMsg.includes('404') || errMsg.toLowerCase().includes('not found') || errMsg.includes('models/');
          if (is404) {
            console.warn(`[Gemini API] Modèle ${candidate} non trouvé (404). Tentative avec le modèle de secours...`);
            continue;
          }
          throw errLast;
        }
      }
      throw errLast || new Error("Aucune réponse n'a pu être générée par l'API Gemini.");
    };

    // Extract primary slice (or repair draft)
    const { resp: response, modelUsedNow: successfulModel, vPart: primaryVideoPart } =
      await callGeminiWithFallback(prompt, primarySlice);

    let ficheContent = response.text || '';
    let tokensUsed = response.usageMetadata?.totalTokenCount || 15000;
    let selfRefined = Boolean(repairContext);

    // If video has multiple slices (> 35 min) and no single slice was requested, extract remaining slices and append
    if (!reqSlice && !repairContext && slicesToProcess.length > 1) {
      const additionalSlicesMarkdown: string[] = [];
      for (let idx = 1; idx < slicesToProcess.length; idx++) {
        const nextSlice = slicesToProcess[idx];
        try {
          const nextSlicePrompt = buildBasePromptForSlice(nextSlice);
          const { resp: nextResp } = await callGeminiWithFallback(nextSlicePrompt, nextSlice);
          if (nextResp && nextResp.text) {
            tokensUsed += nextResp.usageMetadata?.totalTokenCount || 0;
            additionalSlicesMarkdown.push(
              `\n\n---\n## 🎬 EXTENSION MULTI-TRANCHES — TRANCHE ${nextSlice.slice_index}/${nextSlice.total_slices} (${nextSlice.formatted_start} - ${nextSlice.formatted_end})\n\n` +
              nextResp.text.replace(/<<<FIN_FICHE_V3>>>/g, '').trim()
            );
          }
        } catch (sliceErr) {
          console.warn(`[Gemini API] Avertissement sur tranche ${idx + 1}/${slicesToProcess.length}:`, sliceErr);
        }
      }
      if (additionalSlicesMarkdown.length > 0) {
        ficheContent =
          ficheContent.replace(/<<<FIN_FICHE_V3>>>/g, '').trim() +
          additionalSlicesMarkdown.join('\n') +
          '\n\n<<<FIN_FICHE_V3>>>';
      }
    }

    // Stamp model_used, extracted_at, and real duration into the YAML frontmatter
    const injectYamlMetadata = (md: string, modelName: string) => {
      if (md.startsWith('---')) {
        const endYamlIdx = md.indexOf('\n---', 3);
        if (endYamlIdx !== -1) {
          let yamlBlock = md.slice(0, endYamlIdx);
          if (!yamlBlock.includes('model_used:')) {
            yamlBlock += `\nmodel_used: "${modelName}"`;
          }
          if (!yamlBlock.includes('extracted_at:')) {
            yamlBlock += `\nextracted_at: "${new Date().toISOString()}"`;
          }
          if (!yamlBlock.includes('tranches_extraites:')) {
            yamlBlock += `\ntranches_extraites: "${slicesToProcess.length}/${slicesToProcess.length}"`;
          }
          return yamlBlock + md.slice(endYamlIdx);
        }
      }
      return md;
    };

    ficheContent = injectYamlMetadata(ficheContent, successfulModel);

    // Execute lintFicheV3 and run 1 automatic Self-Refine pass if invalid
    let lintResult = lintFicheV3(ficheContent);
    if (!lintResult.isValid && !selfRefined) {
      try {
        const refinePrompt = basePrompt + buildSelfRefineSuffix(
          lintResult.errors,
          lintResult.missingRuleCitations,
          ficheContent
        );
        const refineResponse = await ai.models.generateContent({
          model: successfulModel,
          contents: [
            {
              role: 'user',
              parts: [
                primaryVideoPart as any,
                {
                  text: refinePrompt,
                },
              ],
            },
          ],
          config: {
            temperature: 0.1,
            maxOutputTokens: 65536,
          },
        });
        if (refineResponse && refineResponse.text) {
          ficheContent = injectYamlMetadata(refineResponse.text, successfulModel);
          tokensUsed += refineResponse.usageMetadata?.totalTokenCount || 0;
          selfRefined = true;
          lintResult = lintFicheV3(ficheContent);
        }
      } catch (refineErr) {
        console.warn('[Gemini API] Avertissement lors de la passe Self-Refine:', refineErr);
      }
    }

    res.json({
      success: true,
      ficheContent,
      tokensUsed,
      modelUsed: successfulModel,
      selfRefined,
      lintResult,
    });
  } catch (err: unknown) {
    console.error('Gemini extraction error:', err);
    const errMsg = err instanceof Error ? err.message : "Erreur lors de l'extraction Gemini";
    let statusCode = (err as any)?.status || (err as any)?.statusCode || 500;
    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('Quota') || errMsg.toLowerCase().includes('too many requests')) {
      statusCode = 429;
    } else if (errMsg.includes('404') || errMsg.toLowerCase().includes('not found')) {
      statusCode = 404;
    }
    res.status(statusCode).json({
      error: errMsg,
      statusCode,
    });
  }
}

app.post('/api/gemini/extract', handleGeminiExtraction);
app.post('/api/extract-gemini', handleGeminiExtraction);

// Hybrid Bridge Endpoint: Send Fiche or Consolidated Concept to Claude Code / Agent Bridge
app.post('/api/claude/bridge', async (req, res) => {
  const { ficheId, ficheContent, targetType = 'pinescript', anthropicKey } = req.body;
  if (!ficheContent || typeof ficheContent !== 'string') {
    return res.status(400).json({ error: 'Contenu de fiche manquant.' });
  }
  try {
    const { execFile } = await import('child_process');
    const { promisify } = await import('util');
    const execFileAsync = promisify(execFile);
    const fs = await import('fs');
    const pathMod = await import('path');

    const tmpDir = pathMod.join(__dirname, 'generated_bots');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const safeId = String(ficheId || 'CONCEPT').replace(/[^a-zA-Z0-9_-]/g, '_');
    const inputPath = pathMod.join(tmpDir, `${safeId}_spec.md`);
    fs.writeFileSync(inputPath, ficheContent, 'utf-8');

    const scriptPath = pathMod.join(__dirname, 'scripts', 'claude_agent_bridge.py');
    const args = [scriptPath, '--input', inputPath, '--target', String(targetType)];
    const env = {
      ...process.env,
      ...(anthropicKey ? { ANTHROPIC_API_KEY: String(anthropicKey).trim() } : {}),
    };

    const { stdout: output } = await execFileAsync('python', args, { cwd: __dirname, env, encoding: 'utf-8', timeout: 120000 });
    res.json({
      success: true,
      output,
      savedSpecPath: inputPath,
    });
  } catch (err: unknown) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Erreur lors de l’appel au pont Claude Codeur.',
    });
  }
});

// GitHub Repository Status Endpoint
app.get('/api/github/status', async (req, res) => {
  try {
    const { execFileSync } = await import('child_process');
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: __dirname }).toString().trim();
    const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: __dirname }).toString().trim();
    let remote = '';
    try {
      remote = execFileSync('git', ['config', '--get', 'remote.origin.url'], { cwd: __dirname }).toString().trim();
    } catch {}
    res.json({
      initialized: true,
      branch,
      commit,
      remoteUrl: remote.replace(/https:\/\/[^@]+@/, 'https://'),
    });
  } catch (err: unknown) {
    res.json({
      initialized: false,
      error: err instanceof Error ? err.message : 'Git non initialisé',
    });
  }
});

// GitHub Push Endpoint (hardened with execFileSync against shell injection)
app.post('/api/github/push', async (req, res) => {
  const { githubToken, repoName, branch = 'main', commitMessage = 'Sync from YouTube Video Extractor v4.0', fiches } = req.body;

  if (!githubToken || !repoName) {
    return res.status(400).json({ error: 'Token GitHub (PAT) et nom du repository requis.' });
  }

  const safeBranch = String(branch || 'main').trim();
  if (!/^[a-zA-Z0-9._/-]+$/.test(safeBranch)) {
    return res.status(400).json({ error: 'Nom de branche Git invalide.' });
  }

  try {
    const { execFileSync } = await import('child_process');
    const fs = await import('fs');
    const pathMod = await import('path');

    // 1. Verify GitHub token & get authenticated user
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${githubToken.trim()}`,
        'User-Agent': 'YouTube-Video-Extractor-v4',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      const errJson = await userRes.json().catch(() => ({}));
      return res.status(401).json({ error: `Token GitHub invalide ou expiré: ${errJson.message || userRes.statusText}` });
    }

    const userData = await userRes.json();
    const userLogin = userData.login;

    // Full target repo (owner/repo)
    let fullRepo = String(repoName).trim();
    if (!fullRepo.includes('/')) {
      fullRepo = `${userLogin}/${fullRepo}`;
    }
    if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(fullRepo)) {
      return res.status(400).json({ error: 'Nom de repository GitHub invalide.' });
    }

    // 2. Check if repo exists on GitHub, or create it
    const checkRepoRes = await fetch(`https://api.github.com/repos/${fullRepo}`, {
      headers: {
        'Authorization': `Bearer ${githubToken.trim()}`,
        'User-Agent': 'YouTube-Video-Extractor-v4',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (checkRepoRes.status === 404) {
      // Auto-create repository
      const repoShortName = fullRepo.split('/')[1];
      const createRepoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken.trim()}`,
          'User-Agent': 'YouTube-Video-Extractor-v4',
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          name: repoShortName,
          description: 'HugoFX ICT/SMC Knowledge Architecture Workbench - Fiches de Spécifications 10/10 et Algorithmes',
          private: false,
          auto_init: false,
        }),
      });

      if (!createRepoRes.ok) {
        const createErr = await createRepoRes.json().catch(() => ({}));
        return res.status(500).json({ error: `Impossible de créer le repository sur GitHub: ${createErr.message || createRepoRes.statusText}` });
      }
    }

    // 3. Export all in-memory fiches into fiches/ folder so they are committed
    if (fiches && typeof fiches === 'object') {
      const fichesDir = pathMod.join(__dirname, 'fiches');
      if (!fs.existsSync(fichesDir)) {
        fs.mkdirSync(fichesDir, { recursive: true });
      }
      for (const [vId, content] of Object.entries(fiches)) {
        const safeId = String(vId).replace(/[^a-zA-Z0-9_-]/g, '_');
        if (typeof content === 'string' && content.length > 0 && safeId) {
          const cleanFicheName = `HugoFX_Fiche_${safeId}.md`;
          fs.writeFileSync(pathMod.join(fichesDir, cleanFicheName), content, 'utf-8');
        }
      }
    }

    // Ensure fiches directory exists
    const fichesDir = pathMod.join(__dirname, 'fiches');
    if (!fs.existsSync(fichesDir)) {
      fs.mkdirSync(fichesDir, { recursive: true });
    }

    // 4. Git commit & push using execFileSync (zero shell interpolation)
    execFileSync('git', ['config', 'user.name', 'YouTube Video Extractor Studio'], { cwd: __dirname });
    execFileSync('git', ['config', 'user.email', String(userData.email || 'developer@youtube-video-extractor.local')], { cwd: __dirname });
    // Restrict git staging exclusively to fiches/ directory (mitigating secret leakage)
    execFileSync('git', ['add', 'fiches/'], { cwd: __dirname });

    const statusOutput = execFileSync('git', ['status', '--porcelain', 'fiches/'], { cwd: __dirname }).toString().trim();
    if (statusOutput.length > 0) {
      execFileSync('git', ['commit', '-m', String(commitMessage)], { cwd: __dirname });
    }

    // Remote push using authenticated URL with guaranteed cleanup in finally block
    try {
      execFileSync('git', ['remote', 'remove', 'origin'], { cwd: __dirname, stdio: 'ignore' });
    } catch {}

    const authRemoteUrl = `https://x-access-token:${githubToken.trim()}@github.com/${fullRepo}.git`;
    try {
      execFileSync('git', ['remote', 'add', 'origin', authRemoteUrl], { cwd: __dirname });
      execFileSync('git', ['branch', '-M', safeBranch], { cwd: __dirname });
      // Clean push without destructive --force
      execFileSync('git', ['push', '-u', 'origin', safeBranch], { cwd: __dirname, stdio: 'pipe' });
    } finally {
      // Guaranteed cleanup of authenticated URL even if push throws or network aborts (prevents PAT leak in .git/config)
      try {
        execFileSync('git', ['remote', 'set-url', 'origin', `https://github.com/${fullRepo}.git`], { cwd: __dirname });
      } catch {}
    }

    const latestCommit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: __dirname }).toString().trim();

    res.json({
      success: true,
      repoUrl: `https://github.com/${fullRepo}`,
      commitHash: latestCommit,
      branch: safeBranch,
      message: `Projet et fiches poussés avec succès sur https://github.com/${fullRepo} (branche ${safeBranch}) !`,
    });
  } catch (err: unknown) {
    console.error('GitHub push error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Erreur lors du push GitHub',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
