"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FolderOpen,
  FileText,
  Settings,
  Trash2,
  MoreVertical,
  Lock,
  Globe,
  Users,
} from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { AccessBadge } from "@/components/ui/badge";
import { ProjectCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { mockCollections, getDocumentById } from "@/lib/mock-data";

export default function CollectionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCollections = mockCollections.filter((col) =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getAccessIcon = (access: string) => {
    switch (access) {
      case "public":
        return <Globe size={16} className="text-green-600" />;
      case "members":
        return <Users size={16} className="text-blue-600" />;
      case "faculty":
        return <Lock size={16} className="text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-500">
            Curate and manage document collections
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Collection
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
          placeholder="Search collections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCollections.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="text-gray-400" size={32} />}
          title="No collections yet"
          description="Create a collection to curate documents for specific topics or audiences"
          action={{
            label: "Create Collection",
            onClick: () => setIsCreateModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => {
            const documents = collection.documentIds
              .map((id) => getDocumentById(id))
              .filter(Boolean);

            return (
              <div
                key={collection.id}
                className="card p-5 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <FolderOpen className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {collection.name}
                      </h3>
                      <AccessBadge access={collection.access} />
                    </div>
                  </div>
                  <IconButton icon={MoreVertical} size="sm" />
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {collection.description || "No description"}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FileText size={14} />
                    <span>{collection.documentIds.length} documents</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(collection.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Collection"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Name
            </label>
            <input
              type="text"
              placeholder="e.g., Giáo trình lập trình cơ bản"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Describe this collection..."
              className="input min-h-[80px] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Level
            </label>
            <div className="space-y-2">
              {[
                {
                  value: "public",
                  label: "Public",
                  desc: "Anyone can view",
                  icon: Globe,
                },
                {
                  value: "members",
                  label: "Members Only",
                  desc: "Only logged in users",
                  icon: Users,
                },
                {
                  value: "faculty",
                  label: "Faculty Only",
                  desc: "Restricted to faculty",
                  icon: Lock,
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="access"
                    value={option.value}
                    className="accent-primary-500"
                  />
                  <option.icon size={18} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
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
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
