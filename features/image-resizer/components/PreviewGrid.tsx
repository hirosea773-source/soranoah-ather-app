import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, Clock } from "lucide-react";
import { designTokens } from "@/lib/design/tokens";
import { ImageItem } from "@/components/ImageGrid";

interface PreviewGridProps {
  images: ImageItem[];
  onReorder: (from: number, to: number) => void;
  processedResults?: Blob[];
  onImageClick?: (url: string) => void;
}

/**
 * Preview Grid
 * 画像カードのグリッド表示
 */
export function PreviewGrid({
  images,
  onReorder,
  processedResults,
  onImageClick,
}: PreviewGridProps) {
  if (images.length === 0) {
    return (
      <Card className={designTokens.shadows.card}>
        <CardContent className="p-8 text-center">
          <div className="text-slate-400 mb-4">
            <Eye className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            画像がありません
          </h3>
          <p className="text-slate-600">
            上のアップロードエリアから画像を追加してください
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <Card
          key={image.id}
          className="group hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            {/* Thumbnail */}
            <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden">
              <img
                src={image.previewUrl}
                alt={image.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Filename */}
            <h4 className="font-medium text-sm text-slate-900 mb-2 truncate">
              {image.name}
            </h4>

            {/* Metadata */}
            <div className="space-y-1 text-xs text-slate-600 mb-3">
              <div>
                サイズ: {image.width} × {image.height}px
              </div>
              <div>容量: {(image.size / 1024 / 1024).toFixed(1)}MB</div>
            </div>

            {/* Status Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge
                variant={processedResults ? "default" : "secondary"}
                className="text-xs"
              >
                {processedResults ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    完了
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    未処理
                  </>
                )}
              </Badge>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onImageClick?.(image.previewUrl)}
                className="h-8 px-2"
                aria-label={`${image.name} をプレビュー`}
              >
                <Eye className="w-4 h-4" />
                <span className="ml-1">プレビュー</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
