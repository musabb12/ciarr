'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[AdminErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) {
        return this.props.fallback(error, this.reset);
      }
      return (
        <div
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-slate-100 font-arabic-modern"
          dir="rtl"
        >
          <h3 className="font-semibold text-red-400 mb-2">خطأ في التحميل</h3>
          <p className="text-sm text-slate-300 mb-2 font-mono break-all">{error.message}</p>
          <button
            type="button"
            onClick={this.reset}
            className="text-sm px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
