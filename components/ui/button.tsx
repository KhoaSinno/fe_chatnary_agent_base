"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost",
    danger: "btn-danger",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
    icon: "btn-icon",
  };

  const iconSizes: Record<ButtonSize, number> = {
    sm: 14,
    md: 16,
    lg: 18,
    icon: 18,
  };

  return (
    <button
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children && <span>Loading...</span>}
        </span>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={iconSizes[size]} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={iconSizes[size]} />}
        </>
      )}
    </button>
  );
}

// Icon Button Component
interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  tooltip?: string;
}

export function IconButton({
  icon: Icon,
  variant = "ghost",
  size = "md",
  tooltip,
  className = "",
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-600 hover:bg-gray-50",
    ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    danger: "text-red-500 hover:bg-red-50",
  };

  return (
    <button
      className={`rounded-lg transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={tooltip}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
}
