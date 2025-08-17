import React, { type ReactNode } from 'react';
import styles from './error-boundary.component.module.css';
import CustomButton from '../ui/custom-button/custom-button.tsx';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <CustomButton onClick={this.handleReset}>Try Again</CustomButton>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
