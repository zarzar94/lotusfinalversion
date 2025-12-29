import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { colors, radius, shadows, spacing, typography } from '../styles';
import LabButton from './LabButton';

type SignatureCaptureProps = {
  value: string | null;
  onChange: (next: string | null) => void;
  label?: string;
  helper?: string;
  clearLabel?: string;
  savedLabel?: string;
  height?: number;
  disabled?: boolean;
};

const canvasShell: CSSProperties = {
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.lg,
  background: colors.surface.card,
  boxShadow: shadows.lg,
  padding: spacing[2],
};

export default function SignatureCapture({
  value,
  onChange,
  label,
  helper,
  clearLabel = 'Clear',
  savedLabel = 'Signature saved',
  height = 160,
  disabled = false,
}: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const hasInkRef = useRef(Boolean(value));
  const [hasInk, setHasInk] = useState(Boolean(value));

  useEffect(() => {
    hasInkRef.current = Boolean(value);
    setHasInk(Boolean(value));
  }, [value]);

  const syncCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colors.text.primary;
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, rect.width, rect.height);
    if (value) {
      const image = new Image();
      image.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(image, 0, 0, rect.width, rect.height);
      };
      image.src = value;
    }
  }, [value]);

  useEffect(() => {
    syncCanvas();
    window.addEventListener('resize', syncCanvas);
    return () => window.removeEventListener('resize', syncCanvas);
  }, [syncCanvas]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const point = getPoint(event);
    if (!canvas || !point) return;
    canvas.setPointerCapture(event.pointerId);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const point = getPoint(event);
    if (!canvas || !point) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    if (!hasInkRef.current) {
      hasInkRef.current = true;
      setHasInk(true);
    }
  };

  const finalizeStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.releasePointerCapture(event.pointerId);
    if (hasInkRef.current) {
      onChange(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    hasInkRef.current = false;
    setHasInk(false);
    onChange(null);
  };

  return (
    <div style={{ display: 'grid', gap: spacing[2] }}>
      {label ? (
        <div style={{ fontWeight: typography.weight.bold, color: colors.text.primary }}>
          {label}
        </div>
      ) : null}
      {helper ? (
        <div style={{ fontSize: typography.size.sm, color: colors.text.muted }}>
          {helper}
        </div>
      ) : null}
      <div style={canvasShell}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height,
            display: 'block',
            touchAction: 'none',
            cursor: disabled ? 'not-allowed' : 'crosshair',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finalizeStroke}
          onPointerLeave={finalizeStroke}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
        <LabButton size="sm" variant="ghost" onClick={clearCanvas} disabled={disabled || (!hasInk && !value)}>
          {clearLabel}
        </LabButton>
        {value ? (
          <span style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
            {savedLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
