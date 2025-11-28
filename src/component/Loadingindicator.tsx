import '../styles/LoadingIndicator.css'


export default function LoadingIndicator() {
  return (
    <div className="loading-container">
      <span className="loading-dot"></span>
      <span className="loading-dot"></span>
      <span className="loading-dot"></span>
      <span className="loading-text">Loading...</span>
    </div>
  );
}