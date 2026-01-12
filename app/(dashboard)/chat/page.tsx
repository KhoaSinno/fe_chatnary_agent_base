"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  User,
  Plus,
  Clock,
  Zap,
  Brain,
  Search,
  MoreHorizontal,
  Trash2,
  Star,
  Mic,
  Paperclip,
  Image as ImageIcon,
  ArrowDown,
  Pencil,
  X,
  Settings,
  ChevronRight,
} from "lucide-react";
import { ChatMessage, Citation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { mockDocuments } from "@/lib/mock-data";

// Initial welcome message - timestamp will be set on client side to avoid hydration mismatch
const getInitialMessages = (): ChatMessage[] => [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Xin chào! 👋 Tôi là **Chatnary AI**, trợ lý học tập thông minh của bạn.\n\nTôi có thể giúp bạn:\n\n• 🔍 **Tìm kiếm thông tin** trong tất cả tài liệu\n• 💡 **Giải đáp thắc mắc** về nội dung học\n• 📝 **Tóm tắt và phân tích** tài liệu\n• 🎯 **Tạo đề thi thử** để ôn luyện\n\nHãy hỏi bất kỳ điều gì bạn muốn biết!",
    timestamp: "", // Will be set on client mount
  },
];

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  icon: string;
  messageCount: number;
}

const mockSessions: ChatSession[] = [
  {
    id: "1",
    title: "Triết học Mác-Lênin",
    lastMessage: "Nguyên lý về mối liên hệ phổ biến...",
    updatedAt: "2 giờ trước",
    icon: "📚",
    messageCount: 12,
  },
  {
    id: "2",
    title: "Machine Learning Basics",
    lastMessage: "Deep learning là một phân ngành...",
    updatedAt: "Hôm qua",
    icon: "🤖",
    messageCount: 8,
  },
  {
    id: "3",
    title: "Kinh tế chính trị",
    lastMessage: "Quy luật giá trị là...",
    updatedAt: "3 ngày trước",
    icon: "📊",
    messageCount: 5,
  },
  {
    id: "4",
    title: "Lập trình Python",
    lastMessage: "Các kiểu dữ liệu cơ bản trong Python...",
    updatedAt: "5 ngày trước",
    icon: "🐍",
    messageCount: 15,
  },
];

