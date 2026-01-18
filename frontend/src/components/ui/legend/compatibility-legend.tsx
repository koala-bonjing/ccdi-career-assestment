// src/pages/ResultsPage/components/CompatibilityLegend.tsx
const CompatibilityLegend: React.FC = () => {
  return (
    <div
      className="mt-4 p-3 rounded"
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
        border: "1.5px solid #2B3176",
        fontSize: "0.875rem",
      }}
    >
      <h6
        className="text-center mb-2 fw-bold"
        style={{ color: "#2B3176", fontSize: "0.9rem" }}
      >
        Compatibility Guide
      </h6>

      {/* Clear disclaimer box */}
      <div
        className="alert alert-info alert-sm mb-3 py-2 px-3 text-center"
        style={{
          fontSize: "0.75rem",
          backgroundColor: "rgba(13, 110, 253, 0.08)",
          border: "1px dashed #0d6efd",
          borderRadius: "6px",
        }}
      >
        <strong className="d-block mb-1">📊 Important Note:</strong>
        <small>
          These scores represent <strong>independent confidence levels</strong>{" "}
          for each program. They <strong>do not sum to 100%</strong> because
          each program is evaluated separately.
        </small>
      </div>

      <div className="row text-center g-2">
        <div className="col-md-3">
          <div
            className="fw-bold"
            style={{ color: "#08CB00", fontSize: "0.85rem" }}
          >
            80-100%
          </div>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Excellent Match
          </small>
        </div>
        <div className="col-md-3">
          <div className="fw-bold text-primary" style={{ fontSize: "0.85rem" }}>
            60-79%
          </div>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Strong Fit
          </small>
        </div>
        <div className="col-md-3">
          <div className="fw-bold text-danger" style={{ fontSize: "0.85rem" }}>
            40-59%
          </div>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Moderate Fit
          </small>
        </div>
        <div className="col-md-3">
          <div
            className="fw-bold text-secondary"
            style={{ fontSize: "0.85rem" }}
          >
            0-39%
          </div>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Limited Fit
          </small>
        </div>
      </div>

      {/* Optional: Add more explanation */}
      <div className="mt-2 text-center">
        <small className="text-muted" style={{ fontSize: "0.7rem" }}>
          Each percentage reflects AI's confidence in that specific program
          fitting your profile
        </small>
      </div>
    </div>
  );
};

export default CompatibilityLegend;
