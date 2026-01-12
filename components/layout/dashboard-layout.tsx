"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Sparkles,
  Command,
  FileText,
  MessageCircle,
  UserPlus,
  CheckCircle,
  X,
  Settings,
  Trash2,
} from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { IconButton } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { ToastProvider } from "@/components/ui/toast";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Mock notifications
interface Notification {
  id: string;
  type: "document" | "message" | "invite" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "document",
    title: "Tài liệu đã xử lý xong",
    description: "Giáo trình Triết học Mác-Lênin.pdf đã sẵn sàng để sử dụng",
    time: "5 phút trước",
    read: false,
  },
  {
    id: "2",
    type: "invite",
    title: "Lời mời tham gia dự án",
    description: "Phạm Đức đã mời bạn vào dự án 'Ôn thi Kinh tế học'",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: "3",
    type: "message",
    title: "Tin nhắn mới từ AI",
    description: "Trả lời câu hỏi của bạn về Triết học đã sẵn sàng",
    time: "2 giờ trước",
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "Cập nhật hệ thống",
    description: "Tính năng mới: Quiz tự động từ tài liệu",
    time: "1 ngày trước",
    read: true,
  },
  {
    id: "5",
    type: "document",
    title: "Lỗi xử lý tài liệu",
    description: "file_corrupt.pdf không thể xử lý được",
    time: "2 ngày trước",
    read: true,
  },
];

function NotificationIcon({ type }: { type: Notification["type"] }) {
  const config = {
    document: { icon: FileText, bg: "bg-blue-100", color: "text-blue-600" },
    message: {
      icon: MessageCircle,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    invite: { icon: UserPlus, bg: "bg-green-100", color: "text-green-600" },
    system: { icon: Settings, bg: "bg-amber-100", color: "text-amber-600" },
  };

  const { icon: Icon, bg, color } = config[type];

  return (
    <div
      className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
    >
      <Icon size={18} className={color} />
    </div>
  );
}

function NotificationDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-fadeIn"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
              {unreadCount} mới
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Đánh dấu đã đọc
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-xl flex items-center justify-center">
              <Bell size={24} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">Không có thông báo nào</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group relative ${
                !notification.read ? "bg-primary-50/30" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex gap-3">
                <NotificationIcon type={notification.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-medium ${
                        notification.read ? "text-slate-700" : "text-slate-900"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {notification.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>

              {/* Delete button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <Link
          href="/notifications"
          className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
          onClick={onClose}
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const { currentUser } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search documents, projects..."
                className="w-full pl-11 pr-20 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-primary-300 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
                <Command size={12} />
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-4">
            {/* AI Chat Button */}
            <Link
              href="/chat"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">AI Chat</span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors relative"
                title="Thông báo"
              >
                <Bell size={20} className="text-slate-600" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  3
                </span>
              </button>

              <NotificationDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {currentUser && (
                <Link
                  href="/profile"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  title="Xem hồ sơ cá nhân"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-800">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-slate-500">{currentUser.role}</p>
                  </div>
                  <div className="relative">
                    <Avatar name={currentUser.name} size="md" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
          {/* Background Pattern */}
          <div className="fixed top-16 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 left-72 w-[400px] h-[400px] bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="p-8 relative z-10 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardContent>{children}</DashboardContent>
      </ToastProvider>
    </AuthProvider>
  );
}
