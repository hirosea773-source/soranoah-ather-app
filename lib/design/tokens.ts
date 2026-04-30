// Design System Tokens
// デザインシステムの定数化でUI崩壊を防止

export const designTokens = {
  layout: {
    container: "max-w-6xl mx-auto px-4 py-10",
  },

  spacing: {
    sectionGap: "space-y-10",
    cardGap: "space-y-4",
    itemGap: "gap-2",
  },

  typography: {
    pageTitle: "text-3xl font-bold tracking-tight",
    sectionTitle: "text-xl font-semibold",
    description: "text-sm text-muted-foreground",
  },

  colors: {
    surface: "bg-white",
    background: "bg-slate-50",
    primary: "bg-blue-600",
    success: "text-green-600",
    destructive: "text-red-500",
  },

  radius: {
    cardRadius: "rounded-xl",
    buttonRadius: "rounded-lg",
    full: "rounded-full",
  },

  shadows: {
    card: "shadow-sm",
    elevated: "shadow-md",
  },

  grid: {
    imageGrid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
  },

  animations: {
    loading: "animate-pulse",
  },
} as const;
