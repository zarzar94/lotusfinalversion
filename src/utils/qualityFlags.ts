import type { SessionQualityFlag } from '../types/moduleMetrics';

export const normalizeQualityFlag = (flag: unknown): SessionQualityFlag | null => {
  if (typeof flag === 'string') {
    const trimmed = flag.trim();
    if (!trimmed) return null;

    return {
      code: trimmed,
      label: trimmed,
      severity: 'warning',
    };
  }

  if (flag && typeof flag === 'object') {
    const raw = flag as Record<string, unknown>;
    const code = typeof raw.code === 'string'
      ? raw.code
      : typeof raw.type === 'string'
        ? raw.type
        : typeof raw.flag === 'string'
          ? raw.flag
          : undefined;
    const label = typeof raw.label === 'string'
      ? raw.label
      : typeof raw.title === 'string'
        ? raw.title
        : undefined;
    const description = typeof raw.description === 'string'
      ? raw.description
      : typeof raw.detail === 'string'
        ? raw.detail
        : undefined;
    const severity = raw.severity === 'critical' || raw.severity === 'info' || raw.severity === 'warning'
      ? raw.severity
      : undefined;

    if (code || label || description) {
      return {
        code: code ?? 'quality_flag',
        label,
        description,
        severity: severity ?? 'warning',
      };
    }
  }

  return null;
};

export const normalizeQualityFlagCollection = (
  value: unknown,
): SessionQualityFlag[] | undefined => {
  if (!Array.isArray(value)) {
    const single = normalizeQualityFlag(value);
    return single ? [single] : undefined;
  }

  const flags = value
    .map((flag) => normalizeQualityFlag(flag))
    .filter((flag): flag is SessionQualityFlag => Boolean(flag));

  return flags.length ? flags : undefined;
};
