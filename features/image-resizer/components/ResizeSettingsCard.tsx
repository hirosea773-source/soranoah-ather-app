import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { designTokens } from "@/lib/design/tokens";
import { ResizeOptions, ResizeSettings } from "@/components/ResizeOptions";

interface ResizeSettingsCardProps {
  onChange: (settings: ResizeSettings) => void;
  originalWidth: number;
  originalHeight: number;
}

/**
 * Resize Settings Card
 * グループ化された設定UI
 */
export function ResizeSettingsCard({
  onChange,
  originalWidth,
  originalHeight,
}: ResizeSettingsCardProps) {
  return (
    <Card className={designTokens.shadows.card}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>⚙️</span>
          リサイズ設定
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          出力サイズと処理オプションを設定してください
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Badge variant="secondary">1</Badge>
            <div>
              <h4 className="font-medium">リサイズモード</h4>
              <p className="text-sm text-muted-foreground">
                ピクセル指定とパーセンテージ指定を選択できます。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge variant="secondary">2</Badge>
            <div>
              <h4 className="font-medium">出力</h4>
              <p className="text-sm text-muted-foreground">
                ファイル形式、品質、サイズをまとめて設定します。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge variant="secondary">3</Badge>
            <div>
              <h4 className="font-medium">処理ルール</h4>
              <p className="text-sm text-muted-foreground">
                縦横比やアップスケール制限をここで管理します。
              </p>
            </div>
          </div>
        </div>

        <ResizeOptions
          onChange={onChange}
          originalWidth={originalWidth}
          originalHeight={originalHeight}
        />
      </CardContent>
    </Card>
  );
}
