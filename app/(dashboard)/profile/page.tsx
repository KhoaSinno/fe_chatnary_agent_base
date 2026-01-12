"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Bell,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "Nguyễn Văn An",
    email: currentUser?.email || "nguyen.vanan@university.edu.vn",
    phone: "0901234567",
    bio: "Sinh viên năm 3, khoa Công nghệ Thông tin",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    marketing: false,
  });

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "notifications", label: "Thông báo", icon: Bell },
  ];

  const storageUsed = 2.1;
  const storageTotal = 5;
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Cài đặt tài khoản
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý thông tin và bảo mật tài khoản của bạn
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profileData.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                  <Camera size={14} className="text-slate-600" />
                </button>
              </div>
              <h3 className="font-bold text-slate-900">{profileData.name}</h3>
              <p className="text-sm text-slate-500">{profileData.email}</p>
              <span className="mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                {currentUser?.role || "User"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
                <ChevronRight size={16} className="ml-auto" />
              </button>
            ))}
          </nav>

          {/* Storage */}
          <div className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">
                Dung lượng
              </span>
              <span className="text-xs font-bold text-primary-600">
                {storageUsed} / {storageTotal} GB
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${storagePercent}%`,
                  background:
                    "linear-gradient(90deg, #3478f6 0%, #9333ea 100%)",
                }}
              />
            </div>
            <button className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-700">
              Nâng cấp dung lượng →
            </button>
          </div>

          {/* Danger Zone */}
          <div className="mt-6 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
              <LogOut size={20} />
              <span>Đăng xuất</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
              <Trash2 size={20} />
              <span>Xóa tài khoản</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Thông tin cá nhân
                  </h2>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Hủy
                      </Button>
                      <Button
                        variant="primary"
                        icon={Save}
                        onClick={handleSaveProfile}
                        loading={isSaving}
                      >
                        Lưu thay đổi
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Vai trò
                    </label>
                    <input
                      type="text"
                      value={currentUser?.role || "User"}
                      disabled
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 capitalize"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Giới thiệu
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Bảo mật
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">
                      Đổi mật khẩu
                    </h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.current}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                current: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showCurrentPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.new}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                new: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showNewPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirm: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                      <Button variant="primary">Cập nhật mật khẩu</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-4">
                      Phiên đăng nhập
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          device: "Windows PC - Chrome",
                          location: "Hà Nội, VN",
                          current: true,
                        },
                        {
                          device: "iPhone 14 - Safari",
                          location: "Hà Nội, VN",
                          current: false,
                        },
                      ].map((session, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-slate-800">
                              {session.device}
                            </p>
                            <p className="text-sm text-slate-500">
                              {session.location}
                            </p>
                          </div>
                          {session.current ? (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                              Phiên hiện tại
                            </span>
                          ) : (
                            <button className="text-sm text-red-600 font-semibold hover:text-red-700">
                              Đăng xuất
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Cài đặt thông báo
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      key: "email",
                      label: "Thông báo qua email",
                      desc: "Nhận thông báo quan trọng qua email",
                    },
                    {
                      key: "push",
                      label: "Thông báo đẩy",
                      desc: "Nhận thông báo trên trình duyệt",
                    },
                    {
                      key: "updates",
                      label: "Cập nhật sản phẩm",
                      desc: "Thông tin về tính năng mới và cập nhật",
                    },
                    {
                      key: "marketing",
                      label: "Tin tức và khuyến mãi",
                      desc: "Nhận tin tức và ưu đãi đặc biệt",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {item.label}
                        </p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            [item.key]:
                              !notifications[
                                item.key as keyof typeof notifications
                              ],
                          })
                        }
                        className={`relative w-12 h-7 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications]
                            ? "bg-primary-500"
                            : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications[
                              item.key as keyof typeof notifications
                            ]
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
