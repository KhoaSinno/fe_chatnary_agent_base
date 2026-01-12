"use client";

import React, { useState } from "react";
import { Brain, Sparkles, Clock, Target } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type Difficulty = "easy" | "medium" | "hard";
type QuestionCount = 5 | 10 | 20;

interface ExamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: (config: {
    difficulty: Difficulty;
    questionCount: QuestionCount;
  }) => void;
  projectName: string;
}

const difficultyConfig: Record<
  Difficulty,
  { label: string; description: string; color: string; icon: string }
> = {
  easy: {
    label: "Dễ (Easy)",
    description: "Câu hỏi cơ bản, khái niệm chính",
    color: "border-green-500 bg-green-50 text-green-700",
    icon: "🌱",
  },
  medium: {
    label: "Trung bình (Medium)",
    description: "Câu hỏi vận dụng, phân tích",
    color: "border-amber-500 bg-amber-50 text-amber-700",
    icon: "⚡",
  },
  hard: {
    label: "Khó (Hard)",
    description: "Câu hỏi tổng hợp, đánh giá",
    color: "border-red-500 bg-red-50 text-red-700",
    icon: "🔥",
  },
};

const questionCountOptions: {
  value: QuestionCount;
  label: string;
  time: string;
}[] = [
  { value: 5, label: "5 câu", time: "~5 phút" },
  { value: 10, label: "10 câu", time: "~10 phút" },
  { value: 20, label: "20 câu", time: "~20 phút" },
];

export function ExamConfigModal({
  isOpen,
  onClose,
  onStartExam,
  projectName,
}: ExamConfigModalProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = async () => {
    setIsGenerating(true);
    // Simulate AI generating questions
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    onStartExam({ difficulty, questionCount });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
          <Brain className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">AI Exam Simulator</h2>
        <p className="text-gray-500 mt-1">
          Tạo đề thi trắc nghiệm từ:{" "}
          <span className="font-medium text-primary-600">{projectName}</span>
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Target size={16} />
          Chọn mức độ khó
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(difficultyConfig) as Difficulty[]).map((level) => {
            const config = difficultyConfig[level];
            const isSelected = difficulty === level;
            return (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? config.color + " ring-2 ring-offset-2 ring-current"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">{config.icon}</div>
                <div className="font-medium text-sm">{config.label}</div>
                <div className="text-xs opacity-75 mt-1">
                  {config.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Count Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Clock size={16} />
          Số lượng câu hỏi
        </label>
        <div className="grid grid-cols-3 gap-3">
          {questionCountOptions.map((option) => {
            const isSelected = questionCount === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setQuestionCount(option.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-offset-2 ring-primary-300"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold text-xl">{option.label}</div>
                <div className="text-xs opacity-75 mt-1">{option.time}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleStart}
          isLoading={isGenerating}
          icon={Sparkles}
          className="flex-1"
        >
          {isGenerating ? "Đang tạo đề..." : "Bắt đầu thi"}
        </Button>
      </div>

      {/* AI Note */}
      <p className="text-xs text-gray-400 text-center mt-4">
        🤖 AI sẽ phân tích tài liệu và tạo câu hỏi phù hợp với mức độ bạn chọn
      </p>
    </Modal>
  );
}
