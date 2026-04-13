import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Eye, Download, Printer, FileText } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

// ── inline PDF viewer (scrollable, all pages) ────────────────────────────────

const InlinePDFViewer: React.FC<{ pdfUrl: string }> = ({ pdfUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [totalPages, setTotalPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState(0);

  useEffect(() => {
    if (!pdfUrl) { setStatus("error"); return; }

    setStatus("loading");
    setTotalPages(0);
    setRenderedPages(0);
    if (containerRef.current) containerRef.current.innerHTML = "";

    let cancelled = false;

    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        if (cancelled) return;

        setTotalPages(pdf.numPages);

        const containerWidth = containerRef.current?.clientWidth ?? 500;
        const dpr = window.devicePixelRatio || 1;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;

          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const baseViewport = page.getViewport({ scale: 1 });
          const scale = (containerWidth / baseViewport.width) * dpr;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${viewport.width / dpr}px`;
          canvas.style.height = `${viewport.height / dpr}px`;
          canvas.style.display = "block";
          canvas.style.marginBottom = "8px";
          canvas.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
          canvas.style.borderRadius = "4px";
          canvas.style.maxWidth = "100%";

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          if (cancelled) return;

          containerRef.current?.appendChild(canvas);
          setRenderedPages(pageNum);
        }

        setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          console.error("PDFViewer error:", err);
          setStatus("error");
        }
      }
    })();

    return () => { cancelled = true; };
  }, [pdfUrl]);

  if (status === "error") {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center gap-3"
        style={{ height: "60vh", color: "#6c757d" }}
      >
        <FileText size={48} strokeWidth={1.2} />
        <p className="mb-0 text-center px-3" style={{ fontSize: 14, maxWidth: 300 }}>
          Preview couldn't load. Use the Download button below.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "65vh" }}>
      {/* progress bar while rendering */}
      {status === "loading" && (
        <div
          style={{
            flexShrink: 0,
            padding: "8px 16px",
            background: "#fff",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            color: "#6c757d",
          }}
        >
          <Spinner animation="border" size="sm" variant="primary" />
          <span>
            {totalPages > 0
              ? `Rendering page ${renderedPages} of ${totalPages}…`
              : "Loading PDF…"}
          </span>
        </div>
      )}

      {/* scrollable canvas area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          background: "#e9ecef",
          padding: "12px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div ref={containerRef} />
      </div>
    </div>
  );
};

// ── ActionButtons ─────────────────────────────────────────────────────────────

interface ActionButtonsProps {
  onSave: () => Promise<void>;
  saving: boolean;
  pdfUrl?: string | null;
  onDownload?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  saving,
  pdfUrl,
  onDownload,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleClick = async () => {
    await onSave();
    // parent sets pdfUrl after onSave resolves — open modal once it's ready
    setShowPreview(true);
  };

  const handlePrint = () => {
    if (!pdfUrl) return;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "assessment-results.pdf";
    a.click();
  };

  return (
    <>
      <div
        className={`mb-4 ${isMobile ? "d-flex flex-column gap-3 px-3" : "text-center"}`}
      >
        <button
          onClick={handleClick}
          disabled={saving}
          className={`btn btn-lg fw-bold ${isMobile ? "w-100 py-3" : "px-5 py-3 me-3 m-2"}`}
          style={{
            background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
            color: "white",
            border: "3px solid #2B3176",
            borderRadius: "12px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(164,29,49,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Generating Preview...
            </>
          ) : (
            <>
              <Eye size={20} className="me-2" />
              Preview Document
            </>
          )}
        </button>
      </div>

      {/* ── preview modal ── */}
      <Modal
        show={showPreview && !!pdfUrl}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header
          closeButton
          style={{ background: "#f8f9ff", borderBottom: "2px solid #2B3176" }}
        >
          <Modal.Title style={{ color: "#2B3176", fontWeight: "bold" }}>
            <Eye size={22} className="me-2 mb-1" />
            Document Preview
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0" style={{ background: "#e9ecef" }}>
          {pdfUrl ? (
            <InlinePDFViewer pdfUrl={pdfUrl} />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "65vh", color: "#6c757d" }}
            >
              <Spinner animation="border" className="me-2" />
              Loading Preview...
            </div>
          )}
        </Modal.Body>

        <Modal.Footer style={{ background: "#f8f9ff", borderTop: "1px solid #dee2e6" }}>
          <Button variant="outline-secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button
            variant="outline-primary"
            onClick={handlePrint}
            className="d-flex align-items-center"
            style={{ borderColor: "#2B3176", color: "#2B3176" }}
          >
            <Printer size={17} className="me-2" />
            Print
          </Button>
          <Button
            onClick={handleDownload}
            className="d-flex align-items-center"
            style={{
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              border: "none",
            }}
          >
            <Download size={17} className="me-2" />
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActionButtons;