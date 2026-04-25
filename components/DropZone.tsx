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
      className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
      ${isDragging ? "bg-blue-50 border-blue-400" : "bg-white"}`}
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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Drag and drop images here or click to browse"
    >
      <p className="font-medium">
        {hasImages
          ? "追加の画像をドラッグ＆ドロップ"
          : "画像が選択されていません"}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {hasImages
          ? "またはクリックして追加選択"
          : "ドラッグ＆ドロップまたはクリックして選択"}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          handleFiles(e.target.files);
          setTimeout(() => {
            e.target.value = "";
          }, 0);
        }}
      />
    </div>
  );
}
