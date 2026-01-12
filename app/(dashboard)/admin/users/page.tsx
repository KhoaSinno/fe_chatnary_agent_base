"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Shield,
  ShieldOff,
  UserX,
  Mail,
  Calendar,
  UserPlus,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit3,
  Key,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Users,
  Crown,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge, Badge } from "@/components/ui/badge";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/modal";
import { mockUsers } from "@/lib/mock-data";
import { UserRole, User } from "@/lib/types";
import { useToast } from "@/components/ui/toast";
import { Pagination } from "@/components/ui/pagination";

// User Detail Modal
function UserDetailModal({
  user,
  onClose,
  onUpdateRole,
}: {
  user: User;
  onClose: () => void;
  onUpdateRole: (role: UserRole) => void;
}) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-8 bg-gradient-to-r from-primary-500 to-purple-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <XCircle size={20} />
          </button>
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-white/80">{user.email}</p>
              <div className="mt-2">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-slate-900">42</p>
              <p className="text-xs text-slate-500">Tài liệu</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-slate-900">156</p>
              <p className="text-xs text-slate-500">Câu hỏi AI</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-slate-900">8</p>
              <p className="text-xs text-slate-500">Dự án</p>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Email</span>
              <span className="font-medium text-slate-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Ngày tham gia</span>
              <span className="font-medium text-slate-900">
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Dung lượng sử dụng</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{
                      width: `${(user.quota.used / user.quota.limit) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900">
                  {formatBytes(user.quota.used)} /{" "}
                  {formatBytes(user.quota.limit)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">Trạng thái</span>
              <Badge variant="success">
                <CheckCircle size={12} className="mr-1" />
                Đang hoạt động
              </Badge>
            </div>

            {/* Role Selection */}
            <div className="py-3">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Thay đổi vai trò
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["user", "librarian", "admin"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedRole === role
                        ? "border-primary-500 bg-primary-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {role === "user" && (
                        <Sparkles size={20} className="text-blue-500" />
                      )}
                      {role === "librarian" && (
                        <BookOpen size={20} className="text-purple-500" />
                      )}
                      {role === "admin" && (
                        <Crown size={20} className="text-amber-500" />
                      )}
                      <span className="text-sm font-medium capitalize">
                        {role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" icon={Mail}>
              Gửi email
            </Button>
            <Button variant="ghost" size="sm" icon={Key}>
              Reset mật khẩu
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onUpdateRole(selectedRole);
                onClose();
              }}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add User Modal
function AddUserModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (user: Partial<User>) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as UserRole,
    sendInvite: true,
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-900">
            Thêm người dùng mới
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Họ tên
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Nhập họ tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Vai trò
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["user", "librarian", "admin"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.role === role
                      ? "border-primary-500 bg-primary-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-sm font-medium capitalize">{role}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.sendInvite}
              onChange={(e) =>
                setFormData({ ...formData, sendInvite: e.target.checked })
              }
              className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-700">
              Gửi email mời tham gia
            </span>
          </label>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onAdd(formData);
              onClose();
            }}
            disabled={!formData.name || !formData.email}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    userId: string;
    action: "ban" | "delete";
  } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: mockUsers.length,
      users: mockUsers.filter((u) => u.role === "user").length,
      librarians: mockUsers.filter((u) => u.role === "librarian").length,
      admins: mockUsers.filter((u) => u.role === "admin").length,
      activeToday: Math.floor(mockUsers.length * 0.7),
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleUpdateRole = (userId: string, role: UserRole) => {
    addToast({
      type: "success",
      title: "Cập nhật thành công",
      message: `Đã thay đổi vai trò người dùng thành ${role}`,
    });
  };

  const handleAddUser = (user: Partial<User>) => {
    addToast({
      type: "success",
      title: "Đã thêm người dùng",
      message: `Đã gửi email mời đến ${user.email}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý người dùng
          </h1>
          <p className="text-slate-500">
            Quản lý người dùng, vai trò và quyền hạn
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Download}>
            Xuất dữ liệu
          </Button>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setShowAddModal(true)}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Tổng cộng</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
            <Sparkles size={24} className="text-cyan-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.users}</p>
            <p className="text-sm text-slate-500">Users</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <BookOpen size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.librarians}
            </p>
            <p className="text-sm text-slate-500">Librarians</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Crown size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.admins}</p>
            <p className="text-sm text-slate-500">Admins</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <Activity size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.activeToday}
            </p>
            <p className="text-sm text-slate-500">Hoạt động hôm nay</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as UserRole | "all")
              }
              className="px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none bg-white"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="user">Users</option>
              <option value="librarian">Librarians</option>
              <option value="admin">Admins</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>

          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={() => setIsLoading(true)}
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Dung lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Ngày tham gia
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))
              : paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setViewingUser(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{
                                width: `${
                                  (user.quota.used / user.quota.limit) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {Math.round(
                              (user.quota.used / user.quota.limit) * 100
                            )}
                            %
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {formatBytes(user.quota.used)} /{" "}
                          {formatBytes(user.quota.limit)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">
                        <CheckCircle size={12} className="mr-1" />
                        Active
                      </Badge>
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative">
                        <IconButton
                          icon={MoreVertical}
                          size="sm"
                          onClick={() =>
                            setSelectedUserId(
                              selectedUserId === user.id ? null : user.id
                            )
                          }
                        />

                        {selectedUserId === user.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setSelectedUserId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20 animate-fadeIn">
                              <button
                                onClick={() => setViewingUser(user)}
                                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye size={16} className="text-slate-400" />
                                <span>Xem chi tiết</span>
                              </button>
                              <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Mail size={16} className="text-slate-400" />
                                <span>Gửi email</span>
                              </button>
                              <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Shield size={16} className="text-slate-400" />
                                <span>Thay đổi vai trò</span>
                              </button>
                              <hr className="my-2 border-slate-100" />
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    userId: user.id,
                                    action: "ban",
                                  })
                                }
                                className="w-full px-4 py-2.5 text-left text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                              >
                                <ShieldOff size={16} />
                                <span>Cấm người dùng</span>
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    userId: user.id,
                                    action: "delete",
                                  })
                                }
                                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <UserX size={16} />
                                <span>Xóa người dùng</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {/* User Detail Modal */}
      {viewingUser && (
        <UserDetailModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          onUpdateRole={(role) => handleUpdateRole(viewingUser.id, role)}
        />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddUser}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction?.action === "ban") {
            addToast({
              type: "warning",
              title: "Đã cấm người dùng",
              message: "Người dùng sẽ không thể truy cập hệ thống.",
            });
          } else {
            addToast({
              type: "success",
              title: "Đã xóa người dùng",
              message: "Người dùng đã được xóa khỏi hệ thống.",
            });
          }
          setConfirmAction(null);
        }}
        title={
          confirmAction?.action === "ban" ? "Cấm người dùng" : "Xóa người dùng"
        }
        message={
          confirmAction?.action === "ban"
            ? "Bạn có chắc muốn cấm người dùng này? Họ sẽ không thể truy cập hệ thống."
            : "Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác."
        }
        confirmLabel={confirmAction?.action === "ban" ? "Cấm" : "Xóa"}
        variant={confirmAction?.action === "delete" ? "danger" : "default"}
      />
    </div>
  );
}
