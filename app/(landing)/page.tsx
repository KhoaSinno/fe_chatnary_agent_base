"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  BookOpen,
  Brain,
  Users,
  ArrowRight,
  FileText,
  MessageCircle,
  Zap,
  CheckCircle2,
  Star,
  Play,
  ChevronRight,
  GraduationCap,
  Shield,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Thư viện thông minh",
      description:
        "Upload và quản lý tài liệu PDF/DOCX với AI tự động phân tích và indexing.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Chat với tài liệu",
      description:
        "Hỏi đáp trực tiếp với AI dựa trên nội dung tài liệu của bạn.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Brain size={24} />,
      title: "AI Exam Simulator",
      description:
        "Tạo đề thi trắc nghiệm tự động từ tài liệu với giải thích chi tiết.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <Users size={24} />,
      title: "Cộng tác nhóm",
      description: "Chia sẻ và làm việc cùng nhau trên các project học tập.",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const publicDocs = [
    {
      name: "Giáo trình Triết học Mác-Lênin",
      category: "Triết học",
      downloads: "2.3k",
    },
    {
      name: "Introduction to Machine Learning",
      category: "AI/ML",
      downloads: "1.8k",
    },
    { name: "Kinh tế vĩ mô cơ bản", category: "Kinh tế", downloads: "1.5k" },
    { name: "Data Structures & Algorithms", category: "CS", downloads: "1.2k" },
  ];

  const stats = [
    { value: "10,000+", label: "Người dùng" },
    { value: "50,000+", label: "Tài liệu" },
    { value: "1M+", label: "Câu hỏi AI" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Chatnary</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Tính năng
            </a>
            <a
              href="#library"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Thư viện
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Bảng giá
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-slate-700 font-semibold hover:text-slate-900"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all"
            >
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
              <Zap size={16} />
              <span>AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
              Học thông minh hơn
              <br />
              <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                với trợ lý AI
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Biến tài liệu PDF thành kiến thức có thể tương tác. Chat, hỏi đáp,
              tạo đề thi tự động cùng AI tiên tiến nhất.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all"
              >
                <span>Bắt đầu miễn phí</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all">
                <Play size={20} className="text-primary-500" />
                <span>Xem demo</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={22}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu công khai..."
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl text-lg shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                Enter ↵
              </span>
            </div>
            <p className="text-center text-sm text-slate-500 mt-3">
              Hoặc{" "}
              <Link
                href="/login"
                className="text-primary-600 font-semibold hover:underline"
              >
                đăng nhập
              </Link>{" "}
              để truy cập đầy đủ
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-slate-200">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Công nghệ AI tiên tiến giúp bạn học tập hiệu quả hơn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Library Preview */}
      <section id="library" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Thư viện công khai
              </h2>
              <p className="text-xl text-slate-600">
                Khám phá hàng nghìn tài liệu học tập miễn phí
              </p>
            </div>
            <Link
              href="/login"
              className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
            >
              Xem tất cả
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicDocs.map((doc, idx) => (
              <div
                key={idx}
                className="group p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-50 border border-red-200 flex items-center justify-center mb-4">
                  <FileText size={24} className="text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {doc.name}
                </h3>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{doc.category}</span>
                  <span>{doc.downloads} lượt xem</span>
                </div>
              </div>
            ))}
          </div>

          {/* Preview Notice */}
          <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-800">Chế độ xem trước</p>
              <p className="text-sm text-amber-700">
                Đăng nhập để xem toàn bộ nội dung và sử dụng tính năng AI chat,
                tạo đề thi.
              </p>
            </div>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors flex-shrink-0"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <GraduationCap size={48} className="mx-auto mb-6 text-primary-400" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn sàng nâng cấp
            <br />
            trải nghiệm học tập?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn sinh viên và giảng viên đang sử dụng
            Chatnary mỗi ngày.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <span>Bắt đầu miễn phí ngay</span>
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">Chatnary</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Chatnary. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-900">
              Điều khoản
            </a>
            <a href="#" className="hover:text-slate-900">
              Bảo mật
            </a>
            <a href="#" className="hover:text-slate-900">
              Liên hệ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
