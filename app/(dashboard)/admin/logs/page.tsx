"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Filter,
  Download,
  Calendar,
  User,
  FileText,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { mockActivityLogs } from "@/lib/mock-data";

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("vi-VN");
}

// Get action icon
function getActionIcon(action: string) {
  if (action.includes("upload") || action.includes("Upload"))
    return <FileText size={16} className="text-blue-500" />;
  if (action.includes("chat") || action.includes("Chat"))
    return <MessageCircle size={16} className="text-green-500" />;
  if (action.includes("delete") || action.includes("Delete"))
    return <Trash2 size={16} className="text-red-500" />;
  if (action.includes("join") || action.includes("Join"))
    return <User size={16} className="text-purple-500" />;
  return <Activity size={16} className="text-gray-500" />;
}

// Get action badge variant
function getActionVariant(
  action: string
): "default" | "primary" | "success" | "warning" | "error" {
  if (action.includes("delete") || action.includes("Delete")) return "error";
  if (action.includes("upload") || action.includes("Upload")) return "primary";
  if (action.includes("complete") || action.includes("Complete"))
    return "success";
  return "default";
}

export default function LogsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredLogs = mockActivityLogs.filter((log) => {
    if (actionFilter === "all") return true;
    return log.action.toLowerCase().includes(actionFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-500">
            Monitor user activities and system events
          </p>
        </div>
        <Button variant="outline" icon={Download}>
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="input pr-10 appearance-none cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="upload">Uploads</option>
            <option value="chat">Chat Sessions</option>
            <option value="delete">Deletions</option>
            <option value="join">Joins</option>
          </select>
          <Filter
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>

        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input pr-10 appearance-none cursor-pointer"
          >
            <option value="24hours">Last 24 hours</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="all">All Time</option>
          </select>
          <Calendar
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={4} />
                ))
              : filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={log.userName} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {log.userName}
                          </p>
                          <p className="text-xs text-gray-500">{log.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <Badge variant={getActionVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-xs truncate">
                        {log.target}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(log.timestamp)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleString("vi-VN")}
                      </p>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredLogs.length} of {mockActivityLogs.length} entries
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled>
            Previous
          </Button>
          <Button variant="secondary" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
