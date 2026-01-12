"use client";

import React, { useState } from "react";
import {
  FileText,
  FileType,
  MoreVertical,
  Download,
  Trash2,
  Edit2,
  Share2,
  Eye,
} from "lucide-react";
import { Document, DocumentType, DocumentStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/button";
import { DocumentCardSkeleton } from "@/components/ui/skeleton";

interface DocumentListProps {
  documents: Document[];
  selectedDocumentId?: string;
  onSelectDocument: (doc: Document) => void;
  isLoading?: boolean;
}

// Helper to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// File type icon
function FileIcon({ type }: { type: DocumentType }) {
  const iconProps = { size: 32 };

  if (type === "pdf") {
    return (
      <div className="w-10 h-12 bg-red-100 rounded-lg flex items-center justify-center">
        <FileText className="text-red-600" {...iconProps} />
      </div>
    );
  }

  return (
    <div className="w-10 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
      <FileType className="text-blue-600" {...iconProps} />
    </div>
  );
}

export function DocumentList({
  documents,
  selectedDocumentId,
  onSelectDocument,
  isLoading = false,
}: DocumentListProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <DocumentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="mx-auto mb-2 text-gray-400" size={40} />
        <p>No documents in this project</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => doc.status === "done" && onSelectDocument(doc)}
          className={`card p-3 cursor-pointer transition-all ${
            selectedDocumentId === doc.id
              ? "ring-2 ring-primary-500 border-primary-500"
              : ""
          } ${
            doc.status !== "done"
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-primary-300"
          }`}
        >
          <div className="flex items-start gap-3">
            <FileIcon type={doc.type} />

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate pr-8">
                {doc.name}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>{formatFileSize(doc.size)}</span>
                {doc.pageCount && <span>{doc.pageCount} pages</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={doc.status} />

              <div className="relative">
                <IconButton
                  icon={MoreVertical}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === doc.id ? null : doc.id);
                  }}
                />

                {menuOpenId === doc.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-fadeIn">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <Eye size={16} />
                      <span>Preview</span>
                    </button>
                    {doc.allowDownload && (
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                    )}
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <Edit2 size={16} />
                      <span>Rename</span>
                    </button>
                    <hr className="my-1" />
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            Uploaded {formatDate(doc.uploadedAt)}
          </div>
        </div>
      ))}
    </div>
  );
}

// Compact Document List (for sidebar in split view)
interface CompactDocumentListProps {
  documents: Document[];
  selectedDocumentId?: string;
  onSelectDocument: (doc: Document) => void;
}

export function CompactDocumentList({
  documents,
  selectedDocumentId,
  onSelectDocument,
}: CompactDocumentListProps) {
  return (
    <div className="space-y-1">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => doc.status === "done" && onSelectDocument(doc)}
          disabled={doc.status !== "done"}
          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
            selectedDocumentId === doc.id
              ? "bg-primary-100 text-primary-700"
              : "hover:bg-gray-100"
          } ${doc.status !== "done" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div
            className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
              doc.type === "pdf" ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            <FileText
              size={16}
              className={doc.type === "pdf" ? "text-red-600" : "text-blue-600"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{doc.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {formatFileSize(doc.size)}
              </span>
              {doc.status !== "done" && (
                <StatusBadge status={doc.status} className="text-xs" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
