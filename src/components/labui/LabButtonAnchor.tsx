import type { AnchorHTMLAttributes, CSSProperties, MouseEvent, ReactNode } from 'react';

import { buildLabButtonStyles, type LabButtonSize, type LabButtonVariant } from './labButtonStyles';

type LabButtonAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: LabButtonVariant;
  size?: LabButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
};

export default function LabButtonAnchor({
  href,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  className,
  style,
  disabled,
  onClick,
  target,
  rel,
  tabIndex,
  children,
  ...rest
}: LabButtonAnchorProps) {
  const isDisabled = disabled || loading;
  const isExternal = /^https?:\/\//i.test(href);
  const mergedStyle = buildLabButtonStyles({
    variant,
    size,
    fullWidth,
    style: {
      ...(isDisabled ? { pointerEvents: 'none' } : null),
      ...style,
    },
  });

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const resolvedTarget = target ?? (isExternal ? '_blank' : undefined);
  const resolvedRel = rel ?? (isExternal ? 'noreferrer' : undefined);

  return (
    <a
      href={href}
      className={['lab-btn', className].filter(Boolean).join(' ')}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : tabIndex}
      target={resolvedTarget}
      rel={resolvedRel}
      style={mergedStyle}
      onClick={handleClick}
      {...rest}
    >
      <span className="lab-btn__content">
        {loading ? (
          <span className="lab-btn__spinner" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="lab-btn__icon" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        {children}
        {!loading && rightIcon ? (
          <span className="lab-btn__icon" aria-hidden="true">
            {rightIcon}
          </span>
        ) : null}
      </span>
    </a>
  );
}
