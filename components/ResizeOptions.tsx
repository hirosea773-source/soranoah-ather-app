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
        <div className="flex gap-2 mt-2">
          <button onClick={() => update({ mode: "pixel" })}>
            ピクセル指定
          </button>
          <button onClick={() => update({ mode: "percentage" })}>%指定</button>
        </div>
      </div>

      {/* Pixel */}
      {settings.mode === "pixel" && (
        <div className="flex gap-2">
          <input
            type="number"
            value={settings.width}
            onChange={(e) => update({ width: Number(e.target.value) })}
          />
          <input
            type="number"
            value={settings.height}
            onChange={(e) => update({ height: Number(e.target.value) })}
          />
        </div>
      )}

      {/* Percentage */}
      {settings.mode === "percentage" && (
        <div className="flex gap-2">
          {[25, 50, 75].map((p) => (
            <button key={p} onClick={() => update({ percentage: p })}>
              {p}%
            </button>
          ))}
        </div>
      )}

      {/* その他 */}
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="checkbox"
            checked={settings.keepAspect}
            onChange={(e) => update({ keepAspect: e.target.checked })}
          />
          縦横比を維持
        </label>

        <label>
          <input
            type="checkbox"
            checked={settings.preventUpscale}
            onChange={(e) => update({ preventUpscale: e.target.checked })}
          />
          小さい画像を拡大しない
        </label>
      </div>

      {/* フォーマット */}
      <select
        value={settings.format}
        onChange={(e) => update({ format: e.target.value as any })}
      >
        <option value="original">元の形式</option>
        <option value="jpeg">JPG</option>
        <option value="png">PNG</option>
        <option value="webp">WebP</option>
      </select>

      {/* JPEG品質 */}
      {settings.format === "jpeg" && (
        <input
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
