"use client";

/**
 * 完成版
 * - 全機能統合
 */

import { useState, useEffect } from "react";
import DropZone from "@/components/DropZone";
import { ImageGrid, ImageItem } from "@/components/ImageGrid";
import { ResizeOptions, ResizeSettings } from "@/components/ResizeOptions";
import { useImageProcessor } from "@/lib/useImageProcessor";
import { exportAsZip } from "@/lib/zipExport";
import { ProgressBar } from "@/components/ProgressBar";
import { ComparePreview } from "@/components/ComparePreview";
import { ImageModal } from "@/components/ImageModal";

export default function HomePage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<ResizeSettings | null>(null);
  const [processedResults, setProcessedResults] = useState<Blob[] | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [afterMap, setAfterMap] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { processImages, cancel, progress, isProcessing } = useImageProcessor();

  useEffect(() => {
    if (!settings) return;

    images.forEach((img) => {
      if (img.file) {
        generatePreview(img.file, img.id, settings);
      }
    });
  }, [settings]);

  /**
   * 配列の並び替え
   */
  const reorder = (list: ImageItem[], start: number, end: number) => {
    const result = [...list];
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result;
  };

  /**
   * 1枚だけ軽量リサイズしてプレビュー生成
   */
  const generatePreview = async (
    file: File,
    id: string,
    settings: ResizeSettings,
  ) => {
    const bitmap = await createImageBitmap(file);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let w = bitmap.width;
    let h = bitmap.height;

    if (settings.mode === "percentage") {
      w = w * (settings.percentage / 100);
      h = h * (settings.percentage / 100);
    }

    if (settings.mode === "pixel") {
      w = settings.width;
      h = settings.height;
    }

    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(bitmap, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", 0.7),
    );

    if (!blob) return;

    const url = URL.createObjectURL(blob);

    setAfterMap((prev) => ({
      ...prev,
      [id]: url,
    }));
  };

  const handleFiles = async (files: File[]) => {
    const mapped = await Promise.all(
      files.map(async (file) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => (img.onload = resolve));
        return {
          id: crypto.randomUUID(),
          file,
          previewUrl: img.src,
          name: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
        };
      }),
    );

    setImages((prev) => [...prev, ...mapped]);
  };

  const handleProcess = async () => {
    if (!settings) {
      alert("設定を選択してください");
      return;
    }

    try {
      const files = images.map((img) => img.file!).filter(Boolean);

      const results = await processImages(files, settings);
      setProcessedResults(results);

      if (results.length === 1) {
        const url = URL.createObjectURL(results[0]);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resized_image";
        a.click();
        setHistory((prev) => [
          ...prev,
          `ダウンロード: ${new Date().toLocaleTimeString()} - 単一画像`,
        ]);
        return;
      }

      // 複数ファイルの場合はプレビュー後に手動保存
    } catch (error) {
      if (error.message === "Cancelled") {
        // キャンセルされた場合、何もしない
      } else {
        alert("処理中にエラーが発生しました: " + error.message);
      }
    }
  };

  const handleDownloadZip = async () => {
    if (!processedResults) return;

    try {
      await exportAsZip(
        processedResults,
        images.map((img) => img.name),
      );
      setHistory((prev) => [
        ...prev,
        `ダウンロード: ${new Date().toLocaleTimeString()} - ZIP (${processedResults.length}画像)`,
      ]);
    } catch (error) {
      alert("ZIP作成中にエラーが発生しました: " + error.message);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Step1 */}
        <section>
          <h2 className="text-xl font-semibold">Step1: 画像アップロード</h2>
          <DropZone
            onFilesAccepted={handleFiles}
            hasImages={images.length > 0}
          />
        </section>

        {/* Step2 */}
        <section>
          <h2 className="text-xl font-semibold">Step2: 画像一覧</h2>

          {images.length === 0 ? (
            <p>画像がありません</p>
          ) : (
            <>
              <ImageGrid
                images={images}
                onReorder={(from, to) => {
                  setImages((prev) => reorder(prev, from, to));
                }}
              />

              {processedResults && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Before / After 比較</h3>
                  {images.map((img, index) => (
                    <ComparePreview
                      key={img.id}
                      before={img.previewUrl}
                      after={afterMap[img.id]}
                      onClick={() =>
                        setSelectedImage(afterMap[img.id] || img.previewUrl)
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Step3 */}
        {images.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold">Step3: リサイズ設定</h2>

            <ResizeOptions
              onChange={setSettings}
              originalWidth={images[0]?.width || 800}
              originalHeight={images[0]?.height || 600}
            />
          </section>
        )}

        {/* Step4 */}
        {images.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Step4: 実行</h2>

            <div className="flex gap-2">
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isProcessing ? "処理中..." : "リサイズ開始"}
              </button>

              {isProcessing && (
                <button
                  onClick={cancel}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  キャンセル
                </button>
              )}

              {processedResults &&
                !isProcessing &&
                processedResults.length > 1 && (
                  <button
                    onClick={handleDownloadZip}
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                  >
                    ZIPで保存
                  </button>
                )}

              {processedResults && !isProcessing && (
                <button
                  onClick={handleProcess}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  再実行
                </button>
              )}
            </div>

            {isProcessing && <ProgressBar progress={progress} />}
          </section>
        )}
      </div>

      {/* ダウンロード履歴 */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">ダウンロード履歴</h2>

        {history.length === 0 ? (
          <p className="text-sm text-gray-500">履歴なし</p>
        ) : (
          <ul className="text-sm space-y-1">
            {history.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </section>

      {/* 画像拡大モーダル */}
      {selectedImage && (
        <ImageModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </main>
  );
}
