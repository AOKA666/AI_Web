# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router entrypoints (e.g., `app/layout.tsx`, `app/page.tsx`) and global styles (`app/globals.css`).
- `components/`: Shared React components; `components/ui/` contains shadcn/ui primitives.
- `hooks/`: Reusable React hooks (naming pattern: `use-*.ts` / `use-*.tsx`).
- `lib/`: Shared utilities (e.g., `lib/utils.ts`). Path alias `@/*` is defined in `tsconfig.json`.
- `public/`: Static assets (icons, images) served from the site root.
- `styles/`: Additional styling assets (when applicable).

## Build, Test, and Development Commands
This repo uses `pnpm` (see `pnpm-lock.yaml`):
- `pnpm install`: Install dependencies.
- `pnpm dev`: Start the local dev server (Next.js).
- `pnpm build`: Create a production build.
- `pnpm start`: Run the production server from the build output.
- `pnpm lint`: Run ESLint over the repository.

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js App Router).
- Indentation: 2 spaces; keep formatting consistent with nearby files.
- Components: PascalCase exports (e.g., `ThemeProvider`) and kebab-case filenames for multiword components (e.g., `components/image-comparison-carousel.tsx`).
- Hooks: `useX` naming and `hooks/use-*.ts(x)` placement.
- Imports: prefer aliases like `@/components/...` and `@/lib/...` over relative traversals.
- Styling: Tailwind CSS utility classes are the default; keep class lists readable and avoid duplicate utilities (use `cn(...)` from `lib/utils.ts` when composing).

## Testing Guidelines
- No test runner is configured in this repo yet (no `test` script).
- If you add tests, prefer `*.test.ts` / `*.test.tsx` and introduce a single runner (Vitest or Jest) plus a `pnpm test` script.
- Keep tests focused on behavior (user-visible UI logic, utilities in `lib/`, and critical hooks).

## Commit & Pull Request Guidelines
- Git history may not be available in all checkouts; default to Conventional Commits:
  - Examples: `feat: add upload validation`, `fix: handle webp previews`.
- PRs should include: a clear description, linked issue (if any), screenshots for UI changes, and manual test steps (e.g., `upload PNG -> select age -> download`).

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local` for local development.
- When adding new environment variables, include an `.env.example` and document expected values and safe defaults.
