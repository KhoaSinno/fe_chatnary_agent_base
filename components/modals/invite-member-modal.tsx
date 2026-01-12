"use client";

import React, { useState } from "react";
import {
  X,
  Mail,
  UserPlus,
  Users,
  Check,
  Copy,
  Link2,
  ChevronDown,
  Search,
  Crown,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
}

const existingMembers: Member[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "nguyen.vanan@university.edu.vn",
    role: "owner",
  },
  { id: "2", name: "Phạm Đức", email: "pham.duc@email.com", role: "editor" },
];

export function InviteMemberModal({
  isOpen,
  onClose,
  projectName = "Ôn thi Triết học",
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>(existingMembers);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  if (!isOpen) return null;

  const handleInvite = () => {
    if (email && email.includes("@")) {
      setInvitedEmails([...invitedEmails, email]);
      setEmail("");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://chatnary.edu.vn/invite/proj-001`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const getRoleBadge = (memberRole: string) => {
    switch (memberRole) {
      case "owner":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            <Crown size={12} />
            Owner
          </span>
        );
      case "editor":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            <Edit3 size={12} />
            Editor
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
            <Eye size={12} />
            Viewer
          </span>
        );
    }
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <UserPlus size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Mời thành viên</h3>
                <p className="text-sm text-slate-500">{projectName}</p>
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
          {/* Invite by Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Mời qua email
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              {/* Role Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleOpen(!isRoleOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {role === "editor" ? <Edit3 size={16} /> : <Eye size={16} />}
                  <span className="capitalize">{role}</span>
                  <ChevronDown size={16} />
                </button>

                {isRoleOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10">
                    <button
                      onClick={() => {
                        setRole("editor");
                        setIsRoleOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-50 text-left"
                    >
                      <Edit3 size={16} className="text-blue-600" />
                      <div>
                        <p className="font-medium">Editor</p>
                        <p className="text-xs text-slate-500">
                          Có thể chỉnh sửa
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setRole("viewer");
                        setIsRoleOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-50 text-left"
                    >
                      <Eye size={16} className="text-slate-600" />
                      <div>
                        <p className="font-medium">Viewer</p>
                        <p className="text-xs text-slate-500">Chỉ xem</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <Button variant="primary" onClick={handleInvite}>
                Mời
              </Button>
            </div>

            {/* Invited emails */}
            {invitedEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {invitedEmails.map((e, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm rounded-full"
                  >
                    <Check size={14} />
                    {e}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">hoặc</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Share Link */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Chia sẻ qua link
            </label>
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl">
              <Link2 size={18} className="text-slate-500 flex-shrink-0" />
              <input
                type="text"
                value="https://chatnary.edu.vn/invite/proj-001"
                readOnly
                className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  linkCopied
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-200"
                }`}
              >
                {linkCopied ? <Check size={14} /> : <Copy size={14} />}
                {linkCopied ? "Đã copy!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Current Members */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Users size={16} />
              Thành viên hiện tại ({members.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(member.role)}
                    {member.role !== "owner" && (
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="primary">Xong</Button>
        </div>
      </div>
    </div>
  );
}

export default InviteMemberModal;
