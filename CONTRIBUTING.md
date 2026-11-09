# Contributing to YouTube Video Extractor

Thank you for your interest in contributing to **YouTube Video Extractor**! Our goal is to provide students, educators, and software engineers with a reliable, open-source compiler that turns long-form educational and technical YouTube videos into structured course handbooks, consolidated `MASTER_<CONCEPT>.md` textbooks, `.jsonl` datasets, and verified code using **Anthropic's Claude Code**.

---

## 1. Core Engineering Principles

Before opening a Pull Request, please make sure your changes follow our four core invariants (documented in [`AGENT.md`](./AGENT.md)):

1. **Universal Domain Support**: New features in the extraction pipeline, consolidator, or UI should work cleanly across all 4 domain profiles defined in [`src/utils/domainProfiles.ts`](./src/utils/domainProfiles.ts) (`UNIVERSAL_COURSE_COMPILER`, `SOFTWARE_AND_ALGORITHMS`, `STEM_AND_QUANT_SCIENCE`, and `MARKET_MICROSTRUCTURE_ICT`).
2. **Deterministic Linter Verification**: All specification templates and extraction changes must pass `lintFicheV3()` in [`src/utils/pipeline.ts`](./src/utils/pipeline.ts) with zero placeholders (`TODO`, `TBD`) and valid timestamp bounds.
3. **Executable Verification Fixtures**: Any new reference specification must include parseable JSON test fixtures (`Nominal`, `Rejected`, and `Boundary` cases) verified by `parseFixturesFromContent()`.
4. **Strict Secret Hygiene (BYOK)**: Never hardcode API keys, OAuth tokens, or cloud project credentials. Always read user keys through [`src/utils/apiKeyManager.ts`](./src/utils/apiKeyManager.ts) or environment variables.

---

## 2. Development Workflow

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Christ-yavn/youtube-video-extractor.git
   cd youtube-video-extractor
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the unit test suite (Node.js 22+)**:
   ```bash
   npm test
   ```
   All **38 unit tests** across `pipeline.test.ts`, `domainProfiles.test.ts`, `ictTaxonomy.test.ts`, and `driveHelpers.test.ts` must pass before submitting a Pull Request.
4. **Verify TypeScript types and production build**:
   ```bash
   npm run lint
   npm run build
   ```
5. **Test the Claude Code Compiler Bridge**:
   ```bash
   python scripts/claude_agent_bridge.py \
     --input "fiches/etalons/HugoFX_Fiche_ETALON_BPR_dg2-OsUXN60.md" \
     --target course-handbook
   ```

---

## 3. Submitting Pull Requests

- Use clear, conventional commit messages (`feat(domains): ...`, `fix(linter): ...`, `docs(readme): ...`).
- Add unit tests in `src/utils/*.test.ts` whenever you introduce a new domain profile, linter check, or parser helper.
- For quantitative validation or multi-agent research extensions, see our companion repository [`Christ-yavn/quant-pod`](https://github.com/Christ-yavn/quant-pod).
