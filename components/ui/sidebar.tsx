"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  FolderKanban,
  Bookmark,
  History,
  FolderOpen,
  Tags,
  Users,
  Activity,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ChevronDown,
  Sparkles,
  Crown,
  Shield,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { UserRole } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard size={20} />,
        roles: ["user", "librarian", "admin"],
      },
      {
        label: "AI Chat",
        href: "/chat",
        icon: <MessageCircle size={20} />,
        roles: ["user", "librarian", "admin"],
      },
    ],
  },
  {
    title: "My Content",
    items: [
      {
        label: "My Library",
        href: "/library",
        icon: <Library size={20} />,
        roles: ["user", "librarian", "admin"],
      },
      {
        label: "Projects",
        href: "/projects",
        icon: <FolderKanban size={20} />,
        roles: ["user", "librarian", "admin"],
      },
      {
        label: "Bookmarks",
        href: "/bookmarks",
        icon: <Bookmark size={20} />,
        roles: ["user", "librarian", "admin"],
      },
      {
        label: "History",
        href: "/history",
        icon: <History size={20} />,
        roles: ["user", "librarian", "admin"],
      },
    ],
  },
  {
    title: "Librarian",
    items: [
      {
        label: "Collections",
        href: "/collections",
        icon: <FolderOpen size={20} />,
        roles: ["librarian", "admin"],
      },
      {
        label: "Metadata",
        href: "/metadata",
        icon: <Tags size={20} />,
        roles: ["librarian", "admin"],
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "User Management",
        href: "/admin/users",
        icon: <Users size={20} />,
        roles: ["admin"],
      },
      {
        label: "Activity Logs",
        href: "/admin/logs",
        icon: <Activity size={20} />,
        roles: ["admin"],
      },
      {
        label: "Statistics",
        href: "/admin/statistics",
        icon: <BarChart3 size={20} />,
        roles: ["admin"],
      },
      {
        label: "AI Configuration",
        href: "/admin/config",
        icon: <Settings size={20} />,
        roles: ["admin"],
      },
    ],
  },
];

const roleIcons: Record<UserRole, React.ReactNode> = {
  user: <Sparkles size={14} />,
  librarian: <BookOpen size={14} />,
  admin: <Crown size={14} />,
};

const roleColors: Record<UserRole, string> = {
  user: "from-blue-500 to-cyan-500",
  librarian: "from-purple-500 to-pink-500",
  admin: "from-amber-500 to-orange-500",
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, switchRole, isLoading } = useAuth();

  const currentRole = currentUser?.role || "user";

  // Filter navigation based on user role
  const filteredNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(currentRole)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 relative ${
        isCollapsed ? "w-20" : "w-72"
      }`}
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-500/10 to-transparent rounded-tr-full" />

      {/* Logo */}
      <div className="p-5 flex items-center gap-4 relative z-10">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25">
          <BookOpen className="text-white" size={22} />
        </div>
        {!isCollapsed && (
          <div className="animate-fadeIn">
            <h1 className="font-bold text-lg text-white tracking-tight">
              Chatnary
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles size={10} className="text-primary-400" />
              Smart E-Library
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 relative z-10">
        {filteredNavigation.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-5">
            {section.title && !isCollapsed && (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`sidebar-link ${isActive ? "active" : ""} ${
                        isCollapsed ? "justify-center px-3" : ""
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span
                        className={`flex-shrink-0 transition-transform ${
                          isActive ? "scale-110" : ""
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                      {isActive && !isCollapsed && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Role Switcher (Demo) */}
      <div className="px-3 pb-2 relative z-10">
        <div className="relative">
          <button
            onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all ${
              isCollapsed ? "justify-center" : ""
            }`}
            disabled={isLoading}
          >
            <div
              className={`p-1.5 rounded-lg bg-gradient-to-br ${roleColors[currentRole]}`}
            >
              {isLoading ? (
                <Settings size={14} className="text-white animate-spin" />
              ) : (
                <span className="text-white">{roleIcons[currentRole]}</span>
              )}
            </div>
            {!isCollapsed && (
              <>
                <span className="text-sm text-slate-300 flex-1 text-left font-medium capitalize">
                  {currentRole} Mode
                </span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${
                    isRoleSwitcherOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {isRoleSwitcherOpen && !isCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2 animate-fadeInUp z-20">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Switch Demo Role
              </p>
              {(["user", "librarian", "admin"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setIsRoleSwitcherOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
                    currentRole === role
                      ? "bg-slate-700/50 text-white"
                      : "text-slate-300 hover:bg-slate-700/30"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-br ${roleColors[role]}`}
                  >
                    <span className="text-white">{roleIcons[role]}</span>
                  </div>
                  <span className="capitalize font-medium">{role}</span>
                  {currentRole === role && (
                    <span className="ml-auto text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-700/50 relative z-10">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          {currentUser && (
            <div className="relative">
              <Avatar name={currentUser.name} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
          )}
          {!isCollapsed && currentUser && (
            <div className="flex-1 min-w-0 animate-fadeIn">
              <p className="text-sm font-medium text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {currentUser.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-20"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
