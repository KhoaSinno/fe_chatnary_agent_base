"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  ArrowRight,
} from "lucide-react";
import { ChatMessage, Citation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Avatar } from "@/components/ui/avatar";

interface RAGChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onCitationClick?: (citation: Citation) => void;
  projectName?: string;
  isLoading?: boolean;
}

// Citations Display
function CitationBadges({
  citations,
  onClick,
}: {
  citations: Citation[];
  onClick?: (citation: Citation) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {citations.map((citation, index) => (
        <button
          key={index}
          onClick={() => onClick?.(citation)}
          className="group inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary-700 bg-gradient-to-r from-primary-50 to-white border border-primary-200 rounded-full hover:border-primary-300 hover:shadow-md hover:shadow-primary-100 hover:-translate-y-0.5 transition-all"
        >
          <FileText size={12} className="text-primary-500" />
          <span className="max-w-[120px] truncate">
            {citation.documentName}
          </span>
          <span className="px-1.5 py-0.5 bg-primary-100 text-primary-600 rounded-md text-[10px] font-bold">
            p.{citation.pageNumber}
          </span>
          <ArrowRight
            size={10}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </button>
      ))}
    </div>
  );
}

// Typing Indicator
function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 rounded-2xl rounded-bl-md">
        <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot" />
      </div>
    </div>
  );
}

// Message Bubble
function MessageBubble({
  message,
  onCitationClick,
}: {
  message: ChatMessage;
  onCitationClick?: (citation: Citation) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const { currentUser } = useAuth();
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "flex-row-reverse" : ""
      } animate-fadeInUp`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-500/20 flex-shrink-0">
          <User size={14} className="text-white" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 flex-shrink-0">
          <Sparkles size={14} className="text-white" />
        </div>
      )}

      {/* Content */}
      <div
        className={`flex-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`group relative ${
            isUser
              ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-tr-md shadow-lg shadow-primary-500/20"
              : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-md shadow-sm"
          } px-4 py-3`}
        >
          {/* Message Content */}
          <p
            className={`text-sm whitespace-pre-wrap leading-relaxed ${
              isUser ? "text-white" : "text-slate-700"
            }`}
          >
            {message.content}
          </p>

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <CitationBadges
              citations={message.citations}
              onClick={onCitationClick}
            />
          )}

          {/* Actions for AI messages */}
          {!isUser && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check size={12} className="text-green-600" />
                ) : (
                  <Copy size={12} />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <RotateCcw size={12} />
                <span>Regenerate</span>
              </button>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => setFeedback(feedback === "up" ? null : "up")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === "up"
                      ? "bg-green-100 text-green-600"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsUp size={12} />
                </button>
                <button
                  onClick={() =>
                    setFeedback(feedback === "down" ? null : "down")
                  }
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === "down"
                      ? "bg-red-100 text-red-600"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsDown size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p
          className={`text-[10px] text-slate-400 mt-1.5 ${
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
}

// Suggestion Chips
function SuggestionChips({
  suggestions,
  onSelect,
}: {
  suggestions: string[];
  onSelect: (text: string) => void;
}) {
  return (
    <div className="space-y-2 p-4 bg-gradient-to-b from-slate-50/80 to-white border-t border-slate-100">
      <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
        <Lightbulb size={12} className="text-amber-500" />
        Gợi ý câu hỏi
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all hover:-translate-y-0.5 hover:shadow-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RAGChat({
  messages,
  onSendMessage,
  onCitationClick,
  projectName,
  isLoading = false,
}: RAGChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    "Tóm tắt nội dung chính",
    "Giải thích khái niệm quan trọng",
    "So sánh các quan điểm",
    "Tạo mindmap chủ đề",
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Chatnary AI</h3>
            <p className="text-xs text-slate-500">
              Chat with{" "}
              <span className="font-medium text-primary-600">
                {projectName || "your documents"}
              </span>
            </p>
          </div>
          <div className="ml-auto">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 shadow-xl shadow-primary-500/20 animate-float">
              <Bot size={32} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">
              Sẵn sàng hỗ trợ bạn!
            </h4>
            <p className="text-sm text-slate-500 max-w-[280px]">
              Hãy hỏi bất kỳ câu hỏi nào về tài liệu. AI sẽ trả lời dựa trên nội
              dung thực tế và trích dẫn nguồn.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCitationClick={onCitationClick}
            />
          ))
        )}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <SuggestionChips
          suggestions={suggestions}
          onSelect={(text) => {
            setInput(text);
            inputRef.current?.focus();
          }}
        />
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative flex items-end gap-3 bg-slate-100 rounded-2xl p-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-300 border border-transparent transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi của bạn..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-slate-800 placeholder-slate-400 py-2 px-2 max-h-[120px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
        </p>
      </div>
    </div>
  );
}
