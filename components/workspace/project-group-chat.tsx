"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Users,
  AtSign,
  MoreHorizontal,
  Smile,
  Image as ImageIcon,
  Paperclip,
  FileText,
  ChevronDown,
  Check,
  CheckCheck,
  Bot,
  Search,
  BellOff,
  Pin,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react";
import { ChatMessage, Citation, User } from "@/lib/types";

interface GroupChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  isAI?: boolean;
  citations?: Citation[];
  mentionsAI?: boolean;
  status?: "sent" | "delivered" | "read";
}

interface GroupChatProps {
  projectName: string;
  projectId: string;
  members: { id: string; name: string; avatar?: string; isOnline?: boolean }[];
  onCitationClick?: (citation: Citation) => void;
}

const mockGroupMessages: GroupChatMessage[] = [
  {
    id: "gm-1",
    userId: "user-1",
    userName: "Nguyễn Văn An",
    content: "Mọi người ơi, ai đọc xong chương 3 chưa?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "read",
  },
  {
    id: "gm-2",
    userId: "user-2",
    userName: "Phạm Đức",
    content: "Mình đọc rồi, khá khó hiểu phần phương pháp biện chứng 😅",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    status: "read",
  },
  {
    id: "gm-3",
    userId: "user-1",
    userName: "Nguyễn Văn An",
    content: "@AI giải thích phương pháp biện chứng duy vật là gì?",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    mentionsAI: true,
    status: "read",
  },
  {
    id: "gm-4",
    userId: "ai",
    userName: "Chatnary AI",
    isAI: true,
    content:
      "**Phương pháp biện chứng duy vật** là phương pháp nhận thức khoa học, bao gồm:\n\n1. **Xem xét sự vật trong mối liên hệ phổ biến** - Không xem xét cô lập mà đặt trong tổng thể các mối quan hệ.\n\n2. **Xem xét sự vật trong sự vận động, phát triển** - Không chỉ nhìn trạng thái hiện tại mà còn xem xét quá khứ và xu hướng tương lai.\n\n3. **Phân tích mâu thuẫn** - Tìm ra mâu thuẫn bên trong sự vật - động lực của sự phát triển.\n\n4. **Thống nhất lý luận với thực tiễn** - Kiểm nghiệm nhận thức thông qua hoạt động thực tiễn.",
    timestamp: new Date(Date.now() - 3300000).toISOString(),
    citations: [
      {
        documentId: "doc-1",
        documentName: "Giáo trình Triết học Mác-Lênin",
        pageNumber: 45,
        excerpt: "Phương pháp biện chứng...",
      },
    ],
    status: "read",
  },
  {
    id: "gm-5",
    userId: "user-2",
    userName: "Phạm Đức",
    content: "Cảm ơn! Vậy là mình hiểu rồi 👍",
    timestamp: new Date(Date.now() - 3200000).toISOString(),
    status: "read",
  },
];

