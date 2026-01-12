"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Printer,
  FileText,
  AlertCircle,
  Loader2,
  Bookmark,
  Search,
  RotateCw,
  FileWarning,
} from "lucide-react";
import { Document as DocType } from "@/lib/types";

// Dynamically import PDF viewer components with SSR disabled
const PDFViewer = dynamic(() => import("./pdf-viewer-core"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-white rounded-lg shadow-xl flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Đang tải PDF viewer...</p>
      </div>
    </div>
  ),
});

interface DocumentViewerProps {
  document: DocType | null;
  highlightedPage?: number;
}

export function DocumentViewer({
  document,
  highlightedPage,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rotation, setRotation] = useState(0);

  const pdfUrl = document?.url || "/LV_CTUET_ThinhNhat.pdf";
  const totalPages = numPages || document?.pageCount || 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 50), 200));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  React.useEffect(() => {
    if (
      highlightedPage &&
      highlightedPage >= 1 &&
      highlightedPage <= totalPages
    ) {
      setCurrentPage(highlightedPage);
    }
  }, [highlightedPage, totalPages]);

  // Handle escape key for fullscreen
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isFullscreen]);

  if (!document) {
    return (
      <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <FileText className="text-slate-400" size={32} />
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">
          Chưa chọn tài liệu
        </h3>
        <p className="text-sm text-slate-500 max-w-xs">
          Chọn tài liệu từ danh sách để xem nội dung
        </p>
      </div>
    );
  }

  if (document.status === "processing") {
    return (
      <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
          <Loader2 className="text-amber-600 animate-spin" size={32} />
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">
          Đang xử lý tài liệu...
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mb-4">
          <span className="font-medium">{document.name}</span> đang được AI phân
          tích.
        </p>
        <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (document.status === "error") {
    return (
      <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="text-red-600" size={32} />
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">Xử lý thất bại</h3>
        <p className="text-sm text-slate-500 max-w-xs mb-4">
          Có lỗi khi xử lý <span className="font-medium">{document.name}</span>
        </p>
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-2">
          <RotateCw size={14} />
          Thử lại
        </button>
      </div>
    );
  }

  // Fullscreen wrapper
  const viewerContent = (
    <div
      className={`h-full flex flex-col bg-white overflow-hidden ${
        isFullscreen
          ? "rounded-2xl shadow-2xl"
          : "rounded-2xl border border-slate-200 shadow-sm"
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              document.type === "pdf"
                ? "bg-gradient-to-br from-red-50 to-red-100 border border-red-200"
                : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
            }`}
          >
            <FileText
              size={16}
              className={
                document.type === "pdf" ? "text-red-600" : "text-blue-600"
              }
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 truncate text-sm">
              {document.name}
            </p>
            <p className="text-xs text-slate-500">{totalPages} trang</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-xl">
          <button
            onClick={() => handleZoom(-10)}
            disabled={zoom <= 50}
            className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center disabled:opacity-50 transition-all"
          >
            <ZoomOut size={16} className="text-slate-600" />
          </button>
          <span className="w-14 text-center text-sm font-semibold text-slate-700">
            {zoom}%
          </span>
          <button
            onClick={() => handleZoom(10)}
            disabled={zoom >= 200}
            className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center disabled:opacity-50 transition-all"
          >
            <ZoomIn size={16} className="text-slate-600" />
          </button>
        </div>

        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              isBookmarked
                ? "bg-amber-100 text-amber-600"
                : "hover:bg-slate-100 text-slate-500"
            }`}
          >
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() =>
              alert("Tính năng tìm kiếm trong tài liệu sẽ sớm được cập nhật!")
            }
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
            title="Tìm kiếm"
          >
            <Search size={16} />
          </button>
          <button
            onClick={handleRotate}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
            title="Xoay tài liệu"
          >
            <RotateCw size={16} />
          </button>
          {document.allowDownload && (
            <a
              href={pdfUrl}
              download={document.name}
              className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
              title="Tải xuống"
            >
              <Download size={16} />
            </a>
          )}
          <button
            onClick={() => {
              // Open PDF in new window for printing
              const printWindow = window.open(pdfUrl, "_blank");
              if (printWindow) {
                printWindow.onload = () => {
                  printWindow.print();
                };
              }
            }}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
            title="In tài liệu"
          >
            <Printer size={16} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-slate-100 p-6">
        <div
          className="mx-auto transition-transform duration-200 flex justify-center"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <PDFViewer
            pdfUrl={pdfUrl}
            currentPage={currentPage}
            rotation={rotation}
            highlightedPage={highlightedPage}
            onLoadSuccess={(pages: number) => setNumPages(pages)}
          />
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-gradient-to-r from-white to-slate-50">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-all"
        >
          Đầu
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-50 transition-all"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2 px-3">
            <input
              type="number"
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-12 h-9 text-center text-sm font-medium border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              min={1}
              max={totalPages}
            />
            <span className="text-sm text-slate-500">/</span>
            <span className="text-sm font-semibold text-slate-700">
              {totalPages}
            </span>
          </div>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-50 transition-all"
          >
            <ChevronRight size={18} className="text-slate-600" />
          </button>
        </div>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-all"
        >
          Cuối
        </button>
      </div>
    </div>
  );

  // Render with fullscreen overlay if needed
  if (isFullscreen) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setIsFullscreen(false)}
        />
        {/* Fullscreen container */}
        <div className="fixed inset-4 z-50 animate-fadeIn">{viewerContent}</div>
      </>
    );
  }

  return viewerContent;
}
