"use client";

import React, { useState } from "react";
import { ImageExportOption } from "@/types/imageExport";

interface SaveImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (option: ImageExportOption, fileName: string) => Promise<void>;
  defaultFileName: string;
}

export const SaveImageModal: React.FC<SaveImageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultFileName,
}) => {
  const [selectedOption, setSelectedOption] =
    useState<ImageExportOption>("both");
  const [fileName, setFileName] = useState(defaultFileName);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      await onSave(selectedOption, fileName);
      onClose();
    } catch (error) {
      console.error("Failed to save image:", error);
      alert("画像の保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileNamePreview = () => {
    if (selectedOption === "both") {
      return `${fileName}_表面.png, ${fileName}_裏面.png`;
    } else if (selectedOption === "front") {
      return `${fileName}_表面.png`;
    } else {
      return `${fileName}_裏面.png`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">画像として保存</h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none disabled:opacity-50"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* 保存範囲の選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                保存する範囲
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="exportOption"
                    value="both"
                    checked={selectedOption === "both"}
                    onChange={(e) =>
                      setSelectedOption(e.target.value as ImageExportOption)
                    }
                    className="mt-1 mr-3"
                    disabled={isProcessing}
                  />
                  <div>
                    <div className="font-medium">両面（表面・裏面）</div>
                    <div className="text-sm text-gray-600">
                      2枚の画像として保存されます
                    </div>
                  </div>
                </label>

                <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="exportOption"
                    value="front"
                    checked={selectedOption === "front"}
                    onChange={(e) =>
                      setSelectedOption(e.target.value as ImageExportOption)
                    }
                    className="mt-1 mr-3"
                    disabled={isProcessing}
                  />
                  <div>
                    <div className="font-medium">表面のみ</div>
                    <div className="text-sm text-gray-600">
                      表紙とスケジュール
                    </div>
                  </div>
                </label>

                <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="exportOption"
                    value="back"
                    checked={selectedOption === "back"}
                    onChange={(e) =>
                      setSelectedOption(e.target.value as ImageExportOption)
                    }
                    className="mt-1 mr-3"
                    disabled={isProcessing}
                  />
                  <div>
                    <div className="font-medium">裏面のみ</div>
                    <div className="text-sm text-gray-600">
                      メモと予算サマリー
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* ファイル名の入力 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイル名
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                disabled={isProcessing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                placeholder="ファイル名を入力"
              />
              <p className="mt-2 text-xs text-gray-500">
                保存されるファイル: {getFileNamePreview()}
              </p>
            </div>

            {/* 注意事項 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">💡 ヒント</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>高解像度（Retina対応）で保存されます</li>
                    <li>SNSでのシェアやスマホでの閲覧に最適です</li>
                    <li>画像サイズは自動的に最適化されます</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing || !fileName.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  処理中...
                </>
              ) : (
                "保存する"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