// Simple markdown renderer
function renderMarkdown(content: string) {
  // Bold
  let html = content.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold">$1</strong>'
  );
  // Code
  html = html.replace(
    /`(.*?)`/g,
    '<code class="px-1.5 py-0.5 bg-slate-100 rounded text-sm font-mono">$1</code>'
  );
  // Line breaks
  html = html.replace(/\n/g, "<br/>");
  return html;
}

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize messages on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const initialMsgs = getInitialMessages();
    initialMsgs[0].timestamp = new Date().toISOString();
    setMessages(initialMsgs);
  }, []);

  const suggestions = [
    {
      text: "Tóm tắt nội dung chính của tài liệu",
      icon: "📝",
      color: "from-blue-500 to-cyan-500",
    },
    {
      text: "So sánh các quan điểm trong bài học",
      icon: "⚖️",
      color: "from-purple-500 to-pink-500",
    },
    {
      text: "Giải thích khái niệm quan trọng",
      icon: "💡",
      color: "from-amber-500 to-orange-500",
    },
    {
      text: "Tạo 5 câu hỏi ôn tập từ tài liệu",
      icon: "🎯",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle scroll to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleSend = useCallback(() => {
    if (input.trim() && !isTyping) {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: input.trim(),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      setTimeout(() => {
        const randomDoc =
          mockDocuments[Math.floor(Math.random() * mockDocuments.length)];
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: `Dựa trên tài liệu trong thư viện của bạn, tôi tìm thấy thông tin liên quan:\n\n**📌 Phân tích chi tiết:**\n\nĐây là một câu hỏi quan trọng về nội dung học tập. Dựa trên tài liệu đã tải lên, tôi có thể cung cấp các thông tin sau:\n\n**1. Khái niệm cơ bản**\nTheo tài liệu, nội dung này được định nghĩa và giải thích chi tiết trong chương đầu tiên. Các khái niệm nền tảng bao gồm:\n• Định nghĩa chính thức\n• Phạm vi áp dụng\n• Mối liên hệ với các khái niệm khác\n\n**2. Ví dụ minh họa**\nCó nhiều ví dụ thực tế được đề cập, bao gồm các trường hợp nghiên cứu trong thực tiễn giúp hiểu rõ hơn lý thuyết.\n\n**3. Kết luận & Đề xuất**\nĐể hiểu sâu hơn, bạn nên:\n• Đọc lại phần 2.3 của tài liệu\n• Làm bài tập cuối chương\n• Tham khảo thêm nguồn bổ sung\n\n💡 *Bạn muốn tôi giải thích thêm về phần nào không?*`,
          citations: [
            {
              documentId: randomDoc.id,
              documentName: randomDoc.name,
              pageNumber: Math.floor(Math.random() * 50) + 1,
              excerpt:
                "Trích dẫn nội dung từ tài liệu liên quan đến câu hỏi của bạn...",
            },
            {
              documentId: mockDocuments[1]?.id || randomDoc.id,
              documentName: mockDocuments[1]?.name || "Tài liệu tham khảo.pdf",
              pageNumber: Math.floor(Math.random() * 30) + 1,
              excerpt: "Nội dung bổ sung từ tài liệu thứ hai...",
            },
          ],
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 2000);
    }
  }, [input, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleNewChat = () => {
    setMessages(getInitialMessages());
    setSelectedSession(null);
  };

  const handleDeleteSession = (id: string) => {
    // Mock delete - just deselect
    if (selectedSession === id) {
      setSelectedSession(null);
    }
  };

  const filteredSessions = mockSessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Left Sidebar - Chat History */}
      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-80"
        }`}
      >
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="group relative w-full p-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #3478f6 0%, #9333ea 100%)",
            boxShadow: "0 4px 20px rgba(52, 120, 246, 0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-2 text-white font-semibold">
            <Plus size={18} />
            {!sidebarCollapsed && (
              <span className="text-sm">Cuộc trò chuyện mới</span>
            )}
          </div>
        </button>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all shadow-sm"
            />
          </div>
        )}

        {/* Chat Sessions */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {!sidebarCollapsed && (
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clock size={12} />
                Lịch sử trò chuyện
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSessions.map((session) => (
              <div key={session.id} className="relative group">
                <button
                  onClick={() => setSelectedSession(session.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedSession === session.id
                      ? "bg-primary-50 border border-primary-200"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg flex-shrink-0">
                      {session.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {session.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {session.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">
                            {session.updatedAt}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[10px] text-slate-400">
                            {session.messageCount} tin nhắn
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                {/* Session Actions */}
                {!sidebarCollapsed && (
                  <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingSession(session.id)}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Collapse Toggle */}
          <div className="p-2 border-t border-slate-100">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full p-2 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center gap-2 transition-colors"
            >
              <ChevronRight
                size={16}
                className={`transition-transform ${
                  sidebarCollapsed ? "" : "rotate-180"
                }`}
              />
              {!sidebarCollapsed && <span className="text-xs">Thu gọn</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* AI Avatar */}
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #3478f6 0%, #9333ea 100%)",
                  }}
                >
                  <Sparkles size={22} className="text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Chatnary AI
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
                    PRO
                  </span>
                </h2>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  {isTyping ? "Đang trả lời..." : "Sẵn sàng hỗ trợ bạn"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <Star size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <Settings size={18} />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth"
          style={{
            background: "linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)",
          }}
        >
          {messages.map((message, idx) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
                style={{
                  animation: "fadeInUp 0.3s ease-out",
                  animationFillMode: "both",
                }}
              >
                {/* Avatar */}
                {isUser ? (
                  currentUser ? (
                    <Avatar name={currentUser.name} size="md" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                  )
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #3478f6 0%, #9333ea 100%)",
                    }}
                  >
                    <Sparkles size={16} className="text-white" />
                  </div>
                )}

                {/* Content */}
                <div
                  className={`flex-1 max-w-2xl ${
                    isUser ? "flex flex-col items-end" : ""
                  }`}
                >
                  <div
                    className={`group relative inline-block text-left ${
                      isUser
                        ? "rounded-2xl rounded-tr-sm"
                        : "rounded-2xl rounded-tl-sm"
                    } px-5 py-4`}
                    style={{
                      background: isUser
                        ? "linear-gradient(135deg, #3478f6 0%, #1d5aeb 100%)"
                        : "#ffffff",
                      color: isUser ? "white" : "#334155",
                      boxShadow: isUser
                        ? "0 4px 16px rgba(52, 120, 246, 0.2)"
                        : "0 2px 12px rgba(0, 0, 0, 0.05)",
                      border: isUser ? "none" : "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      className="text-[15px] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(message.content),
                      }}
                    />

                    {/* Citations */}
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                          <FileText size={12} />
                          Nguồn tham khảo
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.citations.map((citation, cidx) => (
                            <button
                              key={cidx}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100"
                            >
                              <FileText size={12} />
                              <span className="max-w-[100px] truncate">
                                {citation.documentName}
                              </span>
                              <span className="px-1.5 py-0.5 bg-primary-500 text-white rounded text-[10px]">
                                p.{citation.pageNumber}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions for AI messages */}
                    {!isUser && (
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            handleCopy(message.id, message.content)
                          }
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-all"
                        >
                          {copied === message.id ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                          <span>
                            {copied === message.id ? "Đã copy!" : "Copy"}
                          </span>
                        </button>
                        <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-all">
                          <RotateCcw size={12} />
                          <span>Tạo lại</span>
                        </button>
                        <div className="flex-1" />
                        <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all">
                          <ThumbsUp size={12} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
                          <ThumbsDown size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-[11px] text-slate-400 mt-1.5 ${
                      isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div
              className="flex items-center gap-4"
              style={{ animation: "fadeInUp 0.3s ease-out" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #3478f6 0%, #9333ea 100%)",
                }}
              >
                <Brain size={16} className="text-white animate-pulse" />
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm">
                <span className="text-sm text-slate-600">
                  Đang phân tích tài liệu
                </span>
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-32 right-8 p-3 bg-white border border-slate-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-10"
          >
            <ArrowDown size={18} className="text-slate-600" />
          </button>
        )}

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-3">
              <Zap size={14} className="text-amber-500" />
              Câu hỏi gợi ý
            </p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion.text)}
                  className="group relative p-3 text-left bg-white border border-slate-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{suggestion.icon}</span>
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 line-clamp-1">
                      {suggestion.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div
            className="flex items-end gap-3 p-3 rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-500/20"
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Attachment buttons */}
            <div className="flex items-center gap-0.5">
              <button
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all"
                title="Đính kèm file"
              >
                <Paperclip size={18} />
              </button>
              <button
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all"
                title="Thêm hình ảnh"
              >
                <ImageIcon size={18} />
              </button>
            </div>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn... (Enter để gửi, Shift+Enter để xuống dòng)"
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-slate-800 placeholder-slate-400 py-2"
              style={{ maxHeight: "120px" }}
            />

            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all"
                title="Ghi âm"
              >
                <Mic size={18} />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                style={{
                  background: input.trim()
                    ? "linear-gradient(135deg, #3478f6 0%, #9333ea 100%)"
                    : "#cbd5e1",
                  boxShadow: input.trim()
                    ? "0 2px 8px rgba(52, 120, 246, 0.3)"
                    : "none",
                }}
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Chatnary AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
          </p>
        </div>
      </div>
    </div>
  );
}
