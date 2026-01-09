import React from "react";

interface ErrorViewProps {
  error: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error }) => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;