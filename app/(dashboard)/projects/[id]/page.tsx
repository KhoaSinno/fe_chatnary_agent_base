"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Upload,
  Brain,
  FileText,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Clock,
  Zap,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeft,
  MessageCircle,
  Bot,
  Sparkles,
  ChevronDown,
  Library,
} from "lucide-react";
import Link from "next/link";
import { Button, IconButton } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar";
import { DocumentViewer } from "@/components/workspace/document-viewer";
import { RAGChat } from "@/components/workspace/rag-chat";
import { ProjectGroupChat } from "@/components/workspace/project-group-chat";
import { CompactDocumentList } from "@/components/workspace/document-list";
import { ExamConfigModal } from "@/components/exam/exam-config-modal";
import { QuizInterface } from "@/components/exam/quiz-interface";
import { QuizResults } from "@/components/exam/quiz-results";
import {
  DocumentViewerSkeleton,
  ChatMessageSkeleton,
} from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/empty-state";
import {
  getProjectById,
  getDocumentsByProjectId,
  getChatSessionByProjectId,
  getUserById,
  mockQuiz,
} from "@/lib/mock-data";
import { Document, ChatMessage, Citation, Project } from "@/lib/types";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { ShareDocumentModal } from "@/components/modals/share-document-modal";
import { LinkDocumentModal } from "@/components/modals/link-document-modal";
import { ResizablePanelGroup } from "@/components/ui/resizable-panel";

