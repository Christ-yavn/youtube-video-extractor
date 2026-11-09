# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 4.0.x   | :white_check_mark: |
| 3.4.x   | :white_check_mark: |
| < 3.4   | :x:                |

## Bring Your Own Keys (BYOK) & Credential Hygiene

- **Zero Hardcoded Secrets**: `YouTube Video Extractor` enforces strict credential isolation via [`src/utils/apiKeyManager.ts`](./src/utils/apiKeyManager.ts) (verified automatically in CI by the unit test `apiKeyManager never returns fake DEFAULT_PRO_KEY by default`).
- **Local-First Key Storage**: When users enter their `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, or personal Google Drive OAuth token in the Settings UI (`src/pages/Reglages.tsx`), those keys are stored exclusively in their local browser `localStorage` (`sm_extractor_user_api_key`, `sm_extractor_anthropic_api_key`, `sm_extractor_gdrive_token`).
- **Never Commit Secrets**: Never commit `.env` files, real Firebase API keys, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, or OAuth tokens to version control.

## Reporting a Vulnerability

If you discover a security vulnerability, credential leak vector, or command-injection risk in `server.ts` or `scripts/claude_agent_bridge.py`, please report it privately via email to **yaochristyvan8@gmail.com** rather than opening a public issue. We will respond within 48 hours and publish a patched release.
