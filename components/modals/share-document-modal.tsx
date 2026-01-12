"use client";

import React, { useState } from "react";
import {
  X,
  Link2,
  Copy,
  Check,
  Globe,
  Lock,
  Users,
  Mail,
  ChevronDown,
  Shield,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName?: string;
}

export function ShareDocumentModal({
  isOpen,
  onClose,
  documentName = "Giáo trình Triết học Mác-Lênin.pdf",
}: ShareDocumentModalProps) {
  const [accessType, setAccessType] = useState<"private" | "anyone">("private");
  const [permission, setPermission] = useState<"view" | "download">("view");
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [sharedWith, setSharedWith] = useState<string[]>([
    "pham.duc@email.com",
  ]);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://chatnary.edu.vn/docs/doc-001`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleAddEmail = () => {
    if (
      emailInput &&
      emailInput.includes("@") &&
      !sharedWith.includes(emailInput)
    ) {
      setSharedWith([...sharedWith, emailInput]);
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setSharedWith(sharedWith.filter((e) => e !== email));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "scaleIn 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Link2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Chia sẻ tài liệu</h3>
                <p className="text-sm text-slate-500 truncate max-w-[250px]">
                  {documentName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Access Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Quyền truy cập
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setAccessType("private")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  accessType === "private"
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    accessType === "private"
                      ? "bg-primary-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Lock size={20} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-800">Riêng tư</p>
                  <p className="text-sm text-slate-500">
                    Chỉ những người được mời mới có thể xem
                  </p>
                </div>
                {accessType === "private" && (
                  <Check size={20} className="text-primary-500" />
                )}
              </button>

              <button
                onClick={() => setAccessType("anyone")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  accessType === "anyone"
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    accessType === "anyone"
                      ? "bg-primary-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Globe size={20} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-800">Công khai</p>
                  <p className="text-sm text-slate-500">
                    Bất kỳ ai có link đều có thể xem
                  </p>
                </div>
                {accessType === "anyone" && (
                  <Check size={20} className="text-primary-500" />
                )}
              </button>
            </div>
          </div>

          {/* Permission */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Quyền hạn
            </label>
            <div className="relative">
              <button
                onClick={() => setIsPermissionOpen(!isPermissionOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {permission === "view" ? (
                    <Eye size={18} />
                  ) : (
                    <Download size={18} />
                  )}
                  <span>
                    {permission === "view" ? "Chỉ xem" : "Xem và tải xuống"}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isPermissionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isPermissionOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10">
                  <button
                    onClick={() => {
                      setPermission("view");
                      setIsPermissionOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 text-left"
                  >
                    <Eye size={18} className="text-slate-600" />
                    <div>
                      <p className="font-medium">Chỉ xem</p>
                      <p className="text-xs text-slate-500">
                        Không thể tải xuống
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setPermission("download");
                      setIsPermissionOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 text-left"
                  >
                    <Download size={18} className="text-emerald-600" />
                    <div>
                      <p className="font-medium">Xem và tải xuống</p>
                      <p className="text-xs text-slate-500">
                        Cho phép tải file gốc
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Share with specific people (only for private) */}
          {accessType === "private" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Chia sẻ với
              </label>
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                    placeholder="Nhập email..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <Button variant="outline" onClick={handleAddEmail}>
                  Thêm
                </Button>
              </div>

              {sharedWith.length > 0 && (
                <div className="space-y-2">
                  {sharedWith.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-700">{email}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Copy Link */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Link chia sẻ
            </label>
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl">
              <Link2 size={18} className="text-slate-500 flex-shrink-0" />
              <input
                type="text"
                value="https://chatnary.edu.vn/docs/doc-001"
                readOnly
                className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  linkCopied
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                {linkCopied ? "Đã copy!" : "Copy link"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield size={16} />
            <span>Link có hiệu lực vĩnh viễn</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="primary">Lưu thay đổi</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareDocumentModal;
