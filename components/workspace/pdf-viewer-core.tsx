"use client";

import React, { useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2, FileWarning } from "lucide-react";

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerCoreProps {
  pdfUrl: string;
  currentPage: number;
  rotation: number;
  highlightedPage?: number;
  onLoadSuccess: (numPages: number) => void;
}

function PDFViewerCore({
  pdfUrl,
  currentPage,
  rotation,
  highlightedPage,
  onLoadSuccess,
}: PDFViewerCoreProps) {
  const [error, setError] = useState<string | null>(null);

  const handleLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      onLoadSuccess(numPages);
      setError(null);
    },
    [onLoadSuccess]
  );

  const handleLoadError = useCallback((err: Error) => {
    console.error("PDF load error:", err);
    setError("Không thể tải PDF. Vui lòng thử lại.");
  }, []);

  if (error) {
    return (
      <div className="w-[600px] min-h-[400px] bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-8 text-center">
        <FileWarning size={48} className="text-amber-500 mb-4" />
        <h3 className="font-semibold text-slate-900 mb-2">
          Không thể hiển thị PDF
        </h3>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={handleLoadSuccess}
      onLoadError={handleLoadError}
      loading={
        <div className="w-[600px] min-h-[800px] bg-white rounded-lg shadow-xl flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500">Đang tải tài liệu...</p>
          </div>
        </div>
      }
      className="flex flex-col items-center"
    >
      <Page
        pageNumber={currentPage}
        renderTextLayer={true}
        renderAnnotationLayer={true}
        rotate={rotation}
        className={`shadow-xl rounded-lg overflow-hidden ${
          highlightedPage === currentPage
            ? "ring-4 ring-primary-400 ring-opacity-50"
            : ""
        }`}
        width={600}
        loading={
          <div className="w-[600px] h-[800px] bg-white rounded-lg shadow-xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        }
      />

      {highlightedPage === currentPage && (
        <div className="mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium flex items-center gap-2">
          📍 Trang này được trích dẫn trong câu trả lời AI
        </div>
      )}
    </Document>
  );
}

export default PDFViewerCore;
