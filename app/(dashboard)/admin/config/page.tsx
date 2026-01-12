"use client";

import React, { useState } from "react";
import {
  Save,
  Brain,
  Database,
  Sliders,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";

export default function ConfigPage() {
  const { addToast } = useToast();

  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [topK, setTopK] = useState(5);
  const [temperature, setTemperature] = useState(0.7);

  const models = [
    {
      id: "gpt-4",
      name: "GPT-4",
      provider: "OpenAI",
      cost: "High",
      quality: "Best",
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "OpenAI",
      cost: "Low",
      quality: "Good",
    },
    {
      id: "claude-3",
      name: "Claude 3",
      provider: "Anthropic",
      cost: "High",
      quality: "Best",
    },
    {
      id: "llama-3",
      name: "Llama 3 70B",
      provider: "Local",
      cost: "Free",
      quality: "Good",
    },
  ];

  const handleSave = () => {
    addToast({
      type: "success",
      title: "Configuration saved",
      message: "Your AI configuration has been updated successfully.",
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Configuration</h1>
          <p className="text-gray-500">
            Configure LLM models and RAG parameters
          </p>
        </div>
        <Button variant="primary" icon={Save} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      {/* Model Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Brain className="text-purple-600" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">LLM Model Selection</h2>
            <p className="text-sm text-gray-500">
              Choose the AI model for generating responses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {models.map((model) => (
            <label
              key={model.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedModel === model.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="model"
                  value={model.id}
                  checked={selectedModel === model.id}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mt-1 accent-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {model.name}
                    </span>
                    {model.quality === "Best" && (
                      <Badge variant="success">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{model.provider}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant={
                        model.cost === "Free"
                          ? "success"
                          : model.cost === "Low"
                          ? "warning"
                          : "error"
                      }
                    >
                      {model.cost} Cost
                    </Badge>
                    <Badge variant="default">{model.quality}</Badge>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Chunking Strategy */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Database className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Chunking Strategy</h2>
            <p className="text-sm text-gray-500">
              Configure how documents are split for processing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chunk Size (tokens)
            </label>
            <input
              type="number"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="input"
              min={500}
              max={4000}
              step={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 500 - 2000 tokens
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chunk Overlap (tokens)
            </label>
            <input
              type="number"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              className="input"
              min={0}
              max={500}
              step={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 100 - 300 tokens
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">What are chunks?</p>
            <p>
              Documents are split into smaller pieces called chunks for
              efficient embedding and retrieval. Larger chunks provide more
              context but may include irrelevant information. Overlap ensures
              important information spanning chunk boundaries isn't lost.
            </p>
          </div>
        </div>
      </div>

      {/* RAG Parameters */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Sliders className="text-green-600" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">RAG Parameters</h2>
            <p className="text-sm text-gray-500">
              Fine-tune retrieval and generation settings
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Top K */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Top K Results
              </label>
              <span className="text-sm font-medium text-primary-600">
                {topK}
              </span>
            </div>
            <input
              type="range"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              min={1}
              max={20}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>More context (higher latency)</span>
              <span>20</span>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Temperature
              </label>
              <span className="text-sm font-medium text-primary-600">
                {temperature}
              </span>
            </div>
            <input
              type="range"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              min={0}
              max={1}
              step={0.1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 (Focused)</span>
              <span>More creative</span>
              <span>1 (Creative)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle
          className="text-amber-600 flex-shrink-0 mt-0.5"
          size={20}
        />
        <div>
          <p className="font-medium text-amber-800">
            Changes require reprocessing
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Modifying chunking parameters will require reprocessing all
            documents. This may take significant time and incur additional
            costs.
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className="card p-4 bg-gray-50">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={18} />
          <span className="font-medium">Configuration is valid</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Last updated: {new Date().toLocaleDateString("vi-VN")} by Admin
        </p>
      </div>
    </div>
  );
}
