import React from "react";
import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
}) => {
  const variants = {
    default: "border border-color-theme bg-color-for-layer-sec first-text-color-for-paragraph",
    success: "border border-status-success bg-status-success text-status-success",
    warning: "border border-status-warning bg-status-warning text-status-warning",
    danger: "border border-status-danger bg-status-danger text-status-danger",
    info: "border border-status-info bg-status-info text-status-info",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
