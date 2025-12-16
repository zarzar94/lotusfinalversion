import { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  threshold?: number;
  className?: string;
  scale?: boolean;
  scaleFrom?: number;
  blur?: boolean;
  blurAmount?: number;
  easing?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 600,
  direction = 'up',
  distance = 30,
  threshold = 0.1,
  className = '',
  scale = false,
  scaleFrom = 0.95,
  blur = false,
  blurAmount = 10,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    const transforms: string[] = [];

    if (!isVisible) {
      switch (direction) {
        case 'up':
          transforms.push(`translateY(${distance}px)`);
          break;
        case 'down':
          transforms.push(`translateY(-${distance}px)`);
          break;
        case 'left':
          transforms.push(`translateX(${distance}px)`);
          break;
        case 'right':
          transforms.push(`translateX(-${distance}px)`);
          break;
        case 'none':
        default:
          break;
      }

      if (scale) {
        transforms.push(`scale(${scaleFrom})`);
      }
    } else {
      transforms.push('translateY(0) translateX(0)');
      if (scale) {
        transforms.push('scale(1)');
      }
    }

    return transforms.join(' ') || 'none';
  };

  const getFilter = () => {
    if (!blur) return 'none';
    return isVisible ? 'blur(0px)' : `blur(${blurAmount}px)`;
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: getFilter(),
        transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms, filter ${duration}ms ${easing} ${delay}ms`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}
