import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Error inesperado en la mesa de juego.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary capturó un fallo:', error, info);
  }

  handleRecover = () => {
    this.setState({ hasError: false, message: '' });
  };

  handleHardReset = () => {
    try {
      localStorage.removeItem('pecados_de_la_carne_save_v1');
      localStorage.removeItem('pecados_de_la_carne_save_v2');
    } catch {
      // ignore storage failure
    }
    this.setState({ hasError: false, message: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09080c] text-[#ece3d5] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-[#d43750]/60 bg-[#120f17] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#ff8fa0]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h1 className="font-serif-display text-2xl font-semibold text-[#ece3d5]">
                Interrupción en la Crónica
              </h1>
            </div>
            <p className="text-sm text-[#d6cbb9] leading-relaxed">
              Se produjo un error inesperado en la interfaz. Puedes intentar
              reconstruir la vista o reiniciar la sesión guardada si el estado
              quedó corrupto.
            </p>
            <div className="p-3 rounded bg-[#09080c] border border-[rgba(216,198,174,0.14)] font-mono-tabular text-xs text-[#9b8f82] break-words">
              {this.state.message}
            </div>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleRecover}
                className="px-4 py-2 rounded-lg bg-[#2e7d7b] hover:bg-[#389592] text-[#09080c] text-xs font-semibold"
              >
                Reintentar vista
              </button>
              <button
                type="button"
                onClick={this.handleHardReset}
                className="px-4 py-2 rounded-lg border border-[#d43750]/60 text-[#ff8fa0] hover:bg-[#9e1b32]/20 text-xs font-medium inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar guardado</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
