"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Users,
  FileText,
  MoreVertical,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { AvatarGroup } from "@/components/ui/avatar";
import { ProjectCardSkeleton } from "@/components/ui/skeleton";
import { NoProjectsState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/auth-context";
import {
  mockProjects,
  getDocumentsByProjectId,
  getUserById,
} from "@/lib/mock-data";

export default function ProjectsPage() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#3B82F6");

  // Get user's projects
  const userProjects = mockProjects.filter((p) =>
    p.members.some((m) => m.userId === currentUser?.id)
  );

  // Filter projects
  const filteredProjects = userProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const colorOptions = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#84CC16", // Lime
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dự án</h1>
          <p className="text-slate-500 mt-1">
            Tổ chức tài liệu và cộng tác với người khác
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Tạo dự án mới
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <NoProjectsState onCreate={() => setIsCreateModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const projectDocs = getDocumentsByProjectId(project.id);
            const memberUsers = project.members
              .map((m) => getUserById(m.userId))
              .filter(Boolean);
            const isOwner = project.ownerId === currentUser?.id;

            return (
              <div
                key={project.id}
                className="card card-interactive p-5 relative group"
              >
                {/* Menu Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    icon={MoreVertical}
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedMenuId(
                        selectedMenuId === project.id ? null : project.id
                      );
                    }}
                  />

                  {selectedMenuId === project.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-fadeIn">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <UserPlus size={16} />
                        <span>Invite Member</span>
                      </button>
                      {isOwner && (
                        <>
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                            <Settings size={16} />
                            <span>Settings</span>
                          </button>
                          <hr className="my-1" />
                          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Link href={`/projects/${project.id}`}>
                  {/* Color Indicator & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="font-semibold text-gray-900 truncate">
                      {project.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                    {project.description || "No description"}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {projectDocs.length} docs
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {project.members.length} members
                    </span>
                  </div>

                  {/* Members */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <AvatarGroup
                      users={memberUsers.map((u) => ({
                        name: u!.name,
                        avatar: u!.avatar,
                      }))}
                      max={4}
                      size="sm"
                    />
                    <span className="text-xs text-gray-400">
                      {new Date(project.updatedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="e.g., Ôn thi cuối kỳ"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewProjectColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    newProjectColor === color
                      ? "ring-2 ring-offset-2 ring-primary-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Add a description for your project..."
              className="input min-h-[80px] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" icon={Plus} className="flex-1">
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
