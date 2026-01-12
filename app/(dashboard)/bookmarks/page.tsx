"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, FileText, Grid, List, Search, X } from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DocumentCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { mockDocuments } from "@/lib/mock-data";
import { Document } from "@/lib/types";

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function BookmarksPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock bookmarked documents (first 3 done documents)
  const bookmarkedDocuments = mockDocuments
    .filter((d) => d.status === "done")
    .slice(0, 3);

  const filteredDocuments = bookmarkedDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveBookmark = (docId: string) => {
    // Mock remove action
    console.log("Remove bookmark:", docId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
        <p className="text-gray-500">Your saved documents for quick access</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3].map((i) => (
            <DocumentCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="text-gray-400" size={32} />}
          title="No bookmarks yet"
          description="Save documents you want to access quickly by clicking the bookmark icon"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="card card-interactive p-4 relative group"
            >
              {/* Remove Bookmark Button */}
              <button
                onClick={() => handleRemoveBookmark(doc.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-lg"
                title="Remove bookmark"
              >
                <X size={16} className="text-red-500" />
              </button>

              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    doc.type === "pdf" ? "bg-red-100" : "bg-blue-100"
                  }`}
                >
                  <FileText
                    size={28}
                    className={
                      doc.type === "pdf" ? "text-red-600" : "text-blue-600"
                    }
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate pr-6">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>{formatFileSize(doc.size)}</span>
                    {doc.pageCount && <span>• {doc.pageCount} pages</span>}
                  </div>
                </div>
              </div>

              {/* Bookmark Icon */}
              <div className="absolute bottom-3 right-3">
                <Bookmark
                  className="text-amber-500"
                  size={18}
                  fill="currentColor"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
