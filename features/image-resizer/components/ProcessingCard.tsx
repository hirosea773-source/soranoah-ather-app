import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { designTokens } from "@/lib/design/tokens";

interface ProcessingCardProps {
  imagesCount: number;
  hasSettings: boolean;
  isProcessing: boolean;
  progress: number;
  processedCount: number;
  hasResults: boolean;
  errorMessage?: string | null;
  onProcess: () => void;
  onCancel: () => void;
  onDownloadZip: () => void;
}

/**
 * Processing Card
 * 処理実行と状態管理のUI
 */
export function ProcessingCard({
  imagesCount,
  hasSettings,
  isProcessing,
  progress,
  processedCount,
  hasResults,
  errorMessage,
  onProcess,
  onCancel,
  onDownloadZip,
}: ProcessingCardProps) {
  const canProcess = imagesCount > 0 && hasSettings && !isProcessing;
  const showDownload = hasResults && processedCount > 1;

  const getStatusInfo = () => {
    if (errorMessage) {
      return {
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        title: "エラー発生",
        description: errorMessage,
        variant: "destructive" as const,
      };
    }

    if (isProcessing) {
      return {
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        title: "処理中...",
        description: `${processedCount}/${imagesCount} 件完了`,
        variant: "secondary" as const,
      };
    }

    if (hasResults) {
      return {
        icon: <CheckCircle className="w-5 h-5" />,
        title: "処理完了",
        description: `${processedCount} 件の画像を処理しました`,
        variant: "default" as const,
      };
    }

    if (!hasSettings) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        title: "設定が必要です",
        description: "リサイズ設定を完了してください",
        variant: "destructive" as const,
      };
    }

    return {
      icon: <Play className="w-5 h-5" />,
      title: "処理準備完了",
      description: `${imagesCount} 件の画像を処理できます`,
      variant: "default" as const,
    };
  };

  const status = getStatusInfo();

  return (
    <Card className={`${designTokens.shadows.card} sticky bottom-4`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.icon}
          画像リサイズ実行
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Display */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
          <Badge variant={status.variant} className="px-3 py-1">
            {status.title}
          </Badge>
          <span className="text-sm text-slate-600">{status.description}</span>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>処理進捗</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onProcess}
            disabled={!canProcess}
            size="lg"
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                処理中...
              </>
            ) : hasResults ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                再実行
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                画像をリサイズ
              </>
            )}
          </Button>

          {isProcessing && (
            <Button
              onClick={onCancel}
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <Pause className="w-4 h-4 mr-2" />
              キャンセル
            </Button>
          )}

          {showDownload && (
            <Button
              onClick={onDownloadZip}
              variant="secondary"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4 mr-2" />
              ZIP保存
            </Button>
          )}
        </div>

        {/* Helper Text */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            {errorMessage
              ? "エラーが発生しました。設定・画像を確認して再実行してください。"
              : isProcessing
                ? "現在処理中です。完了までしばらくお待ちください。"
                : hasResults
                  ? "結果を確認して、必要なら再実行やZIP保存を行ってください。"
                  : "アップロードと設定を完了すると、処理を開始できます。"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
