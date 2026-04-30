import * as React from "react";
import { Upload, FileImage, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { designTokens } from "@/lib/design/tokens";

interface UploadCardProps {
  onFilesAccepted: (files: File[]) => void;
  hasImages: boolean;
  isUploading: boolean;
}

/**
 * Upload Card
 * ドラッグ＆ドロップ対応のアップロードエリア
 */
export function UploadCard({
  onFilesAccepted,
  hasImages,
  isUploading,
}: UploadCardProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    validateAndAccept(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    validateAndAccept(files);
  };

  const validateAndAccept = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("画像ファイルのみアップロード可能です");
      return;
    }

    if (imageFiles.some((file) => file.size > 50 * 1024 * 1024)) {
      setError("ファイルサイズは50MB以下にしてください");
      return;
    }

    onFilesAccepted(imageFiles);
  };

  return (
    <Card
      className={
        `${designTokens.shadows.card} transition-all duration-200 ${
          isDragging ? "ring-2 ring-blue-500 bg-blue-50" : ""
        } ${error ? "ring-2 ring-red-500 bg-red-50" : ""}`
      }
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      aria-label="画像アップロードエリア"
    >
      <CardContent className="p-8">
        <div className="text-center">
          {/* Icon */}
          <div
            className={`
            mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging ? "bg-blue-100" : error ? "bg-red-100" : "bg-slate-100"}
          `}
          >
            {error ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : (
              <Upload
                className={`w-8 h-8 ${isDragging ? "text-blue-600" : "text-slate-600"}`}
              />
            )}
          </div>

          {/* Main Text */}
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {error
              ? "アップロードエラー"
              : isUploading
                ? "読み込み中..."
                : hasImages
                  ? "追加の画像をアップロード"
                  : "画像をアップロード"}
          </h3>

          <p className="text-slate-600 mb-4">
            {error
              ? error
              : isUploading
                ? "ファイルを読み込み中です。しばらくお待ちください。"
                : "ドラッグ＆ドロップまたはクリックしてファイルを選択してください"}
          </p>

          {isUploading && (
            <div className="mb-4 text-sm text-slate-500">
              アップロード処理を保持し、完了後に次の設定に進めます。
            </div>
          )}

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="画像ファイルを選択"
          />

          <Button
            variant={error ? "destructive" : "default"}
            size="lg"
            onClick={() => fileInputRef.current?.click()}
            className="mb-4"
            disabled={isUploading}
          >
            <FileImage className="w-4 h-4 mr-2" />
            {isUploading ? "読み込み中..." : "ファイルを選択"}
          </Button>

          {/* Supported Formats */}
          <div className="text-sm text-slate-500 space-y-1">
            <p>対応形式: JPG, PNG, WebP, GIF</p>
            <p>最大サイズ: 50MB / ファイル</p>
            <p>複数ファイル対応</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
