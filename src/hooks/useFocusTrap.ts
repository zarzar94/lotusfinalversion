/**
 * @fileoverview Focus trap hook for accessible modal and dialog components.
 *
 * This module provides a React hook that implements focus trapping, an essential
 * accessibility feature for modal dialogs, popovers, and other overlay UI patterns.
 * Focus trapping ensures keyboard users cannot accidentally Tab out of a modal
 * into the content behind it.
 *
 * ## WCAG Compliance
 *
 * This hook helps meet the following WCAG 2.1 success criteria:
 * - **2.1.2 No Keyboard Trap**: Users can navigate away when modal closes
 * - **2.4.3 Focus Order**: Focus moves in logical, predictable order
 * - **3.2.1 On Focus**: No unexpected context changes
 *
 * ## How Focus Trapping Works
 *
 * 1. When activated, saves the currently focused element
 * 2. Focuses the first focusable element inside the container
 * 3. Intercepts Tab keypresses to cycle through focusable elements
 * 4. Shift+Tab from first element wraps to last element
 * 5. Tab from last element wraps to first element
 * 6. On deactivation, restores focus to the originally focused element
 *
 * @module hooks/useFocusTrap
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */

import { useEffect, useRef } from 'react';

/**
 * CSS selector string that matches all focusable interactive elements.
 *
 * This selector finds elements that can receive keyboard focus, excluding:
 * - Disabled form controls
 * - Elements with `tabindex="-1"` (programmatically focusable only)
 * - Links without href attributes
 *
 * @constant
 * @internal
 */
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Traps keyboard focus within a container element for accessibility.
 *
 * When `isActive` is true, this hook:
 * 1. Saves the currently focused element
 * 2. Focuses the first focusable element in the container
 * 3. Prevents Tab from leaving the container (wraps focus)
 * 4. Restores focus to the original element when deactivated
 *
 * @typeParam T - The type of HTML element for the container ref
 * @param isActive - Whether focus trapping should be active.
 *   Typically bound to modal open/close state.
 * @returns A ref object to attach to the container element
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose, children }) {
 *   const containerRef = useFocusTrap<HTMLDivElement>(isOpen);
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div className="modal-overlay" onClick={onClose}>
 *       <div
 *         ref={containerRef}
 *         className="modal-content"
 *         role="dialog"
 *         aria-modal="true"
 *         onClick={(e) => e.stopPropagation()}
 *       >
 *         <button onClick={onClose}>Close</button>
 *         {children}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom element type
 * function Dropdown({ isOpen }) {
 *   const menuRef = useFocusTrap<HTMLUListElement>(isOpen);
 *
 *   return (
 *     <ul ref={menuRef} role="menu">
 *       <li><button>Option 1</button></li>
 *       <li><button>Option 2</button></li>
 *     </ul>
 *   );
 * }
 * ```
 *
 * @remarks
 * - The container must have at least one focusable element, otherwise
 *   keyboard users may get stuck
 * - Combine with `aria-modal="true"` and `role="dialog"` for screen readers
 * - Consider also handling the Escape key to close the modal
 * - For nested modals, only the innermost focus trap should be active
 *
 * @see FOCUSABLE_SELECTORS for which elements are considered focusable
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Save previously focused element
    previousActiveElement.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Focus the first focusable element
    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previously focused element
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}

export default useFocusTrap;
