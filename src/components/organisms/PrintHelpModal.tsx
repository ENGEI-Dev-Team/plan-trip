// src/components/organisms/PrintHelpModal.tsx
'use client';

import React from 'react';

interface PrintHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintHelpModal: React.FC<PrintHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">印刷ガイド</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-lg mb-2">両面プリンタの場合</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>印刷設定で「両面印刷」を選択</li>
                <li>用紙サイズは「A4」を選択</li>
                <li>「短辺とじ」を選択（横向きの場合）</li>
                <li>印刷を実行</li>
              </ol>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">片面プリンタの場合</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>まず「表面」のページのみを印刷</li>
                <li>印刷された用紙を裏返してトレイに戻す</li>
                <li>次に「裏面」のページを印刷</li>
                <li>※用紙の向きに注意してください</li>
              </ol>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">三つ折りの方法</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>印刷された用紙を横向きに置く</li>
                <li>右側3分の1を内側に折る</li>
                <li>左側3分の1を上に重ねて折る</li>
                <li>完成！</li>
              </ol>
            </section>

            <section className="bg-yellow-50 p-4 rounded">
              <h3 className="font-bold text-sm mb-2">💡 ヒント</h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                <li>印刷前にプレビューで確認することをおすすめします</li>
                <li>用紙は厚めの紙を使うと仕上がりがきれいです</li>
                <li>PDFとして保存しておくと後から印刷できます</li>
              </ul>
            </section>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};