"use client";

import React, { useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertCircle,
} from "lucide-react";
import { QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  onComplete: (answers: Record<string, "A" | "B" | "C" | "D">) => void;
  onExit: () => void;
}

export function QuizInterface({
  questions,
  onComplete,
  onExit,
}: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>(
    {}
  );
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const handleSelectAnswer = (option: "A" | "B" | "C" | "D") => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFlag = () => {
    setFlagged((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      setShowConfirm(true);
    } else {
      onComplete(answers);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">AI Exam Simulator</h2>
            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <Clock size={16} />
              <span>15:00</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-white/80 mt-2">
            Đã trả lời: {answeredCount}/{questions.length}
          </p>
        </div>

        {/* Question Navigation */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 overflow-x-auto">
          <div className="flex gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id];
              const isCurrent = idx === currentIndex;
              const isFlagged = flagged.has(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-10 h-10 rounded-lg font-medium text-sm transition-all flex-shrink-0 ${
                    isCurrent
                      ? "bg-primary-500 text-white ring-2 ring-primary-300 ring-offset-2"
                      : isAnswered
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Câu {currentIndex + 1} / {questions.length}
              </span>
              <button
                onClick={handleFlag}
                className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors ${
                  flagged.has(currentQuestion.id)
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Flag size={14} />
                <span>
                  {flagged.has(currentQuestion.id) ? "Đã đánh dấu" : "Đánh dấu"}
                </span>
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.label;

              return (
                <button
                  key={option.label}
                  onClick={() => handleSelectAnswer(option.label)}
                  className={`quiz-option w-full ${
                    isSelected ? "selected" : ""
                  }`}
                >
                  <span
                    className={`quiz-option-label ${
                      isSelected ? "bg-primary-500 text-white" : ""
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="flex-1 text-left">{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={ChevronLeft}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Trước
            </Button>
            <Button
              variant="secondary"
              icon={ChevronRight}
              iconPosition="right"
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
            >
              Sau
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={onExit}>
              Thoát
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Nộp bài
            </Button>
          </div>
        </div>

        {/* Confirm Dialog */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fadeInUp">
              <div className="flex items-center gap-3 text-amber-600 mb-4">
                <AlertCircle size={24} />
                <h3 className="font-semibold text-lg">Bạn chưa hoàn thành!</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn còn {questions.length - answeredCount} câu chưa trả lời. Bạn
                có chắc muốn nộp bài?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1"
                >
                  Tiếp tục làm
                </Button>
                <Button
                  variant="primary"
                  onClick={() => onComplete(answers)}
                  className="flex-1"
                >
                  Nộp bài
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
