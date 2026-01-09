import React from "react";

const LoadingView: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading your results...</p>
      </div>
    </div>
  );
};

export default LoadingView;