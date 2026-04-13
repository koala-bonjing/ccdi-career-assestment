import React, { useEffect, useRef, useState } from "react";
import { Spinner, Button } from "react-bootstrap";
import { Download, FileText } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

interface PDFViewerProps {
  pdfUrl: string;
  onLoad?: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onLoad }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [totalPages, setTotalPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState(0);

  useEffect(() => {
    if (!pdfUrl) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setTotalPages(0);
    setRenderedPages(0);

    // Clear any previously rendered pages
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    let cancelled = false;

    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        if (cancelled) return;

        setTotalPages(pdf.numPages);

        const containerWidth = containerRef.current?.clientWidth ?? 600;
        const dpr = window.devicePixelRatio || 1;

        // Render all pages sequentially and append each canvas
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

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          if (cancelled) return;

          containerRef.current?.appendChild(canvas);
          setRenderedPages(pageNum);
        }

        setStatus("ready");
        onLoad?.();
      } catch (err) {
        if (!cancelled) {
          console.error("PDFViewer error:", err);
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "assessment-answers.pdf";
    a.click();
  };

  if (status === "error") {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center gap-3"
        style={{ height: "70vh", color: "#6c757d" }}
      >
        <FileText size={48} strokeWidth={1.2} />
        <p
          className="mb-0 text-center px-3"
          style={{ fontSize: 14, maxWidth: 320 }}
        >
          Preview couldn't load. Download the file to view it.
        </p>
        <Button variant="primary" onClick={handleDownload}>
          <Download size={16} className="me-2" />
          Download PDF
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
      {/* loading bar — shown while pages are still rendering */}
      {status === "loading" && (
        <div
          style={{
            flexShrink: 0,
            padding: "10px 16px",
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

      {/* scrollable canvas container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          background: "#e9ecef",
          padding: "12px",
          WebkitOverflowScrolling: "touch", // smooth momentum scroll on iOS
        }}
      >
        {/* canvases are appended here imperatively */}
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default PDFViewer;
