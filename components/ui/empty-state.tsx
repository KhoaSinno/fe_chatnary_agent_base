"use client";

import React from "react";
import { FolderOpen, FileQuestion, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon || <FolderOpen className="text-gray-400" size={32} />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// No Documents State
export function NoDocumentsState({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={<FileQuestion className="text-gray-400" size={32} />}
      title="No documents yet"
      description="Upload your first document to get started with RAG-powered Q&A"
      action={
        onUpload ? { label: "Upload Document", onClick: onUpload } : undefined
      }
    />
  );
}

// No Projects State
export function NoProjectsState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<FolderOpen className="text-gray-400" size={32} />}
      title="No projects yet"
      description="Create a project to organize your documents and collaborate with others"
      action={
        onCreate ? { label: "Create Project", onClick: onCreate } : undefined
      }
    />
  );
}

// Error State Component
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertCircle className="text-red-500" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

// No Results State
export function NoResultsState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<FileQuestion className="text-gray-400" size={32} />}
      title="No results found"
      description={
        query
          ? `No results match "${query}". Try adjusting your search.`
          : "No results match your criteria. Try adjusting your filters."
      }
    />
  );
}
