/**
 * Helper to build a correct URL for assets in /public when deployed under a sub-path
 * (e.g. GitHub Pages). Works in dev + production.
 */
export const assetUrl = (relativePath: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = relativePath.replace(/^\/+/, '');
  return `${cleanBase}${cleanPath}`;
};
