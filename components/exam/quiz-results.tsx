"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { QuizQuestion, Citation } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: Record<string, "A" | "B" | "C" | "D">;
  onRetry: () => void;
  onClose: () => void;
  onCitationClick?: (citation: Citation) => void;
}

// Confetti Component
function Confetti() {
  const [pieces, setPieces] = useState<
    Array<{ id: number; left: number; color: string; delay: number }>
  >([]);

  useEffect(() => {
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
    ];
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Single Result Item
interface ResultItemProps {
  question: QuizQuestion;
  userAnswer?: "A" | "B" | "C" | "D";
  index: number;
  onCitationClick?: (citation: Citation) => void;
}

function ResultItem({
  question,
  userAnswer,
  index,
  onCitationClick,
}: ResultItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCorrect = userAnswer === question.correctAnswer;
  const isUnanswered = !userAnswer;

  return (
    <div
      className={`border rounded-xl overflow-hidden ${
        isCorrect
          ? "border-green-200 bg-green-50"
          : isUnanswered
          ? "border-gray-200 bg-gray-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      {/* Question Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCorrect
              ? "bg-green-500 text-white"
              : isUnanswered
              ? "bg-gray-400 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {isCorrect ? (
            <CheckCircle size={18} />
          ) : isUnanswered ? (
            <span className="text-sm font-medium">?</span>
          ) : (
            <XCircle size={18} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            Câu {index + 1}: {question.question}
          </p>
          <p className="text-sm text-gray-500">
            {isCorrect
              ? "Chính xác"
              : isUnanswered
              ? "Chưa trả lời"
              : `Bạn chọn: ${userAnswer} | Đáp án: ${question.correctAnswer}`}
          </p>
        </div>

        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-current/10 animate-fadeIn">
          {/* Options */}
          <div className="space-y-2 mb-4">
            {question.options.map((option) => {
              const isUserAnswer = userAnswer === option.label;
              const isCorrectAnswer = question.correctAnswer === option.label;

              return (
                <div
                  key={option.label}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isCorrectAnswer
                      ? "bg-green-100 border border-green-300"
                      : isUserAnswer && !isCorrectAnswer
                      ? "bg-red-100 border border-red-300"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCorrectAnswer
                        ? "bg-green-500 text-white"
                        : isUserAnswer
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  {isCorrectAnswer && (
                    <CheckCircle size={18} className="text-green-600" />
                  )}
                  {isUserAnswer && !isCorrectAnswer && (
                    <XCircle size={18} className="text-red-600" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span> Giải thích
            </h4>
            <p className="text-gray-600 text-sm mb-3">{question.explanation}</p>

            {/* Citation */}
            <button
              onClick={() => onCitationClick?.(question.citation)}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <FileText size={14} />
              <span>
                Nguồn: {question.citation.documentName}, trang{" "}
                {question.citation.pageNumber}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuizResults({
  questions,
  answers,
  onRetry,
  onClose,
  onCitationClick,
}: QuizResultsProps) {
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const isPassing = score >= 60;
  const isExcellent = score >= 80;

  return (
    <div className="fixed inset-0 bg-gray-900/90 z-50 flex items-center justify-center p-4">
      {isExcellent && <Confetti />}

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeInUp">
        {/* Header */}
        <div
          className={`px-6 pt-8 pb-6 text-center ${
            isExcellent
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : isPassing
              ? "bg-gradient-to-br from-green-400 to-emerald-500"
              : "bg-gradient-to-br from-gray-400 to-gray-500"
          } text-white`}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <Trophy size={40} />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {isExcellent
              ? "🎉 Xuất sắc!"
              : isPassing
              ? "👍 Tốt lắm!"
              : "💪 Cố gắng hơn!"}
          </h2>

          <div className="text-5xl font-bold mb-2">{score}%</div>

          <p className="text-white/80">
            Trả lời đúng {correctCount}/{questions.length} câu
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {correctCount}
            </div>
            <div className="text-xs text-gray-500">Đúng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {questions.length -
                correctCount -
                (questions.length - Object.keys(answers).length)}
            </div>
            <div className="text-xs text-gray-500">Sai</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">
              {questions.length - Object.keys(answers).length}
            </div>
            <div className="text-xs text-gray-500">Bỏ qua</div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {questions.map((question, index) => (
            <ResultItem
              key={question.id}
              question={question}
              userAnswer={answers[question.id]}
              index={index}
              onCitationClick={onCitationClick}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <Button
            variant="secondary"
            icon={Home}
            onClick={onClose}
            className="flex-1"
          >
            Về trang chủ
          </Button>
          <Button
            variant="primary"
            icon={RefreshCw}
            onClick={onRetry}
            className="flex-1"
          >
            Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
}
