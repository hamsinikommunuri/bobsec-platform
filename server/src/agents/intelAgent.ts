import { ExtractedEntity, IntelligenceReport } from '../../../shared/types/index.js';
import { analyzeURL } from '../tools/urlIntel.js';
import { analyzePhone } from '../tools/phoneIntel.js';
import { analyzeUPI } from '../tools/upiIntel.js';

export interface IntelAgentResult {
  updatedEntities: ExtractedEntity[];
  intelligence: IntelligenceReport;
  durationMs: number;
  findings: string[];
}

export class IntelAgent {
  static analyzeEntities(entities: ExtractedEntity[]): IntelAgentResult {
    const start = Date.now();
    const findings: string[] = [];
    const sources: IntelligenceReport['sources'] = [];

    const updatedEntities: ExtractedEntity[] = entities.map((entity) => {
      if (entity.type === 'URL') {
        const urlIntel = analyzeURL(entity.value);
        sources.push({
          target: entity.value,
          source: urlIntel.source,
          status: urlIntel.status,
          details: urlIntel.flags.join('; ') || 'Domain syntax validated'
        });
        if (urlIntel.flags.length > 0) {
          findings.push(`URL Flag: ${urlIntel.domain} — ${urlIntel.flags[0]}`);
        }
        return {
          ...entity,
          status: urlIntel.status === 'suspicious' ? 'Suspicious' : 'Not verified',
          notes: urlIntel.flags.join(', ') || entity.notes
        };
      }

      if (entity.type === 'PHONE') {
        const phoneIntel = analyzePhone(entity.value);
        sources.push({
          target: entity.maskedValue,
          source: phoneIntel.source,
          status: phoneIntel.status,
          details: phoneIntel.flags.join('; ') || 'Telecom subscriber prefix heuristics evaluated'
        });
        if (phoneIntel.flags.length > 0) {
          findings.push(`Phone Flag: ${phoneIntel.flags[0]}`);
        }
        return {
          ...entity,
          status: phoneIntel.status === 'suspicious' ? 'Suspicious' : 'No known issue',
          notes: phoneIntel.flags.join(', ') || entity.notes
        };
      }

      if (entity.type === 'UPI') {
        const upiIntel = analyzeUPI(entity.value);
        sources.push({
          target: entity.maskedValue,
          source: upiIntel.source,
          status: upiIntel.status,
          details: upiIntel.flags.join('; ') || 'VPA structure and keywords parsed'
        });
        if (upiIntel.flags.length > 0) {
          findings.push(`UPI Flag: ${upiIntel.flags[0]}`);
        }
        return {
          ...entity,
          status: upiIntel.status === 'suspicious' ? 'Suspicious' : 'Not checked',
          notes: upiIntel.flags.join(', ') || entity.notes
        };
      }

      return entity;
    });

    if (sources.length === 0) {
      sources.push({
        target: 'N/A',
        source: 'local_heuristics',
        status: 'not_checked',
        details: 'No electronic endpoint indicators (URLs, VPAs, or phone numbers) detected in submitted text.'
      });
    }

    return {
      updatedEntities,
      intelligence: {
        liveChecksPerformed: false,
        sources
      },
      durationMs: Date.now() - start,
      findings
    };
  }
}
