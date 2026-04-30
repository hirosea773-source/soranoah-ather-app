type Props = {
  title: string;
  description?: string;
};

import { designTokens } from "@/lib/design/tokens";

/**
 * セクションタイトル
 */
export function SectionTitle({ title, description }: Props) {
  return (
    <div className="space-y-1">
      <h2 className={designTokens.typography.sectionTitle}>{title}</h2>

      {description && (
        <p className={designTokens.typography.description}>{description}</p>
      )}
    </div>
  );
}
