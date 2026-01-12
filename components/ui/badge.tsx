"use client";

import React from "react";
import { Loader2, CheckCircle, AlertCircle, XCircle } from "lucide-react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-primary-100 text-primary-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({
  children,
  variant = "default",
  className = "",
  icon,
}: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}

// Status Badge Component
type DocumentStatus = "processing" | "done" | "error";

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const configs: Record<
    DocumentStatus,
    { label: string; variant: BadgeVariant; icon: React.ReactNode }
  > = {
    processing: {
      label: "Processing",
      variant: "warning",
      icon: <Loader2 size={12} className="animate-spin" />,
    },
    done: {
      label: "Done",
      variant: "success",
      icon: <CheckCircle size={12} />,
    },
    error: {
      label: "Error",
      variant: "error",
      icon: <AlertCircle size={12} />,
    },
  };

  const config = configs[status];

  return (
    <Badge variant={config.variant} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  );
}

// Role Badge Component
type UserRole = "user" | "librarian" | "admin";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  const configs: Record<UserRole, { label: string; variant: BadgeVariant }> = {
    user: { label: "User", variant: "default" },
    librarian: { label: "Librarian", variant: "primary" },
    admin: { label: "Admin", variant: "error" },
  };

  const config = configs[role];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

// Access Badge Component
type AccessLevel = "public" | "members" | "faculty";

interface AccessBadgeProps {
  access: AccessLevel;
  className?: string;
}

export function AccessBadge({ access, className = "" }: AccessBadgeProps) {
  const configs: Record<AccessLevel, { label: string; variant: BadgeVariant }> =
    {
      public: { label: "Public", variant: "success" },
      members: { label: "Members Only", variant: "primary" },
      faculty: { label: "Faculty Only", variant: "warning" },
    };

  const config = configs[access];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
