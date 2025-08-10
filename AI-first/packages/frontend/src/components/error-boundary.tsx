"use client";

import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: unknown };

export class RootErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error("RootErrorBoundary caught error", error, errorInfo);
  }

  handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-dvh place-items-center p-6">
          <div className="max-w-lg rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center shadow-glow backdrop-blur-md">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm">An unexpected error occurred while rendering.</p>
            <div className="mt-4 flex justify-center">
              <button
                className="rounded-md border border-white/40 bg-black/90 px-4 py-2 text-white transition hover:bg-black dark:border-white/10 dark:bg-white/10"
                onClick={this.handleReload}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


