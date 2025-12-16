// Lightweight stats helpers for assessment-style scoring.
// NOTE: This is NOT a clinical diagnostic engine.

export const clamp01 = (p: number, eps = 1e-4): number => Math.min(1 - eps, Math.max(eps, p));

/**
 * Approximation of the inverse standard normal CDF (a.k.a. probit).
 * Based on Peter John Acklam's rational approximation.
 * Returns z such that Phi(z) = p.
 */
export const normInv = (pRaw: number): number => {
  const p = clamp01(pRaw, 1e-10);

  // Coefficients in rational approximations.
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  // Break-points.
  const plow = 0.02425;
  const phigh = 1 - plow;

  let q: number;
  let r: number;

  if (p < plow) {
    // Lower region.
    q = Math.sqrt(-2 * Math.log(p));
    const num = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]);
    const den = ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    return num / den;
  }

  if (p <= phigh) {
    // Central region.
    q = p - 0.5;
    r = q * q;
    const num = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q;
    const den = (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    return num / den;
  }

  // Upper region.
  q = Math.sqrt(-2 * Math.log(1 - p));
  const num = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]);
  const den = ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  return -(num / den);
};

export const dPrime = (hitRate: number, falseAlarmRate: number): number => {
  const h = clamp01(hitRate);
  const f = clamp01(falseAlarmRate);
  return normInv(h) - normInv(f);
};

export const mean = (arr: number[]): number => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

export const median = (arr: number[]): number => {
  if (!arr.length) return 0;
  const xs = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2;
};

export const stdDev = (arr: number[]): number => {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const v = mean(arr.map((x) => (x - m) ** 2));
  return Math.sqrt(v);
};
