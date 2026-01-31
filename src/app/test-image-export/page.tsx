// src/app/test-image-export/page.tsx
// 画像保存機能の独立テストページ
'use client';

import React, { useState } from 'react';
import { SaveImageButton } from '@/components/atoms/SaveImageButton';
import { SaveImageModal } from '@/components/organisms/SaveImageModal';
import { useImageExport } from '../../hooks/useImageExport';
import { ImageExportOption } from '@/types/imageExport';

export default function TestImageExportPage() {
  const [isSaveImageModalOpen, setIsSaveImageModalOpen] = useState(false);
  const { exportPrintPages } = useImageExport();

  const handleSaveImage = async (option: ImageExportOption, fileName: string) => {
    await exportPrintPages(option, fileName);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* コントロールエリア */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">画像保存機能テスト</h1>
          <p className="text-gray-600 mb-4">
            下のボタンをクリックして、画像保存機能をテストしてください。
          </p>
          <SaveImageButton onClick={() => setIsSaveImageModalOpen(true)} />
        </div>

        {/* プレビューエリア */}
        <div className="space-y-6">
          {/* 表面（Front side） */}
          <div className="bg-white rounded-lg shadow overflow-hidden print-front">
            <div className="bg-blue-600 text-white px-4 py-2 font-bold">
              表面（Front）
            </div>
            <div className="grid grid-cols-3 divide-x min-h-[400px]">
              {/* 右側：外表紙 */}
              <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <h2 className="text-2xl font-bold text-center mb-4">
                  京都・大阪 2泊3日の旅
                </h2>
                <p className="text-gray-700">京都府・大阪府</p>
                <p className="text-sm text-gray-600 mt-2">
                  2025年12月1日 - 12月3日
                </p>
              </div>

              {/* 中央：スケジュール1 */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-gray-300">
                  12月1日（月）
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2 text-sm">
                    <span className="font-medium w-12">09:00</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                          移動
                        </span>
                        <span className="font-medium">東京駅から新幹線</span>
                      </div>
                      <p className="text-xs text-gray-600">のぞみ123号</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="font-medium w-12">11:30</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
                          観光
                        </span>
                        <span className="font-medium">清水寺</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="font-medium w-12">13:00</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-800">
                          食事
                        </span>
                        <span className="font-medium">京料理ランチ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 左側：スケジュール2 */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-gray-300">
                  12月2日（火）
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2 text-sm">
                    <span className="font-medium w-12">09:00</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
                          観光
                        </span>
                        <span className="font-medium">伏見稲荷大社</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="font-medium w-12">14:00</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                          移動
                        </span>
                        <span className="font-medium">大阪へ移動</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 裏面（Back side） */}
          <div className="bg-white rounded-lg shadow overflow-hidden print-back">
            <div className="bg-green-600 text-white px-4 py-2 font-bold">
              裏面（Back）
            </div>
            <div className="grid grid-cols-3 divide-x min-h-[400px]">
              {/* 左側：メモ */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-gray-300">
                  メモ
                </h3>
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-2" />
                  ))}
                </div>
              </div>

              {/* 中央：予算サマリー */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-gray-300">
                  予算サマリー
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">合計金額</div>
                    <div className="text-2xl font-bold text-blue-800">
                      ¥50,400
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">移動</span>
                      <span className="font-medium">¥27,200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">食事</span>
                      <span className="font-medium">¥6,700</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">観光</span>
                      <span className="font-medium">¥1,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">宿</span>
                      <span className="font-medium">¥8,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">買い物</span>
                      <span className="font-medium">¥5,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側：裏表紙 */}
              <div className="p-6 flex items-center justify-center bg-gray-50">
                <div className="text-center text-sm text-gray-600">
                  <p className="text-lg mb-2">🎉</p>
                  <p>素敵な旅を！</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 説明 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2">💡 テスト手順</h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>「画像で保存」ボタンをクリック</li>
            <li>モーダルで保存範囲を選択（両面 / 表面 / 裏面）</li>
            <li>ファイル名を確認・編集</li>
            <li>「保存する」ボタンで画像をダウンロード</li>
            <li>保存された画像を確認</li>
          </ol>
        </div>
      </div>

      {/* 画像保存モーダル */}
      <SaveImageModal
        isOpen={isSaveImageModalOpen}
        onClose={() => setIsSaveImageModalOpen(false)}
        onSave={handleSaveImage}
        defaultFileName="旅のしおり_京都大阪_2025-12-01"
      />
    </main>
  );
}