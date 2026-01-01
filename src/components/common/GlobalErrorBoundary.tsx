"use client";

import { Component, ReactNode, ErrorInfo } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export default class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[GlobalErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white border rounded-lg p-6 text-center max-w-md w-full">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-gray-600 mt-2">
              Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-black text-white rounded"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