type ExamStage = "config" | "quiz" | "results" | null;

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [highlightedPage, setHighlightedPage] = useState<number | undefined>();
  const [isDocListCollapsed, setIsDocListCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [examStage, setExamStage] = useState<ExamStage>(null);
  const [quizAnswers, setQuizAnswers] = useState<
    Record<string, "A" | "B" | "C" | "D">
  >({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [chatMode, setChatMode] = useState<"ai" | "group">("ai");

  // Load project data
  useEffect(() => {
    const timer = setTimeout(() => {
      const proj = getProjectById(projectId);
      if (proj) {
        setProject(proj);
        const docs = getDocumentsByProjectId(projectId);
        setDocuments(docs);

        const firstDone = docs.find((d) => d.status === "done");
        if (firstDone) setSelectedDocument(firstDone);

        const chatSession = getChatSessionByProjectId(projectId);
        if (chatSession) {
          setMessages(chatSession.messages);
        }
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [projectId]);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: `Dựa trên tài liệu trong project "${
          project?.name
        }", tôi tìm thấy thông tin liên quan:\n\n${
          content.length > 20 ? "Đây là một câu hỏi phức tạp. " : ""
        }Theo nội dung tài liệu, có thể giải đáp như sau...\n\nNếu bạn cần thêm chi tiết, hãy hỏi cụ thể hơn.`,
        citations: selectedDocument
          ? [
              {
                documentId: selectedDocument.id,
                documentName: selectedDocument.name,
                pageNumber:
                  Math.floor(
                    Math.random() * (selectedDocument.pageCount || 100)
                  ) + 1,
                excerpt: "Trích dẫn nội dung liên quan từ tài liệu...",
              },
            ]
          : [],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const handleCitationClick = (citation: Citation) => {
    const doc = documents.find((d) => d.id === citation.documentId);
    if (doc && doc.status === "done") {
      setSelectedDocument(doc);
      setHighlightedPage(citation.pageNumber);
      setTimeout(() => setHighlightedPage(undefined), 3000);
    }
  };

  const handleStartExam = () => setExamStage("quiz");
  const handleQuizComplete = (
    answers: Record<string, "A" | "B" | "C" | "D">
  ) => {
    setQuizAnswers(answers);
    setExamStage("results");
  };
  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setExamStage("config");
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-7rem)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-32 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4 h-[calc(100%-4rem)]">
          <div className="w-56 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="flex-1">
            <DocumentViewerSkeleton />
          </div>
          <div className="w-96 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <ErrorState
        title="Project not found"
        message="The project you're looking for doesn't exist or you don't have access."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const memberUsers = project.members
    .map((m) => getUserById(m.userId))
    .filter(Boolean);
  const doneDocuments = documents.filter((d) => d.status === "done");

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/projects">
            <button className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${project.color} 0%, ${project.color}cc 100%)`,
              boxShadow: `0 4px 12px ${project.color}40`,
            }}
          >
            <FileText className="text-white" size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                {project.name}
              </h1>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{documents.length} docs</span>
              <span>•</span>
              <span>{project.members.length} members</span>
              <span>•</span>
              <span>
                Updated{" "}
                {new Date(project.updatedAt).toLocaleDateString("vi-VN")}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <AvatarGroup
              users={memberUsers.map((u) => ({
                name: u!.name,
                avatar: u!.avatar,
              }))}
              max={3}
              size="xs"
            />
            <button
              onClick={() => setShowInviteModal(true)}
              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <UserPlus size={12} />
            </button>
          </div>

          <button
            onClick={() => setExamStage("config")}
            disabled={doneDocuments.length === 0}
            className="group flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Brain size={16} />
            <span className="hidden sm:inline">Luyện thi AI</span>
          </button>

          {/* Upload Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Thêm tài liệu</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  showUploadMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showUploadMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUploadMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20 animate-fadeIn">
                  <button
                    onClick={() => {
                      setShowUploadMenu(false);
                      // TODO: Open upload modal
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Upload size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Tải lên mới</p>
                      <p className="text-xs text-slate-500">
                        Upload vào kho & liên kết
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadMenu(false);
                      setShowLinkModal(true);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Library size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        Liên kết từ kho
                      </p>
                      <p className="text-xs text-slate-500">
                        Chọn từ kho cá nhân
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Split View - Resizable Panels */}
      <ResizablePanelGroup
        className="flex-1 min-h-0 overflow-hidden"
        leftPanelConfig={{
          defaultWidth: 224,
          minWidth: 150,
          maxWidth: 400,
          collapsed: isDocListCollapsed,
          collapsedWidth: 48,
        }}
        rightPanelConfig={{
          defaultWidth: 380,
          minWidth: 300,
          maxWidth: 600,
          collapsed: isChatCollapsed,
          collapsedWidth: 48,
        }}
        leftPanel={
          <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-slate-50/80">
              {!isDocListCollapsed && (
                <span className="text-xs font-semibold text-slate-600 px-1">
                  Documents ({documents.length})
                </span>
              )}
              <button
                onClick={() => setIsDocListCollapsed(!isDocListCollapsed)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors mx-auto"
              >
                {isDocListCollapsed ? (
                  <PanelLeft size={14} />
                ) : (
                  <PanelLeftClose size={14} />
                )}
              </button>
            </div>
            {!isDocListCollapsed && (
              <div className="flex-1 overflow-y-auto p-2">
                <CompactDocumentList
                  documents={documents}
                  selectedDocumentId={selectedDocument?.id}
                  onSelectDocument={setSelectedDocument}
                />
              </div>
            )}
          </div>
        }
        centerPanel={
          <DocumentViewer
            document={selectedDocument}
            highlightedPage={highlightedPage}
          />
        }
        rightPanel={
          isChatCollapsed ? (
            <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center py-3">
              <button
                onClick={() => setIsChatCollapsed(false)}
                className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-200 transition-colors"
              >
                <MessageCircle size={16} />
              </button>
              <div
                className="mt-2 writing-mode-vertical text-xs font-medium text-slate-500 rotate-180"
                style={{ writingMode: "vertical-rl" }}
              >
                Chat
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Chat Mode Toggle */}
              <div className="flex items-center border-b border-slate-100 bg-slate-50">
                <button
                  onClick={() => setChatMode("ai")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                    chatMode === "ai"
                      ? "text-primary-600 border-b-2 border-primary-500 bg-white"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Sparkles size={16} />
                  AI Chat
                </button>
                <button
                  onClick={() => setChatMode("group")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                    chatMode === "group"
                      ? "text-emerald-600 border-b-2 border-emerald-500 bg-white"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Users size={16} />
                  Group
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                </button>
                <button
                  onClick={() => setIsChatCollapsed(true)}
                  className="p-2 mr-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
                  title="Collapse chat"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-hidden">
                {chatMode === "ai" ? (
                  <RAGChat
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onCitationClick={handleCitationClick}
                    projectName={project.name}
                  />
                ) : (
                  <ProjectGroupChat
                    projectName={project.name}
                    projectId={projectId}
                    members={memberUsers.map((u) => ({
                      id: u!.id,
                      name: u!.name,
                      avatar: u!.avatar,
                      isOnline: Math.random() > 0.3,
                    }))}
                    onCitationClick={handleCitationClick}
                  />
                )}
              </div>
            </div>
          )
        }
      />

      {/* Exam Modals */}
      {examStage === "config" && (
        <ExamConfigModal
          isOpen
          onClose={() => setExamStage(null)}
          onStartExam={handleStartExam}
          projectName={project.name}
        />
      )}
      {examStage === "quiz" && (
        <QuizInterface
          questions={mockQuiz.questions}
          onComplete={handleQuizComplete}
          onExit={() => setExamStage(null)}
        />
      )}
      {examStage === "results" && (
        <QuizResults
          questions={mockQuiz.questions}
          answers={quizAnswers}
          onRetry={handleRetryQuiz}
          onClose={() => setExamStage(null)}
          onCitationClick={handleCitationClick}
        />
      )}

      {/* Invite Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        projectName={project.name}
      />

      {/* Share Modal */}
      <ShareDocumentModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        documentName={selectedDocument?.name}
      />

      {/* Link Document Modal */}
      <LinkDocumentModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        projectName={project.name}
        existingDocumentIds={documents.map((d) => d.id)}
        onLinkDocuments={(docs) => {
          // Add linked documents to the project
          setDocuments((prev) => [...prev, ...docs]);
        }}
      />
    </div>
  );
}
