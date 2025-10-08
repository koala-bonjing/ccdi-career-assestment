import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../config/constants";

interface SavedEvaluation {
  _id: string;
  evaluation: string;
  recommendations: string;
  recommendedCourse: string;
  percent: {
    BSIT: number;
    BSCS: number;
    BSIS: number;
    EE: number;
  };
  programScores: {
    BSCS: number;
    BSIT: number;
    BSIS: number;
    EE: number;
  };
  submissionDate: string;
}

const ResultsHistory = () => {
  const [evaluations, setEvaluations] = useState<SavedEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (authUser?.id) {
      fetchUserEvaluations();
    }
  }, [authUser]);

  const fetchUserEvaluations = async () => {
    if (!authUser?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${BASE_URL}/api/get-evaluations/${authUser.id}`
      );

      if (response.data.success) {
        setEvaluations(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.error("Failed to fetch evaluations:", error);
      setError(error.response?.data?.message || "Failed to load evaluations");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="loading">Loading your results history...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="results-history">
      <h2>Your Assessment History</h2>

      {evaluations.length === 0 ? (
        <div className="no-results">
          <p>No previous evaluations found.</p>
          <p>Complete an assessment to see your results here!</p>
        </div>
      ) : (
        <div className="evaluations-list">
          {evaluations.map((evaluation) => (
            <div key={evaluation._id} className="evaluation-card">
              <div className="evaluation-header">
                <h3>Assessment Results</h3>
                <span className="date">
                  {new Date(evaluation.submissionDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>

              <div className="recommendation">
                <strong>
                  Recommended Course: {evaluation.recommendedCourse}
                </strong>
              </div>

              <div className="percentages">
                <h4>Compatibility Scores:</h4>
                <div className="score-bars">
                  {Object.entries(evaluation.percent).map(([course, score]) => (
                    <div key={course} className="score-bar">
                      <span className="course-name">{course}</span>
                      <div className="bar-container">
                        <div
                          className={`bar-fill ${
                            evaluation.recommendedCourse === course
                              ? "recommended"
                              : ""
                          }`}
                          style={{ width: `${score}%` }}
                        >
                          <span className="score-text">{score}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="evaluation-details">
                <div className="detail-section">
                  <h5>Evaluation Summary</h5>
                  <p>{evaluation.evaluation}</p>
                </div>

                <div className="detail-section">
                  <h5>Recommendations</h5>
                  <p>{evaluation.recommendations}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsHistory;
