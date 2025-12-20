/**
 * Search utilities for Arabic/English text normalization and query parsing
 * Extracted from SlideViewer for reuse across components
 */

/**
 * Query result types for slide/item ID searches
 */
export type IdQuery =
  | { kind: 'ids'; ids: number[] }
  | { kind: 'range'; from: number; to: number };

/**
 * Normalize Arabic-Indic and Persian digits to ASCII
 */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 0x06F0));
}

/**
 * Parse an ID query string (supports single IDs, ranges, lists)
 * Examples: "5", "#5", "1-10", "1, 2, 3", "1 2 3"
 */
export function parseIdQuery(raw: string): IdQuery | null {
  const q = normalizeDigits(raw).trim();
  if (!q) return null;

  // Single ID: "5" or "#5"
  const single = q.match(/^#?\s*(\d{1,4})\s*$/);
  if (single) {
    return { kind: 'ids', ids: [Number(single[1])] };
  }

  // Range: "1-10" or "#1-#10"
  const range = q.match(/^#?\s*(\d{1,4})\s*[-–—]\s*#?\s*(\d{1,4})\s*$/);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    return { kind: 'range', from: Math.min(a, b), to: Math.max(a, b) };
  }

  // Comma-separated list: "1, 2, 3" or "1،2،3" (Arabic comma)
  const list = q.match(/^\s*#?\s*\d+(?:\s*[,،]\s*#?\s*\d+)+\s*$/);
  if (list) {
    const ids = q
      .split(/[,،]/)
      .map((part) => part.replace(/[^\d]/g, ''))
      .map((part) => Number(part))
      .filter((n) => Number.isFinite(n));
    if (ids.length) return { kind: 'ids', ids };
  }

  // Space-separated list: "1 2 3"
  const spaceList = q.match(/^\s*#?\s*\d+(?:\s+#?\s*\d+)+\s*$/);
  if (spaceList) {
    const ids = q
      .split(/\s+/)
      .map((part) => part.replace(/[^\d]/g, ''))
      .map((part) => Number(part))
      .filter((n) => Number.isFinite(n));
    if (ids.length) return { kind: 'ids', ids };
  }

  return null;
}

/**
 * Normalize text for fuzzy search (handles Arabic diacritics, Latin accents, etc.)
 */
export function normalizeForSearch(value: string): string {
  return normalizeDigits(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip Latin combining marks
    .replace(/[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // strip Arabic diacritics + tatweel
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize a search query (handles quoted phrases and OR groups with |)
 */
export function tokenizeQuery(raw: string): string[] {
  const tokens: string[] = [];
  const re = /"([^"]+)"|'([^']+)'|(\S+)/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(raw)) !== null) {
    const token = match[1] ?? match[2] ?? match[3] ?? '';
    if (!token) continue;

    // Allow OR groups using pipes: apd|hyperacusis
    if (token.includes('|')) {
      const parts = token.split('|');
      parts.forEach((part, idx) => {
        if (part) tokens.push(part);
        if (idx < parts.length - 1) tokens.push('|');
      });
      continue;
    }

    tokens.push(token);
  }
  return tokens;
}

/**
 * Parse search query into groups (split by OR |)
 */
export function parseSearchGroups(raw: string): string[][] {
  const rawTokens = tokenizeQuery(raw);
  const groups: string[][] = [];
  let current: string[] = [];

  for (const token of rawTokens) {
    if (token === '|') {
      if (current.length) groups.push(current);
      current = [];
      continue;
    }

    const normalized = normalizeForSearch(token.replace(/^#+/, ''));
    if (normalized) current.push(normalized);
  }

  if (current.length) groups.push(current);
  return groups;
}

/**
 * Check if haystack contains all tokens
 */
export function matchesAllTokens(haystack: string, tokens: string[]): boolean {
  return tokens.every((token) => haystack.includes(token));
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Load an image element with proper error handling
 */
export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
