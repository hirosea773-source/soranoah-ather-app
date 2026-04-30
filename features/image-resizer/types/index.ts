/**
 * アップロード画像情報
 */
export type ImageFile = {
  id: string;
  file: File;
  preview: string;

  originalWidth: number;
  originalHeight: number;

  estimatedWidth?: number;
  estimatedHeight?: number;

  originalSize: number;
  estimatedSize?: number;

  processedBlob?: Blob;
};

/**
 * リサイズ設定
 */
export type ResizeSettings = {
  mode: "pixel" | "percentage";

  width?: number;
  height?: number;

  percentage?: number;

  maintainAspectRatio: boolean;

  preventEnlarge: boolean;

  outputFormat: "original" | "jpeg" | "png" | "webp";

  quality: number;
};
