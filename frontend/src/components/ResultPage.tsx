import React from "react";
import { useNavigate } from "react-router-dom";
import type { AssessmentResult, User, ProgramType } from "../types";
import AssessmentForm from "./AssestmentForm";

interface ResultsPageProps {
  result: AssessmentResult | null;
  currentUser: User | null;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ result, currentUser }) => {
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="results-container">
        <h2>No results found</h2>
        <button onClick={() => navigate("/")}>Take Assessment Again</button>
      </div>
    );
  }

  const getProgramClass = (program: ProgramType): string => {
    switch (program) {
      case "BSCS":
        return "program-bscs";
      case "BSIT":
        return "program-bsit";
      case "BSIS":
        return "program-bsis";
      default:
        return "";
    }
  };

  return (
    <div className="results-container">
      <h2>Assessment Results</h2>
      {currentUser && <p>For: {currentUser.name}</p>}

      <div
        className={`program-result ${getProgramClass(
          result.recommendedProgram
        )}`}
      >
        <h3>Recommended Program: {result.recommendedProgram}</h3>
      </div>

      <div className="evaluation-section">
        <h4>Evaluation</h4>
        <p>{result.evaluation}</p>
      </div>

      <div className="recommendations-section">
        <h4>Recommendations</h4>
        <p>{result.recommendations}</p>
      </div>

      {result.percent && (
        <div>
          <h4>Program Fit Percentages:</h4>
          <ul>
            <li>BSCS: {result.percent.BSCS}%</li>
            <li>BSIT: {result.percent.BSIT}%</li>
            <li>BSIS: {result.percent.BSIS}%</li>
          </ul>
        </div>
      )}

      <button onClick={() => navigate("/")} className="back-btn">
        Take Assessment Again
      </button>
    </div>
  );
};

export default ResultsPage;
