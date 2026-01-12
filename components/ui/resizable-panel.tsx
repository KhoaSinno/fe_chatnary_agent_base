"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  position: "left" | "right";
  collapsed?: boolean;
  collapsedWidth?: number;
  className?: string;
}

export function ResizablePanel({
  children,
  defaultWidth,
  minWidth,
  maxWidth,
  position,
  collapsed = false,
  collapsedWidth = 48,
  className = "",
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = width;
    },
    [width]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const delta =
        position === "left"
          ? e.clientX - startXRef.current
          : startXRef.current - e.clientX;

      const newWidth = Math.min(
        maxWidth,
        Math.max(minWidth, startWidthRef.current + delta)
      );
      setWidth(newWidth);
    },
    [isResizing, minWidth, maxWidth, position]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const actualWidth = collapsed ? collapsedWidth : width;

  return (
    <div
      ref={panelRef}
      className={`relative flex-shrink-0 ${className}`}
      style={{
        width: actualWidth,
        transition: isResizing ? "none" : "width 0.2s ease-out",
      }}
    >
      {children}

      {/* Resize Handle */}
      {!collapsed && (
        <div
          className={`absolute top-0 bottom-0 w-4 z-10 cursor-col-resize group ${
            position === "left" ? "-right-2" : "-left-2"
          }`}
          onMouseDown={handleMouseDown}
        >
          {/* Visual Line */}
          <div
            className={`absolute top-0 bottom-0 w-[3px] transition-all duration-150 ${
              position === "left"
                ? "left-1/2 -translate-x-1/2"
                : "left-1/2 -translate-x-1/2"
            } ${
              isResizing
                ? "bg-primary-500 shadow-[0_0_8px_rgba(52,120,246,0.5)]"
                : "bg-transparent group-hover:bg-primary-400"
            }`}
          />

          {/* Grip Handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
              isResizing
                ? "bg-primary-500 text-white shadow-lg scale-110"
                : "bg-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-slate-300"
            }`}
          >
            <GripVertical size={12} />
          </div>
        </div>
      )}
    </div>
  );
}

// Three-panel layout with resizable panels
interface ResizablePanelGroupProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftPanelConfig?: {
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    collapsed?: boolean;
    collapsedWidth?: number;
  };
  rightPanelConfig?: {
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    collapsed?: boolean;
    collapsedWidth?: number;
  };
  className?: string;
}

export function ResizablePanelGroup({
  leftPanel,
  centerPanel,
  rightPanel,
  leftPanelConfig = {},
  rightPanelConfig = {},
  className = "",
}: ResizablePanelGroupProps) {
  const {
    defaultWidth: leftDefaultWidth = 224,
    minWidth: leftMinWidth = 150,
    maxWidth: leftMaxWidth = 400,
    collapsed: leftCollapsed = false,
    collapsedWidth: leftCollapsedWidth = 48,
  } = leftPanelConfig;

  const {
    defaultWidth: rightDefaultWidth = 380,
    minWidth: rightMinWidth = 280,
    maxWidth: rightMaxWidth = 600,
    collapsed: rightCollapsed = false,
    collapsedWidth: rightCollapsedWidth = 48,
  } = rightPanelConfig;

  const [leftWidth, setLeftWidth] = useState(leftDefaultWidth);
  const [rightWidth, setRightWidth] = useState(rightDefaultWidth);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleLeftMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizingLeft(true);
      startXRef.current = e.clientX;
      startWidthRef.current = leftWidth;
    },
    [leftWidth]
  );

  const handleRightMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizingRight(true);
      startXRef.current = e.clientX;
      startWidthRef.current = rightWidth;
    },
    [rightWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizingLeft) {
        const delta = e.clientX - startXRef.current;
        const newWidth = Math.min(
          leftMaxWidth,
          Math.max(leftMinWidth, startWidthRef.current + delta)
        );
        setLeftWidth(newWidth);
      } else if (isResizingRight) {
        const delta = startXRef.current - e.clientX;
        const newWidth = Math.min(
          rightMaxWidth,
          Math.max(rightMinWidth, startWidthRef.current + delta)
        );
        setRightWidth(newWidth);
      }
    },
    [
      isResizingLeft,
      isResizingRight,
      leftMinWidth,
      leftMaxWidth,
      rightMinWidth,
      rightMaxWidth,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  }, []);

  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp]);

  const actualLeftWidth = leftCollapsed ? leftCollapsedWidth : leftWidth;
  const actualRightWidth = rightCollapsed ? rightCollapsedWidth : rightWidth;
  const isResizing = isResizingLeft || isResizingRight;

  return (
    <div className={`flex gap-0 ${className}`}>
      {/* Left Panel */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: actualLeftWidth,
          transition: isResizing ? "none" : "width 0.2s ease-out",
        }}
      >
        {leftPanel}

        {/* Left Resize Handle */}
        {!leftCollapsed && (
          <div
            className="absolute top-0 bottom-0 -right-1.5 w-3 z-10 cursor-col-resize group"
            onMouseDown={handleLeftMouseDown}
          >
            <div
              className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] rounded-full transition-all duration-150 ${
                isResizingLeft
                  ? "bg-primary-500 shadow-[0_0_8px_rgba(52,120,246,0.5)]"
                  : "bg-transparent group-hover:bg-primary-400"
              }`}
            />
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-10 rounded-full flex items-center justify-center transition-all duration-150 ${
                isResizingLeft
                  ? "bg-primary-500 text-white shadow-lg scale-110"
                  : "bg-slate-200/80 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-slate-300"
              }`}
            >
              <GripVertical size={12} />
            </div>
          </div>
        )}
      </div>

      {/* Center Panel */}
      <div className="flex-1 min-w-0 mx-3">{centerPanel}</div>

      {/* Right Panel */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: actualRightWidth,
          transition: isResizing ? "none" : "width 0.2s ease-out",
        }}
      >
        {/* Right Resize Handle */}
        {!rightCollapsed && (
          <div
            className="absolute top-0 bottom-0 -left-1.5 w-3 z-10 cursor-col-resize group"
            onMouseDown={handleRightMouseDown}
          >
            <div
              className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] rounded-full transition-all duration-150 ${
                isResizingRight
                  ? "bg-primary-500 shadow-[0_0_8px_rgba(52,120,246,0.5)]"
                  : "bg-transparent group-hover:bg-primary-400"
              }`}
            />
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-10 rounded-full flex items-center justify-center transition-all duration-150 ${
                isResizingRight
                  ? "bg-primary-500 text-white shadow-lg scale-110"
                  : "bg-slate-200/80 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-slate-300"
              }`}
            >
              <GripVertical size={12} />
            </div>
          </div>
        )}

        {rightPanel}
      </div>
    </div>
  );
}
