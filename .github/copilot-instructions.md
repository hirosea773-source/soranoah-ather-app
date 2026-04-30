# Project Rules

## Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Sonner
- Supabase

## Architecture

- app = routing
- components = UI
- features = business logic
- lib = utilities

## UI Rules

- Card based layout
- Mobile first
- Consistent spacing
- Typography hierarchy

## Forbidden

- any type
- inline styles
- pages router
- CSS modules

## Architecture Rules

- Use Feature Driven Architecture
- Keep business logic inside features/\*
- Avoid putting app logic inside page.tsx
- Shared UI goes into components/primitives
- Reusable utilities go into lib/\*
- Prefer composition over duplication

## State Rules

- Use React hooks only
- Avoid unnecessary global state
- Keep state close to feature

## UI Rules

- Use AppCard for sections
- Use PageContainer for layouts
- Use SectionTitle for headings
- Use designTokens for spacing and typography
- Avoid arbitrary Tailwind values

## Review Rules

- Prioritize information hierarchy
- Keep one primary CTA per screen
- State must not rely only on color
- Preserve consistent spacing rhythm

## Forbidden

- any type
- inline style
- giant page.tsx
- duplicated card layouts
- magic numbers

## Required Context

Always read:

- context/architecture.md
- context/ui-rules.md
- context/review-agent.md

before generating code.
