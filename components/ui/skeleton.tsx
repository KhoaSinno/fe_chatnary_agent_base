"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "shimmer";
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "shimmer",
}: SkeletonProps) {
  const baseClass = animation === "shimmer" ? "skeleton-shimmer" : "skeleton";

  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`${baseClass} ${variantStyles[variant]} ${className}`}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

// Document Card Skeleton
export function DocumentCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton variant="rectangular" width={40} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={20} className="w-3/4" />
          <Skeleton variant="text" height={14} className="w-1/2" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
    </div>
  );
}

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={12} height={12} />
        <Skeleton variant="text" height={24} className="w-2/3" />
      </div>
      <Skeleton variant="text" height={16} className="w-full" />
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="circular" width={28} height={28} />
          ))}
        </div>
        <Skeleton variant="text" width={80} height={14} className="ml-auto" />
      </div>
    </div>
  );
}

// Chat Message Skeleton
export function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? "order-2" : ""}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={60} height={14} />
          </div>
        )}
        <div
          className={`p-4 rounded-2xl ${
            isUser ? "bg-primary-100" : "bg-gray-100"
          }`}
        >
          <div className="space-y-2">
            <Skeleton variant="text" height={16} className="w-full" />
            <Skeleton variant="text" height={16} className="w-5/6" />
            <Skeleton variant="text" height={16} className="w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Document Viewer Skeleton
export function DocumentViewerSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="text" width={80} height={20} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
        </div>
      </div>
      {/* Document Content */}
      <div className="flex-1 p-6 space-y-4 overflow-hidden">
        <Skeleton variant="text" height={32} className="w-3/4" />
        <Skeleton variant="text" height={16} className="w-full" />
        <Skeleton variant="text" height={16} className="w-full" />
        <Skeleton variant="text" height={16} className="w-5/6" />
        <div className="py-4" />
        <Skeleton variant="text" height={24} className="w-1/2" />
        <Skeleton variant="text" height={16} className="w-full" />
        <Skeleton variant="text" height={16} className="w-full" />
        <Skeleton variant="text" height={16} className="w-4/5" />
        <div className="py-4" />
        <Skeleton variant="rectangular" height={200} className="w-full" />
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton variant="text" height={16} className="w-full" />
        </td>
      ))}
    </tr>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={100} height={14} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton variant="text" width={80} height={32} />
      <Skeleton variant="text" width={120} height={14} />
    </div>
  );
}
