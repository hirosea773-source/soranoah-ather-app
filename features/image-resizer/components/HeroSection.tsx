import { Button } from "@/components/ui/button";
import { designTokens } from "@/lib/design/tokens";

/**
 * Hero Section
 * アプリの価値を一瞬で伝える
 */
export function HeroSection() {
  return (
    <div className="text-center py-16 px-4">
      {/* Small Label */}
      <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 mb-6">
        <span className="mr-2">✨</span>
        無料の画像リサイズツール
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
        画像を一括で
        <span className="text-blue-600">リサイズ</span>
        <br />
        時間を節約
      </h1>

      {/* Description */}
      <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
        複数の画像を高速でリサイズ・形式変換。ドラッグ＆ドロップで簡単操作。
        ZIPダウンロード対応で、プロフェッショナルなワークフローを実現します。
      </p>

      {/* Primary CTA */}
      <Button
        size="lg"
        className="text-lg px-8 py-4 h-auto mb-4"
        onClick={() => {
          document
            .getElementById("upload-area")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        今すぐ始める
      </Button>

      {/* Support Text */}
      <p className="text-sm text-slate-500">
        アップロードは完全にプライベート・安全です
      </p>
    </div>
  );
}
