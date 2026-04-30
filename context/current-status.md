# 現在のプロジェクト状況まとめ（VSCode Agent引き継ぎ用）

## プロジェクト概要

Next.js 16 + TypeScript + Tailwind + shadcn/ui 構成で、
「iLoveIMG風の画像リサイズWebアプリ」を構築中。

重要方針：

- 完全クライアントサイド処理
- Canvas API利用
- Web Workerによる非同期画像処理
- JSZipでZIPダウンロード
- Feature Architecture
- AI Agent開発最適化
- UIレビュー自動化

---

# 現在の環境

## 使用技術

- Next.js 16 App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Sonner
- Playwright
- JSZip

---

# 完了済み作業

## 1. Supabase接続整理

実施内容：

- lib/supabase.ts を整理
- 重複定義解消
- health route確認
- .env.local はGit管理対象外

確認済み：

- `/api/health` が `{ status: "ok" }` を返す

---

## 2. Feature Architecture整理

現在方針：

- app = routing only
- components = 共通UI
- features = 機能単位
- lib = 共通ロジック
- context = AI Agent context

---

## 3. デザインシステム導入

既存ファイル：

- `lib/design/tokens.ts`

内容：

- spacing
- typography
- colors
- radius
- shadows
- grid

今後：

- arbitrary class禁止
- spacing統一
- primitives優先

---

## 4. AI Agent構成導入

追加済み：

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `context/`

目的：

- AI役割分離
- Builder / Review / Refactor / Architect
- Context Engineering

---

# AGENTS.md の役割

Builder:

- 実装専用
- primitives再利用
- any禁止

Review:

- 情報設計レビュー
- 100点評価
- Top3問題抽出

Refactor:

- 責務分離
- 挙動維持

Architect:

- Feature boundary設計
- scalable structure

---

# Context構成

現在方針：

context/
├── architecture.md
├── current-status.md
├── ui-rules.md
├── review-agent.md
└── prompts/

---

# Prompt Templates導入

追加済み：

- builder.md
- reviewer.md
- refactor.md
- architect.md

目的：

- AI役割固定
- Prompt品質安定
- Context Routing

---

# 画像リサイズアプリ進捗

完了済み：

- Drag & Drop UI
- Resize Options
- Worker構成
- ZIP Export
- Sonner化
- Before/After UI
- サムネイル表示
- 再処理可能構成
- UI情報設計改善 ✅
- primitives整理 ✅
- Card hierarchy改善 ✅
- spacing最適化 ✅
- CTA明確化 ✅
- Playwrightテスト修正 ✅

---

# UI設計方針（重要）

UIレビュー基準：

- 情報優先順位
- 階層
- グルーピング
- 余白
- CTA
- 状態表現
- 一貫性
- Accessibility

禁止：

- aestheticだけの改善
- border依存
- arbitrary spacing

---

# Sonner構成

方針：

- toast 廃止
- sonnerへ統一
- toast.promise使用
- 非同期状態自動管理

---

# Playwright導入済み

インストール済み：

- @playwright/test

追加済み：

- tests/home.spec.ts
- playwright.config.ts

目的：

- UIスクショ取得
- E2E
- Visual Regression基盤

---

# Playwright現在状況

問題：

- getByText("画像リサイズ") が見つからない

原因：

- UI実際の文言不一致

対応方針：

- 一旦 expect を消して screenshot のみ取得
- 今後は data-testid ベースへ移行

推奨：

- getByRole
- getByTestId

禁止：

- fragile text matching

---

# Playwright方針

最終目標：

実装
↓
Playwright screenshot
↓
AI Review
↓
Fix
↓
CI

---

# GitHub Actions予定

予定ファイル：

- `.github/workflows/ui-review.yml`

目的：

- PR時自動UIテスト
- Playwright実行
- 将来的にAIレビュー連携

---

# 今後の最優先タスク

## 最優先

- UI情報設計改善
- primitives整理
- Card hierarchy改善
- spacing最適化
- CTA明確化

---

## 次段階

- Visual Regression Test
- Review Automation
- Multi-Agent Workflow
- MCP連携
- AI PR Review

---

# Agentへの重要指示

## Builder時

必須：

- existing primitives reuse
- designTokens使用
- Feature Architecture維持
- any禁止
- page.tsx肥大化禁止

禁止：

- 新規デザインシステム乱立
- inline styles
- 巨大コンポーネント

---

## Review時

評価対象：

- 情報設計のみ
- hierarchy
- CTA
- grouping
- accessibility

禁止：

- aesthetic好み評価
- 勝手な実装

---

## Refactor時

必須：

- behavior preservation
- 責務分離
- 重複削除

禁止：

- UI変更
- state仕様変更
- 機能追加

---

# 次回やりたいこと

- UIを「公開可能レベル」まで改善
- Feature/UI boundary整理
- Visual Regression導入
- Playwright screenshot compare
- AIレビュー自動化
- MCP連携準備
