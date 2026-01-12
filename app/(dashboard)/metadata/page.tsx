"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Tags,
  Search,
  Filter,
  Edit3,
  Save,
  X,
  FileText,
  Calendar,
  User,
  Globe,
  Tag,
  CheckCircle,
  AlertCircle,
  Download,
  Plus,
  Trash2,
  ChevronDown,
  BookOpen,
  Building,
  Hash,
} from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Document } from "@/lib/types";
import { mockDocuments } from "@/lib/mock-data";
import { DataTable, createSelectionColumn } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { ColumnDef } from "@tanstack/react-table";

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
  return new Date(dateString).toLocaleDateString("vi-VN");
}

// Metadata Editor Modal
interface MetadataEditorProps {
  document: Document;
  onSave: (doc: Document) => void;
  onClose: () => void;
}

function MetadataEditor({ document, onSave, onClose }: MetadataEditorProps) {
  const [metadata, setMetadata] = useState({
    title: document.metadata?.title || document.name.replace(/\.[^/.]+$/, ""),
    author: document.metadata?.author || "",
    year: document.metadata?.year || new Date().getFullYear(),
    language: document.metadata?.language || "Vietnamese",
    category: document.metadata?.category || "",
    tags: document.metadata?.tags?.join(", ") || "",
  });

  const [newTag, setNewTag] = useState("");
  const tags = metadata.tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t);

  const handleSave = () => {
    onSave({
      ...document,
      metadata: {
        ...metadata,
        tags: tags,
      },
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setMetadata({
        ...metadata,
        tags: [...tags, newTag.trim()].join(", "),
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata({
      ...metadata,
      tags: tags.filter((t) => t !== tagToRemove).join(", "),
    });
  };

  const categories = [
    "Computer Science",
    "Mathematics",
    "Philosophy",
    "Economics",
    "Literature",
    "Science",
    "Engineering",
    "Medicine",
    "Law",
    "Arts",
    "Other",
  ];

  const languages = [
    "Vietnamese",
    "English",
    "French",
    "Chinese",
    "Japanese",
    "Korean",
    "German",
    "Other",
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Edit3 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Chỉnh sửa Metadata</h2>
              <p className="text-sm text-slate-500 truncate max-w-[300px]">
                {document.name}
              </p>
            </div>
          </div>
          <IconButton icon={X} onClick={onClose} />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <BookOpen size={14} className="inline mr-2" />
                Tiêu đề
              </label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) =>
                  setMetadata({ ...metadata, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="Tiêu đề tài liệu"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <User size={14} className="inline mr-2" />
                Tác giả
              </label>
              <input
                type="text"
                value={metadata.author}
                onChange={(e) =>
                  setMetadata({ ...metadata, author: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="Tên tác giả"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar size={14} className="inline mr-2" />
                Năm xuất bản
              </label>
              <input
                type="number"
                value={metadata.year}
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    year: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                min={1900}
                max={2100}
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Globe size={14} className="inline mr-2" />
                Ngôn ngữ
              </label>
              <select
                value={metadata.language}
                onChange={(e) =>
                  setMetadata({ ...metadata, language: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none bg-white"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Building size={14} className="inline mr-2" />
                Danh mục
              </label>
              <select
                value={metadata.category}
                onChange={(e) =>
                  setMetadata({ ...metadata, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none bg-white"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Tag size={14} className="inline mr-2" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    <Hash size={12} />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="Thêm tag mới..."
                />
                <Button variant="secondary" onClick={addTag}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Document Info */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-semibold text-slate-700 mb-3">
              Thông tin tài liệu
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Loại file:</span>
                <p className="font-medium text-slate-900 uppercase">
                  {document.type}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Kích thước:</span>
                <p className="font-medium text-slate-900">
                  {formatFileSize(document.size)}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Số trang:</span>
                <p className="font-medium text-slate-900">
                  {document.pageCount || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Trạng thái:</span>
                <p className="font-medium text-slate-900 capitalize">
                  {document.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: Document["status"] }) {
  const config = {
    done: { label: "Hoàn thành", color: "success", icon: CheckCircle },
    processing: { label: "Đang xử lý", color: "warning", icon: AlertCircle },
    error: { label: "Lỗi", color: "error", icon: AlertCircle },
  };

  const { label, color, icon: Icon } = config[status];

  return (
    <Badge variant={color as any}>
      <Icon size={12} className="mr-1" />
      {label}
    </Badge>
  );
}

export default function MetadataPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDocuments(mockDocuments);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    documents.forEach((doc) => {
      if (doc.metadata?.category) cats.add(doc.metadata.category);
    });
    return Array.from(cats);
  }, [documents]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.metadata?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doc.metadata?.author?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || doc.metadata?.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [documents, searchQuery, categoryFilter, statusFilter]);

  // Paginated documents
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, currentPage, pageSize]);

  // Stats
  const stats = useMemo(() => {
    const withMetadata = documents.filter(
      (d) => d.metadata?.title && d.metadata?.author
    ).length;
    const withTags = documents.filter(
      (d) => d.metadata?.tags && d.metadata.tags.length > 0
    ).length;
    const withCategory = documents.filter((d) => d.metadata?.category).length;

    return {
      total: documents.length,
      withMetadata,
      withTags,
      withCategory,
      completeness:
        documents.length > 0
          ? Math.round((withMetadata / documents.length) * 100)
          : 0,
    };
  }, [documents]);

  const handleSaveMetadata = (updatedDoc: Document) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))
    );
    setEditingDocument(null);
    addToast({
      type: "success",
      title: "Metadata đã được lưu",
      message: `Đã cập nhật metadata cho "${updatedDoc.name}"`,
    });
  };

  // Table columns
  const columns: ColumnDef<Document>[] = useMemo(
    () => [
      createSelectionColumn<Document>(),
      {
        accessorKey: "name",
        header: "Tài liệu",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                row.original.type === "pdf"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate max-w-[200px]">
                {row.original.metadata?.title || row.original.name}
              </p>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                {row.original.name}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "metadata.author",
        header: "Tác giả",
        cell: ({ row }) => (
          <span className="text-slate-700">
            {row.original.metadata?.author || (
              <span className="text-slate-400 italic">Chưa có</span>
            )}
          </span>
        ),
      },
      {
        accessorKey: "metadata.category",
        header: "Danh mục",
        cell: ({ row }) =>
          row.original.metadata?.category ? (
            <Badge variant="default">{row.original.metadata.category}</Badge>
          ) : (
            <span className="text-slate-400 italic text-sm">
              Chưa phân loại
            </span>
          ),
      },
      {
        accessorKey: "metadata.tags",
        header: "Tags",
        cell: ({ row }) => {
          const tags = row.original.metadata?.tags || [];
          return tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-xs text-slate-400">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 italic text-sm">—</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            icon={Edit3}
            onClick={() => setEditingDocument(row.original)}
          >
            Sửa
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý Metadata
          </h1>
          <p className="text-slate-500">
            Chỉnh sửa và quản lý metadata tài liệu
          </p>
        </div>
        <Button variant="primary" icon={Download}>
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Tổng tài liệu</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.withMetadata}
              </p>
              <p className="text-sm text-slate-500">Có đầy đủ metadata</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Tag size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.withTags}
              </p>
              <p className="text-sm text-slate-500">Có tags</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-600">
                {stats.completeness}%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Độ hoàn thiện
              </p>
              <div className="w-24 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                  style={{ width: `${stats.completeness}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên, tiêu đề, tác giả..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="done">Hoàn thành</option>
              <option value="processing">Đang xử lý</option>
              <option value="error">Lỗi</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <DataTable
          columns={columns}
          data={paginatedDocuments}
          isLoading={isLoading}
          showPagination={false}
          emptyState={
            <div className="p-8 text-center text-slate-500">
              Không tìm thấy tài liệu nào
            </div>
          }
        />

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredDocuments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {/* Metadata Editor Modal */}
      {editingDocument && (
        <MetadataEditor
          document={editingDocument}
          onSave={handleSaveMetadata}
          onClose={() => setEditingDocument(null)}
        />
      )}
    </div>
  );
}
