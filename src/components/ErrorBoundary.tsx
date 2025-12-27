import { Component, type ReactNode, type ErrorInfo } from 'react';
import { styles, brandPink } from './styles';
import { renderLabIcon } from './icons/index';
import LabButton from './labui/LabButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ ...styles.sectionCard, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {renderLabIcon('⚠️', { size: 36, tone: 'warning' })}
          </div>
          <h3 style={{ ...styles.h3, color: brandPink }}>حدث خطأ غير متوقع</h3>
          <p style={styles.muted}>
            يرجى تحديث الصفحة والمحاولة مرة أخرى. إذا استمرت المشكلة، تواصل معنا.
          </p>
          <LabButton variant="primary" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>
            تحديث الصفحة
          </LabButton>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
