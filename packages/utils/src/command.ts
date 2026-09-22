/**
 * @skyra/utils — Command Search and Filtering
 *
 * Pure TypeScript deterministic search algorithm for command items.
 * Evaluates label, description, and keywords with scoring.
 * Zero external dependencies.
 */

export interface CommandLike {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  group?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ScoredCommand<T extends CommandLike> {
  item: T;
  score: number;
}

/**
 * Deterministic command search filter.
 * Returns filtered and sorted list of commands matching the query.
 *
 * Scoring rules:
 * - Exact label match: 100
 * - Label starts with query: 80
 * - Label contains word starting with query: 60
 * - Label contains query substring: 40
 * - Exact keyword match: 50
 * - Keyword starts with query: 35
 * - Description contains query: 20
 */
export function filterCommands<T extends CommandLike>(commands: T[], query: string): T[] {
  if (!commands || !Array.isArray(commands)) return [];

  const visibleCommands = commands.filter((c) => !c.hidden);
  const cleanQuery = (query || '').trim().toLowerCase();

  if (!cleanQuery) {
    return visibleCommands;
  }

  const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);

  const scored: ScoredCommand<T>[] = [];

  for (const cmd of visibleCommands) {
    const labelLower = (cmd.label || '').toLowerCase();
    const descLower = (cmd.description || '').toLowerCase();
    const keywordsLower = (cmd.keywords || []).map((k) => k.toLowerCase());

    let totalScore = 0;
    let allTermsMatch = true;

    for (const term of queryTerms) {
      let termScore = 0;

      // Label scoring
      if (labelLower === term) {
        termScore = Math.max(termScore, 100);
      } else if (labelLower.startsWith(term)) {
        termScore = Math.max(termScore, 80);
      } else if (labelLower.includes(` ${term}`)) {
        termScore = Math.max(termScore, 60);
      } else if (labelLower.includes(term)) {
        termScore = Math.max(termScore, 40);
      }

      // Keyword scoring
      for (const kw of keywordsLower) {
        if (kw === term) {
          termScore = Math.max(termScore, 50);
        } else if (kw.startsWith(term)) {
          termScore = Math.max(termScore, 35);
        } else if (kw.includes(term)) {
          termScore = Math.max(termScore, 25);
        }
      }

      // Description scoring
      if (descLower.includes(term)) {
        termScore = Math.max(termScore, 20);
      }

      if (termScore === 0) {
        allTermsMatch = false;
        break;
      }

      totalScore += termScore;
    }

    if (allTermsMatch && totalScore > 0) {
      scored.push({ item: cmd, score: totalScore });
    }
  }

  // Sort by score descending, then retain stable original position
  return scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);
}
