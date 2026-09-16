import { createRequire } from 'node:module';
import { AnalysisResult, AnalysisSummaryItem, UserFeedback } from '../../../shared/types/index.js';
import { IAnalysisRepository, AnalysisStats } from './analysisRepository.js';
import { logger } from '../utils/logger.js';

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite');

export class SqliteAnalysisRepository implements IAnalysisRepository {
  private db: any;

  constructor(dbPath = process.env.VERCEL ? '/tmp/bobsec_data.sqlite' : './bobsec_data.sqlite') {
    try {
      this.db = new DatabaseSync(dbPath);
    } catch (err) {
      logger.warn(`Failed to open SQLite database at ${dbPath}, falling back to :memory:: ${err}`);
      try {
        this.db = new DatabaseSync(':memory:');
      } catch (memErr) {
        logger.error(`DatabaseSync unsupported in this runtime: ${memErr}`);
        this.db = null;
      }
    }
    if (this.db) {
      this.initTables();
    }
  }

  private initTables(): void {
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS analyses (
          id TEXT PRIMARY KEY,
          created_at TEXT NOT NULL,
          input_type TEXT NOT NULL,
          short_text TEXT NOT NULL,
          score INTEGER NOT NULL,
          level TEXT NOT NULL,
          category TEXT NOT NULL,
          category_label TEXT NOT NULL,
          report_hash TEXT NOT NULL,
          full_json TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses (created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_analyses_level ON analyses (level);
        CREATE INDEX IF NOT EXISTS idx_analyses_category ON analyses (category);

        CREATE TABLE IF NOT EXISTS feedback (
          analysis_id TEXT PRIMARY KEY,
          rating TEXT NOT NULL,
          comment TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS rule_suggestions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          analysis_id TEXT NOT NULL,
          suggested_by TEXT NOT NULL,
          suggestion_json TEXT NOT NULL,
          status TEXT DEFAULT 'PENDING_REVIEW',
          created_at TEXT NOT NULL
        );
      `);
      logger.info('SQLite analysis tables initialized successfully');
    } catch (err) {
      logger.error('Failed to initialize SQLite tables', err);
      throw err;
    }
  }

  async save(analysis: AnalysisResult): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO analyses (
        id, created_at, input_type, short_text, score, level, category, category_label, report_hash, full_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const shortText = analysis.input.sanitizedText.slice(0, 120);
    const reportHash = analysis.metadata.reportHash || '0x' + analysis.id;

    stmt.run(
      analysis.id,
      analysis.createdAt,
      analysis.input.type,
      shortText,
      analysis.verdict.score,
      analysis.verdict.level,
      analysis.verdict.category,
      analysis.verdict.categoryLabel,
      reportHash,
      JSON.stringify(analysis)
    );
  }

  async getById(id: string): Promise<AnalysisResult | null> {
    const stmt = this.db.prepare(`SELECT full_json FROM analyses WHERE id = ?`);
    const row = stmt.get(id) as { full_json: string } | undefined;
    if (!row) return null;
    return JSON.parse(row.full_json) as AnalysisResult;
  }

  async list(filter?: { search?: string; level?: string }): Promise<AnalysisSummaryItem[]> {
    let query = `
      SELECT id, created_at, input_type, short_text, score, level, category, category_label, report_hash
      FROM analyses
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (filter?.level && filter.level !== 'all') {
      const levelMap: Record<string, string[]> = {
        high: ['High Risk', 'Likely Scam'],
        caution: ['Caution', 'Suspicious'],
        clear: ['Safe', 'Low Risk', 'Unable to Verify']
      };
      const matchingLevels = levelMap[filter.level.toLowerCase()];
      if (matchingLevels && matchingLevels.length > 0) {
        const placeholders = matchingLevels.map(() => '?').join(',');
        query += ` AND level IN (${placeholders})`;
        params.push(...matchingLevels);
      }
    }

    if (filter?.search && filter.search.trim().length > 0) {
      query += ` AND (short_text LIKE ? OR id LIKE ? OR category_label LIKE ?)`;
      const searchWildcard = `%${filter.search.trim()}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard);
    }

    query += ` ORDER BY created_at DESC LIMIT 100`;

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as Array<{
      id: string;
      created_at: string;
      input_type: string;
      short_text: string;
      score: number;
      level: string;
      category: string;
      category_label: string;
      report_hash: string;
    }>;

    return rows.map((r) => ({
      id: r.id,
      createdAt: r.created_at,
      inputType: r.input_type as any,
      shortText: r.short_text,
      score: r.score,
      level: r.level as any,
      category: r.category as any,
      categoryLabel: r.category_label,
      reportHash: r.report_hash
    }));
  }

  async delete(id: string): Promise<boolean> {
    const stmt = this.db.prepare(`DELETE FROM analyses WHERE id = ?`);
    const result = stmt.run(id);
    return (result.changes ?? 0) > 0;
  }

  async clearAll(): Promise<void> {
    this.db.exec(`DELETE FROM feedback; DELETE FROM analyses;`);
  }

  async saveFeedback(feedback: UserFeedback): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO feedback (analysis_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    stmt.run(feedback.analysisId, feedback.rating, feedback.comment || null, now);

    // If marked incorrect, create a pending rule suggestion record for human review
    if (feedback.rating === 'INCORRECT') {
      const suggestStmt = this.db.prepare(`
        INSERT INTO rule_suggestions (analysis_id, suggested_by, suggestion_json, created_at)
        VALUES (?, ?, ?, ?)
      `);
      suggestStmt.run(
        feedback.analysisId,
        'user_feedback',
        JSON.stringify({ note: feedback.comment || 'Flagged incorrect by user' }),
        now
      );
    }
  }

  async getFeedback(analysisId: string): Promise<UserFeedback | null> {
    const stmt = this.db.prepare(`SELECT * FROM feedback WHERE analysis_id = ?`);
    const row = stmt.get(analysisId) as { analysis_id: string; rating: string; comment?: string; created_at: string } | undefined;
    if (!row) return null;
    return {
      analysisId: row.analysis_id,
      rating: row.rating as any,
      comment: row.comment || undefined,
      createdAt: row.created_at
    };
  }

  async getStats(): Promise<AnalysisStats> {
    const totalRow = this.db.prepare(`SELECT COUNT(*) as count FROM analyses`).get() as { count: number };
    const highRow = this.db
      .prepare(`SELECT COUNT(*) as count FROM analyses WHERE level IN ('High Risk', 'Likely Scam')`)
      .get() as { count: number };
    const cautionRow = this.db
      .prepare(`SELECT COUNT(*) as count FROM analyses WHERE level IN ('Caution', 'Suspicious')`)
      .get() as { count: number };
    const clearRow = this.db
      .prepare(`SELECT COUNT(*) as count FROM analyses WHERE level IN ('Safe', 'Low Risk', 'Unable to Verify')`)
      .get() as { count: number };

    const catRows = this.db
      .prepare(`SELECT category, COUNT(*) as count FROM analyses GROUP BY category`)
      .all() as Array<{ category: string; count: number }>;

    const categoryBreakdown: Record<string, number> = {};
    for (const row of catRows) {
      categoryBreakdown[row.category] = row.count;
    }

    return {
      total: totalRow.count,
      highRisk: highRow.count,
      caution: cautionRow.count,
      clear: clearRow.count,
      categoryBreakdown
    };
  }
}
