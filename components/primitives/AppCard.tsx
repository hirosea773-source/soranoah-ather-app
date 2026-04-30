import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { designTokens } from "@/lib/design/tokens";

/**
 * アプリ共通カード
 */
type Props = {
  title: string;
  children: ReactNode;
  "data-testid"?: string;
};

export function AppCard({ title, children, "data-testid": testId }: Props) {
  return (
    <Card
      className={`
        ${designTokens.radius.cardRadius}
        ${designTokens.shadows.card}
      `}
      data-testid={testId}
    >
      <CardHeader>
        <CardTitle className={designTokens.typography.sectionTitle}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className={designTokens.spacing.cardGap}>
        {children}
      </CardContent>
    </Card>
  );
}
