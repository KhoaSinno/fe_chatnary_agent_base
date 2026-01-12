"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  FolderKanban,
  Upload,
  Clock,
  TrendingUp,
  BookOpen,
  Sparkles,
  ArrowRight,
  Plus,
  MessageCircle,
  Zap,
  Brain,
  Target,
  ArrowUpRight,
  Trophy,
  Flame,
  Star,
  Play,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import {
  ProjectCardSkeleton,
  DocumentCardSkeleton,
} from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import {
  mockProjects,
  mockDocuments,
  getUserById,
  getDocumentsByProjectId,
} from "@/lib/mock-data";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Animated Stat Card
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  gradient: string;
  delay?: number;
}

function StatCard({
  icon,
  label,
  value,
  trend,
  gradient,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="group relative bg-white rounded-2xl p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden border border-slate-100"
      style={{
        animation: "fadeInUp 0.5s ease-out both",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Animated gradient background */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 ${gradient} rounded-full blur-2xl opacity-30 group-hover:opacity-50 group-hover:scale-150 transition-all duration-500`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
          >
            {icon}
          </div>
          {trend && (
            <span
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${
                trend.positive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <TrendingUp
                size={12}
                className={trend.positive ? "" : "rotate-180"}
              />
              {trend.value}%
            </span>
          )}
        </div>
        <p className="text-4xl font-bold text-slate-900 tracking-tight mb-1">
          {value}
        </p>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const userProjects = mockProjects.filter((p) =>
    p.members.some((m) => m.userId === currentUser?.id)
  );
  const recentDocuments = mockDocuments
    .filter((d) => d.uploadedBy === currentUser?.id)
    .slice(0, 4);
  const totalDocuments = mockDocuments.filter(
    (d) => d.uploadedBy === currentUser?.id
  ).length;
  const processingDocs = mockDocuments.filter(
    (d) => d.uploadedBy === currentUser?.id && d.status === "processing"
  ).length;
  const storageUsed = mockDocuments
    .filter((d) => d.uploadedBy === currentUser?.id)
    .reduce((acc, d) => acc + d.size, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section with Gradient */}
      <div
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">👋</span>
              <div className="h-8 w-px bg-white/30" />
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full">
                <Flame size={14} className="text-orange-300" />
                <span className="text-sm font-semibold text-white">
                  5 ngày liên tiếp!
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Xin chào, {currentUser?.name?.split(" ").pop()}!
            </h1>
            <p className="text-white/80 text-lg max-w-md">
              Sẵn sàng cho một ngày học tập hiệu quả? Tôi đã chuẩn bị mọi thứ
              cho bạn.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="group flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all">
              <Plus size={18} />
              <span>Project mới</span>
            </button>
            <button className="group flex items-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
              <Upload size={18} />
              <span>Upload tài liệu</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<FileText className="text-white" size={24} />}
          label="Tổng tài liệu"
          value={totalDocuments}
          trend={{ value: 12, positive: true }}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          delay={0}
        />
        <StatCard
          icon={<FolderKanban className="text-white" size={24} />}
          label="Projects đang hoạt động"
          value={userProjects.length}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          delay={100}
        />
        <StatCard
          icon={<Clock className="text-white" size={24} />}
          label="Đang xử lý"
          value={processingDocs}
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          delay={200}
        />
        <StatCard
          icon={<BookOpen className="text-white" size={24} />}
          label="Dung lượng đã dùng"
          value={formatBytes(storageUsed)}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
          delay={300}
        />
      </div>

      {/* AI Features Banner - Premium */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        }}
      >
        {/* Animated orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />

        <div className="relative p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 rounded-full mb-4">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-sm font-semibold text-white">
                  AI-Powered Learning
                </span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Học thông minh hơn với{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Chatnary AI
                </span>
              </h3>

              <p className="text-slate-400 text-lg max-w-lg mb-6">
                Trò chuyện với tài liệu, tạo đề thi tự động, và nhận câu trả lời
                chính xác với trích dẫn nguồn.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/chat">
                  <button className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <MessageCircle size={20} />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm opacity-80">Bắt đầu</span>
                      <span className="block font-bold">Chat với AI</span>
                    </div>
                    <ChevronRight
                      size={20}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </Link>

                <button className="group flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Brain size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm opacity-80">Luyện tập</span>
                    <span className="block font-bold">AI Exam</span>
                  </div>
                </button>
              </div>
            </div>

            {/* AI Preview */}
            <div className="relative w-full lg:w-auto">
              <div className="relative bg-slate-800/50 backdrop-blur border border-white/10 rounded-2xl p-5 w-full lg:w-80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Chatnary AI
                    </p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Đang hoạt động
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-300">
                  "Xin chào! Tôi có thể giúp bạn tóm tắt tài liệu, trả lời câu
                  hỏi, và tạo đề thi từ nội dung học..."
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                  <span className="text-xs text-slate-500">Đang gõ...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
              <h2 className="text-xl font-bold text-slate-900">
                Projects gần đây
              </h2>
            </div>
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold"
            >
              Xem tất cả
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProjects.slice(0, 4).map((project, idx) => {
                const projectDocs = getDocumentsByProjectId(project.id);
                const memberUsers = project.members
                  .map((m) => getUserById(m.userId))
                  .filter(Boolean);
                return (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div
                      className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500"
                      style={{
                        animation: "fadeInUp 0.5s ease-out both",
                        animationDelay: `${idx * 100}ms`,
                      }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${project.color} 0%, ${project.color}dd 100%)`,
                            boxShadow: `0 8px 24px ${project.color}40`,
                          }}
                        >
                          <FolderKanban className="text-white" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                            {project.name}
                          </h3>
                          <p className="text-sm text-slate-500 truncate">
                            {project.description || "No description"}
                          </p>
                        </div>
                        <ArrowUpRight
                          size={18}
                          className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-primary-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <AvatarGroup
                          users={memberUsers.map((u) => ({
                            name: u!.name,
                            avatar: u!.avatar,
                          }))}
                          max={4}
                          size="sm"
                        />
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg">
                            <FileText size={12} />
                            {projectDocs.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
              <h2 className="text-xl font-bold text-slate-900">
                Files gần đây
              </h2>
            </div>
            <Link
              href="/library"
              className="group flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold"
            >
              Xem tất cả
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <DocumentCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="group bg-white rounded-xl border border-slate-100 p-4 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: "fadeInUp 0.4s ease-out both",
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        doc.type === "pdf"
                          ? "bg-gradient-to-br from-red-100 to-red-50 border border-red-200"
                          : "bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200"
                      }`}
                    >
                      <FileText
                        size={22}
                        className={
                          doc.type === "pdf" ? "text-red-600" : "text-blue-600"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatBytes(doc.size)}
                      </p>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <Zap size={22} />,
            title: "Quick Upload",
            desc: "Kéo thả để upload",
            gradient: "from-amber-500 to-orange-500",
            bg: "bg-amber-50 hover:bg-amber-100",
          },
          {
            icon: <Target size={22} />,
            title: "AI Exam",
            desc: "Luyện thi tự động",
            gradient: "from-emerald-500 to-teal-500",
            bg: "bg-emerald-50 hover:bg-emerald-100",
          },
          {
            icon: <MessageCircle size={22} />,
            title: "Smart Chat",
            desc: "Chat với tài liệu",
            gradient: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50 hover:bg-blue-100",
          },
          {
            icon: <Star size={22} />,
            title: "Bookmarks",
            desc: "Tài liệu đã lưu",
            gradient: "from-purple-500 to-pink-500",
            bg: "bg-purple-50 hover:bg-purple-100",
          },
        ].map((action, i) => (
          <button
            key={i}
            className={`group ${action.bg} border border-transparent hover:border-slate-200 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            style={{
              animation: "fadeInUp 0.4s ease-out both",
              animationDelay: `${i * 50}ms`,
            }}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform`}
            >
              {action.icon}
            </div>
            <p className="font-bold text-slate-900 mb-1">{action.title}</p>
            <p className="text-sm text-slate-600">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
