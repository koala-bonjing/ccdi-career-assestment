import React from "react";
import { useNavigate } from "react-router-dom";

const NoResultsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h3 className="mb-3">No Results Available</h3>
        <p className="text-muted mb-4">Please complete the evaluation first.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/evaluation")}
        >
          Start Evaluation
        </button>
      </div>
    </div>
  );
};

export default NoResultsView;