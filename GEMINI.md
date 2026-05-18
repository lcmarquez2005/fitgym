# Gemini AI - Behavioral Instructions

This file serves as a guide for the AI (Gemini CLI) when interacting with the FitGym codebase.

## Golden Rules
- **Consult Context**: Before making any structural changes, read `CONTEXT.md`.
- **Validate Endpoints**: Before implementing new functionality that requires data, consult `API.md`.
- **Tracking**: Update `PROGRESS.md` after every major milestone completed or feature added.
- **Package Manager**: Use ONLY `pnpm`. `npm` is strictly forbidden in this project.

## Workflow for AI
1. **Research**: Analyze existing files related to the task.
2. **Strategy**: Propose the plan to the user (Plan Mode if complex).
3. **Execution**: Apply surgical changes following `CONTEXT.md` conventions.
4. **Validation**: ALWAYS run `pnpm run build` to ensure the project compiles correctly and no errors were introduced. Do not settle for just `tsc --noEmit`.

## Technical Restrictions
- **Extensions**: Only create `.tsx` files for components.
- **Imports**: Use aliases (`@common`, `@layout`, `@pages`, `@services`, `@assets`, `@context`, `@hooks`) whenever possible.
- **Security**: Ensure that private endpoint calls use `getAuthHeaders()`.
- **Notifications**: Always use `toast` from `sonner` for success/error/warning feedback. Do not implement manual alert states in components.
- **Libraries**: Do not install new libraries (like TanStack Query or Zustand) without explicit approval, as stated in `CONTEXT.md`.
