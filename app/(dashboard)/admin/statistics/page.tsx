"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  HardDrive,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUp,
  ArrowDown,
  Cpu,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCardSkeleton } from "@/components/ui/skeleton";
import { mockSystemStats } from "@/lib/mock-data";

// Format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: { value: number; positive: boolean };
  color: string;
}

function StatCard({ icon, label, value, change, color }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}
        >
          {icon}
        </div>
        {change && (
          <span
            className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-full ${
              change.positive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {change.positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {change.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// Simple Chart Component (Mock)
function SimpleBarChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const max = Math.max(...data);

  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((value, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full bg-primary-500 rounded-t-md transition-all hover:bg-primary-600"
            style={{ height: `${(value / max) * 100}%` }}
          />
          <span className="text-xs text-gray-500">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}

// Donut Chart Component (Mock)
function DonutChart({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">
          {percentage.toFixed(0)}%
        </span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30days");

  const stats = mockSystemStats;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for charts
  const weeklyUsers = [45, 52, 38, 67, 82, 91, 78];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-500">System metrics and usage analytics</p>
        </div>
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input pr-10 appearance-none cursor-pointer"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">This Year</option>
          </select>
          <Calendar
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="text-blue-600" size={24} />}
            label="Total Users"
            value={formatNumber(stats.totalUsers)}
            change={{ value: 12, positive: true }}
            color="bg-blue-100"
          />
          <StatCard
            icon={<FileText className="text-purple-600" size={24} />}
            label="Total Documents"
            value={formatNumber(stats.totalDocuments)}
            change={{ value: 8, positive: true }}
            color="bg-purple-100"
          />
          <StatCard
            icon={<HardDrive className="text-green-600" size={24} />}
            label="Storage Used"
            value={formatBytes(stats.totalStorage)}
            color="bg-green-100"
          />
          <StatCard
            icon={<MessageCircle className="text-amber-600" size={24} />}
            label="AI Queries"
            value={formatNumber(stats.aiQueriesThisMonth)}
            change={{ value: 23, positive: true }}
            color="bg-amber-100"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">
            User Activity (This Week)
          </h3>
          {isLoading ? (
            <div className="h-40 bg-gray-100 rounded animate-pulse" />
          ) : (
            <SimpleBarChart data={weeklyUsers} labels={weeklyLabels} />
          )}
        </div>

        {/* Storage Usage */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Storage Usage</h3>
          {isLoading ? (
            <div className="h-32 w-32 mx-auto bg-gray-100 rounded-full animate-pulse" />
          ) : (
            <div className="flex flex-col items-center">
              <DonutChart
                value={stats.totalStorage}
                max={1099511627776}
                label="of 1TB"
              />
              <div className="mt-4 w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Documents</span>
                  <span className="font-medium">85GB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Embeddings</span>
                  <span className="font-medium">15GB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "API Server",
              status: "Healthy",
              icon: Cpu,
              uptime: "99.9%",
            },
            {
              label: "Worker AI",
              status: "Healthy",
              icon: MessageCircle,
              uptime: "99.7%",
            },
            {
              label: "Database",
              status: "Healthy",
              icon: Database,
              uptime: "99.99%",
            },
            {
              label: "Storage (S3)",
              status: "Healthy",
              icon: HardDrive,
              uptime: "99.95%",
            },
          ].map((service) => (
            <div key={service.label} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <service.icon size={20} className="text-gray-600" />
                <span className="font-medium text-gray-900">
                  {service.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {service.status}
                </span>
                <span className="text-sm text-gray-500">{service.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Token Usage */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">AI Token Usage</h3>
          <span className="text-sm text-gray-500">This month</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Used</span>
              <span className="text-sm font-medium">
                {formatNumber(stats.tokenUsage)} / 5M tokens
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all"
                style={{ width: `${(stats.tokenUsage / 5000000) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              ${((stats.tokenUsage / 1000) * 0.002).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Estimated Cost</p>
          </div>
        </div>
      </div>
    </div>
  );
}
