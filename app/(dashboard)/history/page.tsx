"use client";

import React, { useState, useEffect } from "react";
import { History, FileText, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { mockDocuments } from "@/lib/mock-data";

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("vi-VN");
}

// Group by date
function groupByDate(items: typeof mockDocuments) {
  const groups: Record<string, typeof mockDocuments> = {};

  items.forEach((item) => {
    const date = new Date(item.uploadedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key: string;
    if (date.toDateString() === today.toDateString()) {
      key = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = "Yesterday";
    } else {
      key = date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return groups;
}

export default function HistoryPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Mock history (all done documents)
  const historyDocuments = mockDocuments.filter((d) => d.status === "done");
  const groupedHistory = groupByDate(historyDocuments);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-gray-500">Recently viewed documents</p>
        </div>
        <Button variant="outline" icon={Trash2}>
          Clear History
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-6">
          <div>
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <DocumentCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : historyDocuments.length === 0 ? (
        <EmptyState
          icon={<History className="text-gray-400" size={32} />}
          title="No history yet"
          description="Documents you view will appear here"
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([date, docs]) => (
            <div key={date}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {date}
              </h2>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="card p-4 flex items-center gap-4 hover:border-primary-300 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        doc.type === "pdf" ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      <FileText
                        size={24}
                        className={
                          doc.type === "pdf" ? "text-red-600" : "text-blue-600"
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {doc.metadata?.category || "Uncategorized"}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {formatFileSize(doc.size)}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <Clock size={12} />
                        {formatRelativeTime(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