export function ProjectGroupChat({
  projectName,
  projectId,
  members,
  onCitationClick,
}: GroupChatProps) {
  const [messages, setMessages] =
    useState<GroupChatMessage[]>(mockGroupMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showChatMenu, setShowChatMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = { id: "user-1", name: "Nguyễn Văn An" };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    // Check for @ mention
    const lastAtIndex = value.lastIndexOf("@");
    if (
      (lastAtIndex !== -1 && lastAtIndex === value.length - 1) ||
      (lastAtIndex !== -1 && value.slice(lastAtIndex).match(/^@\w*$/))
    ) {
      setShowMentions(true);
      setMentionSearch(value.slice(lastAtIndex + 1));
    } else {
      setShowMentions(false);
    }
  };

  const handleMention = (name: string, isAI: boolean = false) => {
    const lastAtIndex = input.lastIndexOf("@");
    const newInput = input.slice(0, lastAtIndex) + `@${name} `;
    setInput(newInput);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (input.trim() && !isTyping) {
      const mentionsAI = input.includes("@AI") || input.includes("@Chatnary");

      const userMessage: GroupChatMessage = {
        id: `gm-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        content: input.trim(),
        timestamp: new Date().toISOString(),
        mentionsAI,
        status: "sent",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // Simulate message delivery
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessage.id ? { ...m, status: "delivered" } : m
          )
        );
      }, 500);

      // If @AI was mentioned, generate AI response
      if (mentionsAI) {
        setIsTyping(true);
        setTimeout(() => {
          const aiResponse: GroupChatMessage = {
            id: `gm-${Date.now()}-ai`,
            userId: "ai",
            userName: "Chatnary AI",
            isAI: true,
            content: `Dựa trên tài liệu trong project "${projectName}", tôi có thể giúp trả lời:\n\n${input
              .replace(/@AI|@Chatnary/gi, "")
              .trim()}\n\nTheo nội dung tài liệu, đây là một khái niệm quan trọng được đề cập chi tiết. Nếu cần thêm thông tin, các bạn có thể hỏi thêm nhé! 📚`,
            timestamp: new Date().toISOString(),
            citations: [
              {
                documentId: "doc-1",
                documentName: "Giáo trình Triết học Mác-Lênin",
                pageNumber: Math.floor(Math.random() * 100) + 1,
                excerpt: "Trích dẫn nội dung...",
              },
            ],
            status: "read",
          };
          setMessages((prev) => [...prev, aiResponse]);
          setIsTyping(false);
        }, 2000);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const onlineMembers = members.filter((m) => m.isOnline);
  const filteredMentions: { id: string; name: string; isAI?: boolean }[] = [
    { id: "ai", name: "AI", isAI: true },
    ...members
      .filter((m) => m.name.toLowerCase().includes(mentionSearch.toLowerCase()))
      .map((m) => ({ id: m.id, name: m.name, isAI: false })),
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Group Chat</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                {onlineMembers.length} online • {members.length} thành viên
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member, idx) => (
                <div
                  key={member.id}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                  title={member.name}
                >
                  {member.name.charAt(0)}
                </div>
              ))}
              {members.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-semibold border-2 border-white">
                  +{members.length - 3}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowChatMenu(!showChatMenu)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>

              {showChatMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowChatMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20 animate-fadeIn">
                    <button
                      onClick={() => setShowChatMenu(false)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <Search size={16} className="text-slate-400" />
                      <span>Tìm kiếm tin nhắn</span>
                    </button>
                    <button
                      onClick={() => setShowChatMenu(false)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <UserPlus size={16} className="text-slate-400" />
                      <span>Thêm thành viên</span>
                    </button>
                    <button
                      onClick={() => setShowChatMenu(false)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <Pin size={16} className="text-slate-400" />
                      <span>Ghim cuộc trò chuyện</span>
                    </button>
                    <button
                      onClick={() => setShowChatMenu(false)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <BellOff size={16} className="text-slate-400" />
                      <span>Tắt thông báo</span>
                    </button>
                    <hr className="my-2 border-slate-100" />
                    <button
                      onClick={() => setShowChatMenu(false)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <Settings size={16} className="text-slate-400" />
                      <span>Cài đặt nhóm</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Bạn có chắc muốn xóa lịch sử chat?")) {
                          setMessages([]);
                        }
                        setShowChatMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Xóa lịch sử</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
        style={{
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        }}
      >
        {messages.map((message, idx) => {
          const isOwn = message.userId === currentUser.id;
          const isAI = message.isAI;
          const showAvatar =
            idx === 0 || messages[idx - 1].userId !== message.userId;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              {showAvatar ? (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                    isAI
                      ? "bg-gradient-to-br from-primary-500 to-purple-600"
                      : "bg-gradient-to-br from-slate-600 to-slate-800"
                  }`}
                >
                  {isAI ? <Sparkles size={14} /> : message.userName.charAt(0)}
                </div>
              ) : (
                <div className="w-8 flex-shrink-0" />
              )}

              {/* Content */}
              <div className={`max-w-[75%] ${isOwn ? "text-right" : ""}`}>
                {showAvatar && (
                  <div
                    className={`flex items-center gap-2 mb-1 ${
                      isOwn ? "justify-end" : ""
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        isAI ? "text-primary-600" : "text-slate-700"
                      }`}
                    >
                      {message.userName}
                    </span>
                    {isAI && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-100 text-primary-600 rounded">
                        AI
                      </span>
                    )}
                    {message.mentionsAI && !isAI && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-600 rounded flex items-center gap-0.5">
                        <AtSign size={8} />
                        AI
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md"
                      : isAI
                      ? "bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 text-slate-800 rounded-bl-md"
                      : "bg-slate-100 text-slate-800 rounded-bl-md"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content.split(/(@AI|@Chatnary)/gi).map((part, i) =>
                      part.match(/^@(AI|Chatnary)$/i) ? (
                        <span
                          key={i}
                          className={`font-semibold ${
                            isOwn ? "text-white" : "text-primary-600"
                          }`}
                        >
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </div>

                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-primary-200/50">
                      {message.citations.map((citation, cidx) => (
                        <button
                          key={cidx}
                          onClick={() => onCitationClick?.(citation)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white/80 text-primary-600 rounded-full border border-primary-200 hover:bg-white transition-colors"
                        >
                          <FileText size={10} />
                          <span className="max-w-[100px] truncate">
                            {citation.documentName}
                          </span>
                          <span className="px-1 py-0.5 bg-primary-500 text-white rounded text-[9px]">
                            p.{citation.pageNumber}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center gap-1 mt-1 ${
                    isOwn ? "justify-end" : ""
                  }`}
                >
                  <span className="text-[10px] text-slate-400">
                    {formatTime(message.timestamp)}
                  </span>
                  {isOwn && message.status && (
                    <span className="text-slate-400">
                      {message.status === "sent" && <Check size={10} />}
                      {message.status === "delivered" && (
                        <CheckCheck size={10} />
                      )}
                      {message.status === "read" && (
                        <CheckCheck size={10} className="text-primary-500" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="px-4 py-2.5 bg-slate-100 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
                <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white relative">
        {/* Mention dropdown */}
        {showMentions && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10">
            <div className="p-2 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-semibold text-slate-500">Mention</p>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredMentions.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    handleMention(item.isAI ? "AI" : item.name, item.isAI)
                  }
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                      item.isAI
                        ? "bg-gradient-to-br from-primary-500 to-purple-600"
                        : "bg-gradient-to-br from-slate-600 to-slate-800"
                    }`}
                  >
                    {item.isAI ? <Bot size={14} /> : item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      @{item.isAI ? "AI" : item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.isAI
                        ? "Hỏi AI về tài liệu trong project"
                        : "Thành viên"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                alert("Tính năng đính kèm file sẽ sớm được cập nhật!")
              }
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Đính kèm file"
            >
              <Paperclip size={18} />
            </button>
            <button
              onClick={() =>
                alert("Tính năng gửi hình ảnh sẽ sớm được cập nhật!")
              }
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Gửi hình ảnh"
            >
              <ImageIcon size={18} />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn... Gõ @AI để hỏi bot"
              rows={1}
              className="w-full px-4 py-3 bg-slate-100 border border-transparent rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 resize-none transition-all"
              style={{ maxHeight: "120px" }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const emojis = ["😊", "👍", "❤️", "🔥", "😂", "🎉", "👏", "💪"];
                const randomEmoji =
                  emojis[Math.floor(Math.random() * emojis.length)];
                setInput((prev) => prev + randomEmoji);
                inputRef.current?.focus();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Chèn emoji"
            >
              <Smile size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                background: input.trim()
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "#cbd5e1",
                boxShadow: input.trim()
                  ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                  : "none",
              }}
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-2">
          Gõ <span className="font-semibold text-primary-500">@AI</span> để hỏi
          Chatnary AI về tài liệu
        </p>
      </div>
    </div>
  );
}

export default ProjectGroupChat;
