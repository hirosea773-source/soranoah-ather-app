import { ReactNode } from "react";
import { designTokens } from "@/lib/design/tokens";

/**
 * ページ全体の共通コンテナ
 */
type Props = {
  children: ReactNode;
};

export function PageContainer({ children }: Props) {
  return (
    <main
      className={`
        ${designTokens.layout.container}
        ${designTokens.spacing.sectionGap}
      `}
    >
      {children}
    </main>
  );
}
