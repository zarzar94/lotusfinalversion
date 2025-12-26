import { useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { useFocusTrap } from '../../hooks/useFocusTrap';
import { colors, labTech, radius, shadows, spacing, typography } from '../styles';

type LabModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
  style?: CSSProperties;
};

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(5,6,13,0.85)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing[4],
  zIndex: 40,
};

const modalStyle: CSSProperties = {
  width: '100%',
  maxWidth: 960,
  maxHeight: '88vh',
  overflow: 'auto',
  background: labTech.backgrounds.card,
  borderRadius: radius['2xl'],
  border: `1px solid ${colors.border.emphasis}`,
  boxShadow: shadows['2xl'],
  padding: spacing[5],
  position: 'relative',
};

export default function LabModal({
  open,
  onClose,
  children,
  title,
  ariaLabel,
  style,
}: LabModalProps) {
  const containerRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title ?? 'Dialog'}
        onClick={(event) => event.stopPropagation()}
        style={{ ...modalStyle, ...style }}
      >
        {title ? (
          <div style={{ marginBottom: spacing[4] }}>
            <div
              style={{
                fontSize: typography.size.lg,
                fontWeight: typography.weight.extrabold,
                color: colors.text.primary,
              }}
            >
              {title}
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
