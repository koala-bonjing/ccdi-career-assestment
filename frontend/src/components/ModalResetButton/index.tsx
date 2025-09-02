import React, { useState } from "react";

export default function ResetWithModal() {
  const handleReset = () => {
    // 👉 put your reset logic here
    console.log("Form reset!");
  };

  return (
    <div className="container mt-5">
      {/* Reset Button that triggers modal */}
      <button
        type="button"
        className="btn btn-danger"
        data-bs-toggle="modal"
        data-bs-target="#resetModal"
      >
        Reset
      </button>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="resetModal"
        tabIndex={-1}
        aria-labelledby="resetModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="resetModalLabel">
                Confirm Reset
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              Are you sure you want to reset the form?  
              All changes will be lost.
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleReset}
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
