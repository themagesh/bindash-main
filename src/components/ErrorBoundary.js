'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Surface details in the browser console for debugging
    console.error(
      `Dashboard error boundary [${this.props.label || 'root'}] caught:`,
      error,
      info?.componentStack,
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px 20px', textAlign: 'center', color: '#5b5766' }}>
          <div
            style={{
              maxWidth: 460,
              margin: '0 auto',
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid rgba(214,64,83,0.3)',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 16px 34px rgba(146,97,124,0.15)',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>🐛</div>
            <h2 style={{ margin: '0 0 8px', color: '#d64053', fontSize: '1.25rem', fontWeight: 800 }}>
              Something went wrong
            </h2>
            <p style={{ margin: '0 0 12px', fontSize: '0.9rem' }}>
              {this.props.label ? `Section "${this.props.label}" failed to render.` : 'A section of the dashboard failed to render.'} The rest of the app is still fine.
            </p>
            {this.state.error && (
              <pre
                style={{
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '0.72rem',
                  background: '#faf3f5',
                  border: '1px solid #f0d4dd',
                  borderRadius: 12,
                  padding: 12,
                  color: '#7c5578',
                  marginBottom: 16,
                }}
              >
                {String(this.state.error.name || 'Error')}: {String(this.state.error.message || this.state.error)}
                {this.state.error.stack ? '\n\n' + String(this.state.error.stack).split('\n').slice(0, 4).join('\n') : ''}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                border: 0,
                borderRadius: 14,
                padding: '10px 20px',
                fontWeight: 800,
                color: 'white',
                background: 'linear-gradient(135deg, #f79bc8 0%, #d2b3ff 100%)',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
