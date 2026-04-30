"use client";

/**
 * DropZone component handles drag-and-drop and file browser for image uploads.
 * Validates file types (JPG, PNG, WebP), size (max 20MB per file), and count (max 20).
 * Shows error toasts for invalid files.
 */

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type DropZoneProps = {
  onFilesAccepted: (files: File[]) => void;
  hasImages?: boolean;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 20;

export default function DropZone({
  onFilesAccepted,
  hasImages = false,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = (files: File[]) => {
    const valid: File[] = [];

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`非対応形式: ${file.name}`);
        continue;
      }

      if (file.size > MAX_SIZE) {
        toast.error(`サイズ超過: ${file.name}`);
        continue;
      }

      valid.push(file);
    }

    if (valid.length > MAX_FILES) {
      toast.error("最大20ファイルまでです");
      return valid.slice(0, MAX_FILES);
    }

    return valid;
  };

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const files = Array.from(fileList);
      const valid = validateFiles(files);

      if (valid.length > 0) {
        onFilesAccepted(valid);
      }
    },
    [onFilesAccepted],
  );

  return (
    <div
      className="relative w-full max-w-4xl mx-auto min-h-[320px] rounded-3xl bg-slate-100 p-4 sm:p-6"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      aria-label="Drag and drop images here or click to browse"
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="absolute inset-0 opacity-0 cursor-pointer z-0"
        onChange={(e) => {
          handleFiles(e.target.files);
          setTimeout(() => {
            e.target.value = "";
          }, 0);
        }}
      />

      <div
        className={`relative z-10 h-full w-full rounded-xl border-2 border-dashed p-10 text-center hover:bg-muted/50 transition cursor-pointer ${isDragging ? "bg-blue-50 border-blue-400 shadow-lg" : "border-slate-300"}`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            アップロードエリア
          </div>

          <p className="text-xl font-semibold text-slate-900">
            {hasImages
              ? "追加の画像をドラッグ＆ドロップ"
              : "ここに画像をドロップ"}
          </p>

          <p className="text-sm text-slate-600 max-w-lg">
            {hasImages
              ? "またはここをクリックして追加選択してください。"
              : "JPG・PNG・WebP をドラッグアンドドロップするか、クリックして選択してください。"}
          </p>

          <span className="inline-flex rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs text-slate-500">
            JPG・PNG・WebP / 最大20ファイル / 20MBまで
          </span>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 rounded-full border border-slate-300 bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200"
          >
            アップロード
          </button>
        </div>
      </div>
    </div>
  );
}
