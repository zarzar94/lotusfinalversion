import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import { buildLabButtonStyles, type LabButtonSize, type LabButtonVariant } from './labButtonStyles';

type LabButtonLinkProps = Omit<LinkProps, 'to'> & {
  to: LinkProps['to'];
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

export default function LabButtonLink({
  to,
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
  tabIndex,
  children,
  ...rest
}: LabButtonLinkProps) {
  const isDisabled = disabled || loading;
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

  return (
    <Link
      to={to}
      className={['lab-btn', className].filter(Boolean).join(' ')}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : tabIndex}
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
    </Link>
  );
}
