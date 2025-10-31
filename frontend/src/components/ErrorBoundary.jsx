import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // opcional: enviar a analytics/logs
    // console.error("ErrorBoundary:", error, info);
  }
  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="container-site py-16">
          <div className="card p-6 space-y-3">
            <h1 className="text-2xl font-semibold text-[color:var(--brand)]">Something went wrong</h1>
            <p className="muted">An unexpected error occurred. Try reloading the page.</p>
            <div className="flex gap-2">
              <button onClick={this.handleReload} className="btn-primary">Reload</button>
              <a
                href="https://github.com/jimdrix93/toolsy/issues"
                target="_blank"
                className="btn-outline"
              >
                Report issue
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
