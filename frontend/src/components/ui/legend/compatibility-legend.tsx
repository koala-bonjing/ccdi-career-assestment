// src/pages/ResultsPage/components/CompatibilityLegend.tsx
const CompatibilityLegend: React.FC = () => {
  return (
    <div
      className="mt-5 p-4 rounded"
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
        border: "2px solid #2B3176",
      }}
    >
      <h5 className="text-center mb-3 fw-bold" style={{ color: "#2B3176" }}>
        Compatibility Guide
      </h5>
      <div className="row text-center g-3">
        <div className="col-md-3">
          <div className="fw-bold text-success">80-100%</div>
          <small className="text-muted">Excellent Match</small>
        </div>
        <div className="col-md-3">
          <div className="fw-bold text-primary">60-79%</div>
          <small className="text-muted">Strong Fit</small>
        </div>
        <div className="col-md-3">
          <div className="fw-bold text-warning">40-59%</div>
          <small className="text-muted">Moderate Fit</small>
        </div>
        <div className="col-md-3">
          <div className="fw-bold text-secondary">0-39%</div>
          <small className="text-muted">Limited Fit</small>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityLegend;
