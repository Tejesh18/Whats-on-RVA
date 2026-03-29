import { Component } from 'react';

/**
 * Surfaces React render errors instead of a blank screen (common after bad deploys or data edge cases).
 */
export default class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error);
      return (
        <div className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-800">
          <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="font-display text-xl font-bold text-red-900">Something went wrong</h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              The app hit an error while rendering. This is usually fixed by refreshing or redeploying after a code fix.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-50 p-3 text-xs text-red-800">{msg}</pre>
            <button
              type="button"
              className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
