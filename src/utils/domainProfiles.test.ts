import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DOMAIN_PROFILES,
  getDomainProfile,
  listDomainProfiles,
  classifyVideoTopicByDomain,
  buildUniversalExtractionPrompt,
} from './domainProfiles.ts';

describe('Universal Domain Profiles (v4.0)', () => {
  it('exposes all 4 universal compilation domain profiles', () => {
    const profiles = listDomainProfiles();
    assert.equal(profiles.length, 4);
    assert.ok(DOMAIN_PROFILES.UNIVERSAL_COURSE_COMPILER);
    assert.ok(DOMAIN_PROFILES.SOFTWARE_AND_ALGORITHMS);
    assert.ok(DOMAIN_PROFILES.STEM_AND_QUANT_SCIENCE);
    assert.ok(DOMAIN_PROFILES.MARKET_MICROSTRUCTURE_ICT);
  });

  it('defaults to UNIVERSAL_COURSE_COMPILER when domainId is omitted or unknown', () => {
    const fallback = getDomainProfile(undefined);
    assert.equal(fallback.id, 'UNIVERSAL_COURSE_COMPILER');
    assert.equal(fallback.partASections.length, 8);
    assert.ok(fallback.supportedTargets.includes('course-handbook'));
    assert.ok(fallback.supportedTargets.includes('jsonl-dataset'));
  });

  it('classifies software engineering and AI agent videos accurately', () => {
    const res = classifyVideoTopicByDomain(
      'Building Autonomous AI Agents with Claude Code and RAG Compilers',
      'Deep dive into LLM agent architecture and prompt compilation workflows',
      'SOFTWARE_AND_ALGORITHMS'
    );
    assert.equal(res.categoryId, 'AI_AGENTS_LLM');
    assert.ok(res.matchedKeywords.includes('agent'));
    assert.ok(res.matchedKeywords.includes('claude'));
  });

  it('classifies STEM and quantitative lectures accurately', () => {
    const res = classifyVideoTopicByDomain(
      'Lecture 14: Stochastic Calculus, Ito Lemma & Volatility Diffusion',
      'University graduate course on continuous-time stochastic processes',
      'STEM_AND_QUANT_SCIENCE'
    );
    assert.equal(res.categoryId, 'STOCHASTIC_QUANT');
    assert.ok(res.matchedKeywords.includes('stochastic'));
  });

  it('builds a deterministic universal extraction prompt with dual FSMs and 8 sections', () => {
    const prompt = buildUniversalExtractionPrompt({
      domainId: 'SOFTWARE_AND_ALGORITHMS',
      channelName: 'MIT OpenCourseWare / Systems Engineering',
      videoTitle: 'Distributed Consensus & State Machine Replication',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sliceIndex: 1,
      totalSlices: 2,
      startTimestamp: '00:00',
      endTimestamp: '35:00',
    });

    assert.match(prompt, /SOFTWARE_AND_ALGORITHMS/);
    assert.match(prompt, /COMPONENT_STATE_FSM/);
    assert.match(prompt, /EXECUTION_PIPELINE_FSM/);
    assert.match(prompt, /Tranche 1\/2/);
  });
});
