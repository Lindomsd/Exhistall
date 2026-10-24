import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** Top-level guard so a render error shows a friendly screen instead of a blank page. */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Exhistall crashed:', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <main className="market-canvas flex min-h-screen items-center justify-center px-4 py-20 text-white">
        <div className="market-grain mx-auto max-w-lg text-center">
          <p className="market-display-font text-4xl font-bold">The market hit a snag</p>
          <p className="mt-3 text-blue-100">
            Something unexpected happened while loading this page. Your data is safe — try again.
          </p>
          <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-[#061738] p-3 text-left text-xs text-red-200">
            {error.message}
          </pre>
          <button
            type="button"
            onClick={this.handleReset}
            className="market-chip mt-6 rounded-full bg-brand-gold px-6 py-3 font-extrabold text-brand-blue transition hover:bg-yellow-300"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }
}
