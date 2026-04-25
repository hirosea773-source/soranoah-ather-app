"use client";

/**
 * ImageGrid（改善版）
 * - 結果領域として明確化
 * - 情報の優先順位を整理
 */

import { useState } from "react";

export type ImageItem = {
  id: string;
  file: File | null;
  previewUrl: string;
  name: string;
  width: number;
  height: number;
  size: number;
};

type Props = {
  images: ImageItem[];
  onReorder: (from: number, to: number) => void;
};

export function ImageGrid({ images, onReorder }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img, index) => (
        <div
          key={img.id}
          className="bg-white rounded-lg p-3 space-y-2 cursor-move"
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== index) {
              onReorder(dragIndex, index);
              setDragIndex(null);
            }
          }}
        >
          <img
            src={img.previewUrl}
            alt={img.name}
            className="w-full h-[150px] object-cover rounded"
          />

          <div className="text-sm space-y-1">
            <p className="font-medium truncate">{img.name}</p>

            <p className="text-gray-600">
              サイズ: {(img.size / 1024).toFixed(1)} KB
            </p>

            <p className="text-gray-600">
              解像度: {img.width || "-"} × {img.height || "-"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
