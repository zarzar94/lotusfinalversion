/**
 * RTL/LTR Layout Utilities
 * Reduces repetitive ternary operators for RTL-aware positioning
 */

import type { CSSProperties } from 'react';

/**
 * Get the start position property name based on direction
 * RTL: left, LTR: right
 */
export function inlineStart(isRtl: boolean): 'left' | 'right' {
  return isRtl ? 'left' : 'right';
}

/**
 * Get the end position property name based on direction
 * RTL: right, LTR: left
 */
export function inlineEnd(isRtl: boolean): 'left' | 'right' {
  return isRtl ? 'right' : 'left';
}

/**
 * Create position styles for RTL/LTR layouts
 * Places element at the start of the inline axis
 */
export function positionInlineStart(
  isRtl: boolean,
  value: number | string
): CSSProperties {
  return isRtl
    ? { left: value, right: 'auto' }
    : { right: value, left: 'auto' };
}

/**
 * Create position styles for RTL/LTR layouts
 * Places element at the end of the inline axis
 */
export function positionInlineEnd(
  isRtl: boolean,
  value: number | string
): CSSProperties {
  return isRtl
    ? { right: value, left: 'auto' }
    : { left: value, right: 'auto' };
}

/**
 * Get margin/padding inline start
 */
export function marginInlineStart(isRtl: boolean): 'marginLeft' | 'marginRight' {
  return isRtl ? 'marginLeft' : 'marginRight';
}

/**
 * Get margin/padding inline end
 */
export function marginInlineEnd(isRtl: boolean): 'marginLeft' | 'marginRight' {
  return isRtl ? 'marginRight' : 'marginLeft';
}

/**
 * Create translateX value adjusted for RTL
 */
export function translateX(isRtl: boolean, value: number | string): string {
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  const unit = typeof value === 'string' && value.includes('%') ? '%' : 'px';
  return `translateX(${isRtl ? numValue : -numValue}${unit})`;
}

/**
 * Get text alignment based on direction
 */
export function textAlign(isRtl: boolean, align: 'start' | 'end'): 'left' | 'right' {
  if (align === 'start') {
    return isRtl ? 'right' : 'left';
  }
  return isRtl ? 'left' : 'right';
}

/**
 * Get flex direction for row that respects RTL
 */
export function flexRowDirection(isRtl: boolean, reverse = false): CSSProperties['flexDirection'] {
  if (reverse) {
    return isRtl ? 'row' : 'row-reverse';
  }
  return isRtl ? 'row-reverse' : 'row';
}
