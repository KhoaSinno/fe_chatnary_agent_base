"use client";

import React, { useState } from "react";
import {
  Bell,
  FileText,
  MessageCircle,
  UserPlus,
  Settings,
  Trash2,
  CheckCircle,
  Check,
  Filter,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock notifications
interface Notification {
  id: string;
  type: "document" | "message" | "invite" | "system";
  title: string;
  description: string;
  time: string;
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "document",
    title: "Tài liệu đã xử lý xong",
    description:
      "Giáo trình Triết học Mác-Lênin.pdf đã sẵn sàng để sử dụng. Bạn có thể bắt đầu đặt câu hỏi cho AI về nội dung tài liệu này.",
    time: "09:15",
    date: "Hôm nay",
    read: false,
  },
  {
    id: "2",
    type: "invite",
    title: "Lời mời tham gia dự án",
    description:
      "Phạm Đức đã mời bạn vào dự án 'Ôn thi Kinh tế học'. Bấm vào đây để xem chi tiết và chấp nhận lời mời.",
    time: "08:30",
    date: "Hôm nay",
    read: false,
  },
  {
    id: "3",
    type: "message",
    title: "Tin nhắn mới từ AI",
    description:
      "Trả lời câu hỏi của bạn về 'Quy luật mâu thuẫn trong triết học' đã sẵn sàng. Xem ngay để tiếp tục cuộc trò chuyện.",
    time: "07:45",
    date: "Hôm nay",
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "Cập nhật hệ thống v2.1",
    description:
      "Tính năng mới: Quiz tự động từ tài liệu đã được thêm vào. Thử ngay bằng cách mở một project và chọn 'Tạo Quiz'.",
    time: "18:00",
    date: "Hôm qua",
    read: true,
  },
  {
    id: "5",
    type: "document",
    title: "Lỗi xử lý tài liệu",
    description:
      "file_corrupt.pdf không thể xử lý được do file bị hỏng. Vui lòng tải lên lại file với định dạng PDF chuẩn.",
    time: "14:20",
    date: "Hôm qua",
    read: true,
  },
  {
    id: "6",
    type: "invite",
    title: "Bạn đã được thêm vào dự án",
    description:
      "Nguyễn Thị Mai đã thêm bạn vào dự án 'Nghiên cứu Luật Dân sự'. Bạn có quyền Editor trong dự án này.",
    time: "10:15",
    date: "15/01/2026",
    read: true,
  },
  {
    id: "7",
    type: "message",
    title: "Phản hồi câu hỏi",
    description:
      "AI đã trả lời câu hỏi của bạn về 'Kinh tế vĩ mô'. Có 3 trích dẫn từ tài liệu liên quan.",
    time: "16:45",
    date: "14/01/2026",
    read: true,
  },
  {
    id: "8",
    type: "system",
    title: "Dung lượng lưu trữ",
    description:
      "Bạn đã sử dụng 80% dung lượng lưu trữ. Hãy xem xét xóa các tài liệu không cần thiết hoặc nâng cấp gói.",
    time: "09:00",
    date: "13/01/2026",
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
      className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
    >
      <Icon size={22} className={color} />
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    const matchesRead = filter === "all" || !n.read;
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    return matchesRead && matchesType;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const date = notification.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    },
    {} as Record<string, Notification[]>
  );

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

  const deleteAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <Bell size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
            <p className="text-slate-500">
              {unreadCount > 0
                ? `Bạn có ${unreadCount} thông báo chưa đọc`
                : "Tất cả thông báo đã được đọc"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" icon={Check} onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Button>
          )}
          {notifications.some((n) => n.read) && (
            <Button variant="ghost" icon={Trash2} onClick={deleteAllRead}>
              Xóa đã đọc
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Read Filter */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filter === "unread"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Chưa đọc
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none bg-white text-sm"
            >
              <option value="all">Tất cả loại</option>
              <option value="document">Tài liệu</option>
              <option value="message">Tin nhắn</option>
              <option value="invite">Lời mời</option>
              <option value="system">Hệ thống</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          <div className="flex-1" />

          <p className="text-sm text-slate-500">
            {filteredNotifications.length} thông báo
          </p>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-6">
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Bell size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Không có thông báo
            </h3>
            <p className="text-slate-500">
              {filter === "unread"
                ? "Bạn đã đọc tất cả thông báo!"
                : "Chưa có thông báo nào."}
            </p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([date, items]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-semibold text-slate-700">{date}</h2>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Notifications for this date */}
              <div className="space-y-2">
                {items.map((notification) => (
                  <div
                    key={notification.id}
                    className={`card p-4 hover:shadow-md transition-all cursor-pointer group relative ${
                      !notification.read
                        ? "bg-primary-50/50 border-primary-200"
                        : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-4">
                      <NotificationIcon type={notification.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`font-semibold ${
                                  notification.read
                                    ? "text-slate-700"
                                    : "text-slate-900"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          <Badge
                            variant={
                              notification.type === "document"
                                ? "default"
                                : notification.type === "message"
                                ? "default"
                                : notification.type === "invite"
                                ? "success"
                                : "warning"
                            }
                          >
                            {notification.type === "document" && "Tài liệu"}
                            {notification.type === "message" && "Tin nhắn"}
                            {notification.type === "invite" && "Lời mời"}
                            {notification.type === "system" && "Hệ thống"}
                          </Badge>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <Button variant="ghost">Xem thông báo cũ hơn</Button>
        </div>
      )}
    </div>
  );
}
