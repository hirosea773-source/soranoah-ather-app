"use client";

/**
 * 完成版
 * - 全機能統合
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageItem } from "@/components/ImageGrid";
import { ResizeSettings } from "@/components/ResizeOptions";
import { useImageProcessor } from "@/features/image-resizer/hooks/useImageProcessor";
import { exportAsZip } from "@/features/image-resizer/utils/zipExport";
import { ComparePreview } from "@/components/ComparePreview";
import { ImageModal } from "@/components/ImageModal";
import { toast } from "sonner";
import { PageContainer } from "@/components/primitives/PageContainer";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { HeroSection } from "@/features/image-resizer/components/HeroSection";
import { UploadCard } from "@/features/image-resizer/components/UploadCard";
import { ResizeSettingsCard } from "@/features/image-resizer/components/ResizeSettingsCard";
import { PreviewGrid } from "@/features/image-resizer/components/PreviewGrid";
import { ProcessingCard } from "@/features/image-resizer/components/ProcessingCard";

export default function HomePage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<ResizeSettings | null>(null);
  const [processedResults, setProcessedResults] = useState<Blob[] | null>(null);
  const [afterMap, setAfterMap] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const { processImages, cancel, progress, isProcessing } = useImageProcessor();
  const isReadyForProcessing = Boolean(settings && images.length > 0);

  useEffect(() => {
    if (!settings) return;

    images.forEach((img) => {
      if (img.file) {
        generatePreview(img.file, img.id, settings);
      }
    });
  }, [settings]);

  /**
   * リサイズ処理を実行するPromise関数
   */
  const executeResize = async (): Promise<Blob[]> => {
    const files = images.map((img) => img.file!).filter(Boolean);
    return await processImages(files, settings!);
  };

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
    setIsUploading(true);
    setProcessingError(null);
    setProcessedResults(null);

    try {
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcess = async () => {
    if (!settings) {
      toast.error("設定を選択してください");
      return;
    }

    setProcessingError(null);

    const toastId = toast.promise(executeResize(), {
      loading: "画像を処理しています...",
      success: (results) => `${results.length}枚の画像を処理しました`,
      error: (error) => {
        if (error instanceof Error && error.message === "Cancelled") {
          return "処理がキャンセルされました";
        }
        return "画像処理に失敗しました";
      },
    });

    try {
      const results = await toastId.unwrap();
      setProcessedResults(results);

      if (results.length === 1) {
        const url = URL.createObjectURL(results[0]);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resized_image";
        a.click();
        return;
      }

      // 複数ファイルの場合はプレビュー後に手動保存
    } catch (error) {
      if (error instanceof Error && error.message !== "Cancelled") {
        setProcessingError(error.message || "処理中にエラーが発生しました");
      }
    }
  };

  const handleDownloadZip = async () => {
    if (!processedResults) return;

    const toastId = toast.promise(
      exportAsZip(
        processedResults,
        images.map((img) => img.name),
      ),
      {
        loading: "ZIPファイルを作成しています...",
        success: "ZIPファイルをダウンロードしました",
        error: (error) => {
          if (error instanceof Error) {
            return `ZIP作成に失敗しました: ${error.message}`;
          }
          return "ZIP作成に失敗しました";
        },
      },
    );

    try {
      await toastId.unwrap();
    } catch (error) {
      // unwrap でエラーが発生した場合、toast.promise でエラーが表示されるので、ここでは何もしない
    }
  };

  return (
    <PageContainer>
      {/* Upload Section */}
      <section id="upload-area" className="mb-12">
        <SectionTitle
          title="1. 画像をアップロード"
          description="処理したい画像を追加してください"
        />
        <UploadCard
          onFilesAccepted={handleFiles}
          hasImages={images.length > 0}
          isUploading={isUploading}
        />
      </section>

      {/* Settings Section */}
      {images.length > 0 && (
        <section className="mb-12">
          <SectionTitle
            title="2. 設定を完了"
            description="リサイズ条件を選択してから、プレビューと処理を進めます"
          />
          <ResizeSettingsCard
            onChange={(nextSettings) => {
              setSettings(nextSettings);
              setProcessedResults(null);
            }}
            originalWidth={images[0]?.width || 800}
            originalHeight={images[0]?.height || 600}
          />
        </section>
      )}

      {/* Preview Section */}
      {images.length > 0 && (
        <section className="mb-12">
          <SectionTitle
            title="3. 画像を確認"
            description="設定を反映した画像を確認し、必要があれば順番を調整してください"
          />
          <PreviewGrid
            images={images}
            onReorder={(from, to) => {
              setImages((prev) => reorder(prev, from, to));
              setProcessedResults(null);
            }}
            processedResults={processedResults || undefined}
            onImageClick={setSelectedImage}
          />

          {/* Before/After Comparison */}
          {processedResults && (
            <div className="mt-8">
              <SectionTitle
                title="処理結果比較"
                description="左が元の画像、右がリサイズ後の結果です"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img) => (
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
            </div>
          )}
        </section>
      )}

      {/* Processing Section */}
      <ProcessingCard
        imagesCount={images.length}
        hasSettings={!!settings}
        isProcessing={isProcessing}
        progress={progress}
        processedCount={processedResults?.length || 0}
        hasResults={!!processedResults}
        errorMessage={processingError}
        onProcess={handleProcess}
        onCancel={cancel}
        onDownloadZip={handleDownloadZip}
      />

      {/* Modal */}
      {selectedImage && (
        <ImageModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </PageContainer>
  );
}
