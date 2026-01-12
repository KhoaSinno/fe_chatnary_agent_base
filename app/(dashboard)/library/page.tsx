"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Upload,
  Grid,
  List,
  Search,
  FileText,
  FileType,
  MoreVertical,
  Download,
  Trash2,
  Share2,
  FolderPlus,
  Filter,
  X,
  CheckSquare,
  Square,
  RefreshCw,
} from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DocumentCardSkeleton } from "@/components/ui/skeleton";
import { NoDocumentsState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { DataTable, createSelectionColumn } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { useAuth } from "@/context/auth-context";
import { mockDocuments } from "@/lib/mock-data";
import { Document, DocumentStatus, DocumentType } from "@/lib/types";

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type ViewMode = "grid" | "list";
type StatusFilter = "all" | DocumentStatus;
type TypeFilter = "all" | DocumentType;

export default function LibraryPage() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get user's documents
  const userDocuments = mockDocuments.filter(
    (d) => d.uploadedBy === currentUser?.id
  );

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return userDocuments.filter((doc) => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;
      const matchesType = typeFilter === "all" || doc.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [userDocuments, searchQuery, statusFilter, typeFilter]);

  // Paginated documents for grid view
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredDocuments.slice(start, end);
  }, [filteredDocuments, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredDocuments.length / pageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setSelectedMenuId(null);
    if (selectedMenuId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [selectedMenuId]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || typeFilter !== "all";

  // Table columns for list view
  const columns: ColumnDef<Document>[] = useMemo(
    () => [
      createSelectionColumn<Document>(),
      {
        accessorKey: "name",
        header: "Tên tài liệu",
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="flex items-center gap-3 min-w-0">
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
              <div className="min-w-0">
                <p className="font-medium text-slate-900 truncate max-w-[300px]">
                  {doc.name}
                </p>
                <p className="text-xs text-slate-500">
                  {doc.metadata?.category || "Chưa phân loại"}
                </p>
              </div>
            </div>
          );
        },
        size: 350,
      },
      {
        accessorKey: "type",
        header: "Loại",
        cell: ({ row }) => (
          <span className="uppercase text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {row.original.type}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "size",
        header: "Kích thước",
        cell: ({ row }) => (
          <span className="text-slate-600">
            {formatFileSize(row.original.size)}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "pageCount",
        header: "Trang",
        cell: ({ row }) => (
          <span className="text-slate-600">
            {row.original.pageCount || "-"}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        size: 120,
      },
      {
        accessorKey: "uploadedAt",
        header: "Ngày tải lên",
        cell: ({ row }) => (
          <span className="text-slate-600">
            {formatDate(row.original.uploadedAt)}
          </span>
        ),
        size: 120,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="relative">
              <IconButton
                icon={MoreVertical}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMenuId(selectedMenuId === doc.id ? null : doc.id);
                }}
              />

              {selectedMenuId === doc.id && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  {doc.allowDownload && (
                    <a
                      href={doc.url || "/LV_CTUET_ThinhNhat.pdf"}
                      download={doc.name}
                      onClick={() => setSelectedMenuId(null)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <Download size={16} className="text-slate-400" />
                      <span>Tải xuống</span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      alert(`Đã sao chép link chia sẻ cho "${doc.name}"!`);
                      setSelectedMenuId(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <Share2 size={16} className="text-slate-400" />
                    <span>Chia sẻ</span>
                  </button>
                  <button
                    onClick={() => {
                      alert(
                        `Tính năng thêm "${doc.name}" vào Project sẽ sớm được cập nhật!`
                      );
                      setSelectedMenuId(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <FolderPlus size={16} className="text-slate-400" />
                    <span>Thêm vào Project</span>
                  </button>
                  <hr className="my-2 border-slate-100" />
                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa "${doc.name}"?`)) {
                        // Mock delete - in real app would call API
                        alert(`Đã xóa "${doc.name}"!`);
                      }
                      setSelectedMenuId(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Xóa</span>
                  </button>
                </div>
              )}
            </div>
          );
        },
        size: 60,
        enableSorting: false,
      },
    ],
    [selectedMenuId]
  );

  // Document Card Component for grid view
  const DocumentCard = ({ doc }: { doc: Document }) => (
    <div className="card card-interactive p-5 relative group">
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
            doc.type === "pdf" ? "bg-red-100" : "bg-blue-100"
          }`}
        >
          {doc.type === "pdf" ? (
            <FileText className="text-red-600" size={28} />
          ) : (
            <FileType className="text-blue-600" size={28} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate pr-8">
            {doc.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500">
            <span>{formatFileSize(doc.size)}</span>
            {doc.pageCount && <span>• {doc.pageCount} trang</span>}
          </div>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            icon={MoreVertical}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMenuId(selectedMenuId === doc.id ? null : doc.id);
            }}
          />

          {selectedMenuId === doc.id && (
            <div
              className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              {doc.allowDownload && (
                <a
                  href={doc.url || "/LV_CTUET_ThinhNhat.pdf"}
                  download={doc.name}
                  onClick={() => setSelectedMenuId(null)}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <Download size={16} className="text-slate-400" />
                  <span>Tải xuống</span>
                </a>
              )}
              <button
                onClick={() => {
                  alert(`Đã sao chép link chia sẻ cho "${doc.name}"!`);
                  setSelectedMenuId(null);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
              >
                <Share2 size={16} className="text-slate-400" />
                <span>Chia sẻ</span>
              </button>
              <button
                onClick={() => {
                  alert(
                    `Tính năng thêm "${doc.name}" vào Project sẽ sớm được cập nhật!`
                  );
                  setSelectedMenuId(null);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
              >
                <FolderPlus size={16} className="text-slate-400" />
                <span>Thêm vào Project</span>
              </button>
              <hr className="my-2 border-slate-100" />
              <button
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa "${doc.name}"?`)) {
                    alert(`Đã xóa "${doc.name}"!`);
                  }
                  setSelectedMenuId(null);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
              >
                <Trash2 size={16} />
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <StatusBadge status={doc.status} />
        <span className="text-xs text-slate-400">
          {formatDate(doc.uploadedAt)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kho tài liệu cá nhân
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý và tổ chức tài liệu của bạn
          </p>
        </div>
        <Button
          variant="primary"
          icon={Upload}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Tải lên tài liệu
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
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

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-11 px-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25rem 1.25rem",
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="done">Hoàn thành</option>
              <option value="processing">Đang xử lý</option>
              <option value="error">Lỗi</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="h-11 px-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25rem 1.25rem",
              }}
            >
              <option value="all">Tất cả loại file</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 h-11 px-4 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                <RefreshCw size={16} />
                <span>Xóa bộ lọc</span>
              </button>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl ml-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-primary-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                title="Danh sách"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-primary-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                title="Lưới"
              >
                <Grid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500">
              Đang lọc:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                Từ khóa: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-primary-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                Trạng thái:{" "}
                {statusFilter === "done"
                  ? "Hoàn thành"
                  : statusFilter === "processing"
                  ? "Đang xử lý"
                  : "Lỗi"}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="hover:text-primary-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {typeFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                Loại: {typeFilter.toUpperCase()}
                <button
                  onClick={() => setTypeFilter("all")}
                  className="hover:text-primary-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selected Documents Actions */}
      {selectedDocuments.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary-50 border border-primary-200 rounded-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckSquare size={18} className="text-primary-600" />
            <span className="text-sm font-medium text-primary-900">
              Đã chọn {selectedDocuments.length} tài liệu
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" icon={FolderPlus}>
              Thêm vào Project
            </Button>
            <Button variant="outline" size="sm" icon={Share2}>
              Chia sẻ
            </Button>
            <Button variant="danger" size="sm" icon={Trash2}>
              Xóa
            </Button>
          </div>
        </div>
      )}

      {/* Document Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">
            {filteredDocuments.length}
          </span>{" "}
          tài liệu
          {hasActiveFilters && " (đã lọc)"}
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <DocumentCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <DataTable columns={columns} data={[]} isLoading={true} />
        )
      ) : filteredDocuments.length === 0 ? (
        hasActiveFilters ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Không tìm thấy tài liệu
            </h3>
            <p className="text-slate-500 mb-4">
              Không có tài liệu nào phù hợp với bộ lọc hiện tại
            </p>
            <Button variant="secondary" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          <NoDocumentsState onUpload={() => setIsUploadModalOpen(true)} />
        )
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedDocuments.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
          {filteredDocuments.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredDocuments.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </>
      ) : (
        <DataTable
          columns={columns}
          data={filteredDocuments}
          enableRowSelection
          onRowSelectionChange={setSelectedDocuments}
          pageSize={pageSize}
        />
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Tải lên tài liệu"
      >
        <div className="space-y-6">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer group">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="text-primary-600" size={28} />
            </div>
            <p className="text-slate-700 mb-2 font-medium">
              Kéo thả file vào đây hoặc{" "}
              <span className="text-primary-600">chọn file</span>
            </p>
            <p className="text-sm text-slate-400">
              Hỗ trợ PDF, DOCX (Tối đa 50MB)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsUploadModalOpen(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button variant="primary" icon={Upload} className="flex-1">
              Tải lên
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
