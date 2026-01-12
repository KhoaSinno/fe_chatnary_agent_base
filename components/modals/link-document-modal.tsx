"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  FileText,
  FileType,
  Check,
  X,
  Plus,
  Library,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { mockDocuments } from "@/lib/mock-data";
import { Document } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

interface LinkDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  existingDocumentIds: string[];
  onLinkDocuments: (documents: Document[]) => void;
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function LinkDocumentModal({
  isOpen,
  onClose,
  projectName,
  existingDocumentIds,
  onLinkDocuments,
}: LinkDocumentModalProps) {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get user's documents that are not already linked
  const availableDocuments = useMemo(() => {
    return mockDocuments.filter(
      (d) =>
        d.uploadedBy === currentUser?.id &&
        d.status === "done" &&
        !existingDocumentIds.includes(d.id)
    );
  }, [currentUser?.id, existingDocumentIds]);

  // Filter by search
  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return availableDocuments;
    return availableDocuments.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableDocuments, searchQuery]);

  const toggleSelection = (docId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(filteredDocuments.map((d) => d.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleConfirm = () => {
    const selectedDocs = availableDocuments.filter((d) =>
      selectedIds.has(d.id)
    );
    onLinkDocuments(selectedDocs);
    onClose();
    setSelectedIds(new Set());
    setSearchQuery("");
  };

  const handleClose = () => {
    onClose();
    setSelectedIds(new Set());
    setSearchQuery("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Liên kết tài liệu từ kho"
    >
      <div className="space-y-5">
        {/* Description */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
          <Library size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium">
              Liên kết tài liệu từ kho cá nhân
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Chọn tài liệu từ kho cá nhân để thêm vào project "{projectName}".
              Tài liệu gốc vẫn được giữ trong kho của bạn.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm trong kho..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {filteredDocuments.length} tài liệu khả dụng
          </p>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                onClick={clearSelection}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Bỏ chọn tất cả
              </button>
            )}
            {filteredDocuments.length > 0 &&
              selectedIds.size < filteredDocuments.length && (
                <button
                  onClick={selectAll}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Chọn tất cả
                </button>
              )}
          </div>
        </div>

        {/* Document List */}
        <div className="max-h-[300px] overflow-y-auto -mx-1 px-1">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto mb-3 bg-slate-100 rounded-2xl flex items-center justify-center">
                <FileText size={24} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">
                {searchQuery
                  ? "Không tìm thấy tài liệu phù hợp"
                  : "Không có tài liệu khả dụng"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => {
                const isSelected = selectedIds.has(doc.id);
                return (
                  <button
                    key={doc.id}
                    onClick={() => toggleSelection(doc.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-primary-50 border-2 border-primary-400 shadow-sm"
                        : "bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary-500 text-white"
                          : "border-2 border-slate-300"
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        doc.type === "pdf" ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      {doc.type === "pdf" ? (
                        <FileText className="text-red-600" size={20} />
                      ) : (
                        <FileType className="text-blue-600" size={20} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>{formatFileSize(doc.size)}</span>
                        {doc.pageCount && <span>• {doc.pageCount} trang</span>}
                      </div>
                    </div>

                    {/* Status */}
                    <StatusBadge status={doc.status} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Count */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl">
            <Check size={16} className="text-primary-600" />
            <span className="text-sm font-medium text-primary-900">
              Đã chọn {selectedIds.size} tài liệu
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Hủy
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            className="flex-1"
          >
            Liên kết ({selectedIds.size})
          </Button>
        </div>
      </div>
    </Modal>
  );
}
