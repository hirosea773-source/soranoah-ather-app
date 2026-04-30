"use client";

/**
 * リサイズ設定UI
 * - モード選択（Pixel / Percentage）
 * - アスペクト比維持
 * - 出力形式
 */

import { useState, useEffect } from "react";

export type ResizeSettings = {
  mode: "pixel" | "percentage";
  width: number;
  height: number;
  percentage: number;
  keepAspect: boolean;
  preventUpscale: boolean;
  format: "original" | "jpeg" | "png" | "webp";
  quality: number;
  originalWidth: number;
  originalHeight: number;
};

type Props = {
  onChange: (settings: ResizeSettings) => void;
  originalWidth: number;
  originalHeight: number;
};

export function ResizeOptions({
  onChange,
  originalWidth,
  originalHeight,
}: Props) {
  const [settings, setSettings] = useState<ResizeSettings>({
    mode: "pixel",
    width: originalWidth || 800,
    height: originalHeight || 600,
    percentage: 50,
    keepAspect: true,
    preventUpscale: true,
    format: "original",
    quality: 80,
    originalWidth: originalWidth || 800,
    originalHeight: originalHeight || 600,
  });

  const update = (patch: Partial<ResizeSettings>) => {
    setSettings((prev) => {
      let next = { ...prev, ...patch };

      // アスペクト比維持の場合、自動計算
      if (next.keepAspect && next.mode === "pixel") {
        if (patch.width !== undefined && patch.width !== prev.width) {
          // widthが変更された場合、heightを計算
          next.height = Math.round(
            (next.originalHeight / next.originalWidth) * next.width,
          );
        } else if (patch.height !== undefined && patch.height !== prev.height) {
          // heightが変更された場合、widthを計算
          next.width = Math.round(
            (next.originalWidth / next.originalHeight) * next.height,
          );
        }
      }

      return next;
    });
  };

  useEffect(() => {
    onChange(settings);
  }, [settings, onChange]);

  return (
    <div className="space-y-4">
      {/* モード */}
      <div>
        <p className="font-medium">リサイズ方法</p>
        <div className="flex flex-col gap-2 mt-3 sm:flex-row">
          <button
            onClick={() => update({ mode: "pixel" })}
            className={`w-full rounded-lg border px-3 py-2 text-left sm:text-center ${settings.mode === "pixel" ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
          >
            ピクセル指定
          </button>
          <button
            onClick={() => update({ mode: "percentage" })}
            className={`w-full rounded-lg border px-3 py-2 text-left sm:text-center ${settings.mode === "percentage" ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
          >
            %指定
          </button>
        </div>
      </div>

      {/* Pixel */}
      {settings.mode === "pixel" && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            type="number"
            value={settings.width}
            onChange={(e) => update({ width: Number(e.target.value) })}
          />
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            type="number"
            value={settings.height}
            onChange={(e) => update({ height: Number(e.target.value) })}
          />
        </div>
      )}

      {/* Percentage */}
      {settings.mode === "percentage" && (
        <div className="flex flex-col gap-2 sm:flex-row">
          {[25, 50, 75].map((p) => (
            <button
              key={p}
              onClick={() => update({ percentage: p })}
              className={`w-full rounded-lg border px-3 py-2 ${settings.percentage === p ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
            >
              {p}%
            </button>
          ))}
        </div>
      )}

      {/* その他 */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.keepAspect}
            onChange={(e) => update({ keepAspect: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">縦横比を維持</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.preventUpscale}
            onChange={(e) => update({ preventUpscale: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">小さい画像を拡大しない</span>
        </label>
      </div>

      {/* フォーマット */}
      <select
        value={settings.format}
        onChange={(e) => update({ format: e.target.value as any })}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      >
        <option value="original">元の形式</option>
        <option value="jpeg">JPG</option>
        <option value="png">PNG</option>
        <option value="webp">WebP</option>
      </select>

      {/* JPEG品質 */}
      {settings.format === "jpeg" && (
        <input
          className="w-full"
          type="range"
          min={10}
          max={100}
          value={settings.quality}
          onChange={(e) => update({ quality: Number(e.target.value) })}
        />
      )}
    </div>
  );
}
