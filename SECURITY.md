# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.4.x   | :white_check_mark: |
| 3.0.x   | :white_check_mark: |
| < 3.0   | :x:                |

## API Key & Credential Hygiene

- **Zero Hardcoded Secrets**: `ITC-SMC-EXTRACTOR` enforces strict secret hygiene via `src/utils/apiKeyManager.ts` (verified by unit test `apiKeyManager never returns fake DEFAULT_PRO_KEY by default`).
- Never commit `.env` files, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, or OAuth tokens to version control.

## Reporting a Vulnerability

If you discover a security vulnerability, credential leak vector, or command-injection risk in `server.ts` or `scripts/claude_agent_bridge.py`, please report it privately via email to **yaochristyvan8@gmail.com** rather than opening a public issue. We will respond within 48 hours and publish a patched release.
