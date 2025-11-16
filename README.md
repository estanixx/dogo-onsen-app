# Dogo Onsen App

Small Next.js (App Router) project that demonstrates UI for rooms, services, reservations, and shared components.

## Quick start

Install and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Clerk authentication

The employee panel now relies on Clerk for authentication/authorization. Configure the following environment variables in `.env.local` before running the app:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/employee
CLERK_AFTER_SIGN_UP_URL=/employee
NEXT_PUBLIC_BACKEND_URL=http://localhost:8004
```

Set `publicMetadata` for each Clerk user to control in-app access:

- `role`: one of `reception`, `banquet`, `inventory`, `services`, `admin` (defaults to `reception`).
- `accessStatus`: `approved`, `pending`, or `revoked` (defaults to `pending`).

Newly registered employees remain in `pending` until an admin flips `accessStatus` to `approved` inside Clerk. Users with `revoked` status are signed in but blocked from the `/employee` routes until reinstated.

The frontend proxies employee CRUD traffic through Next.js API routes located under `app/api/employees/*`, which forward requests to the FastAPI service exposed at `NEXT_PUBLIC_BACKEND_URL`.

## Folder structure

High-level overview of the main folders and their responsibilities:

- `app/` – Next.js App Router routes and server/client pages. Routes (for example `app/room/[id]/services/page.tsx`) are the entry points for pages.
- `components/` – Reusable UI components. Subfolders group components by feature area (e.g. `room/`, `employee/`, `ui/`). Use `ui/` for primitive building blocks (Input, Button, Card) and feature folders for composed components.
- `lib/` – Shared utilities, types, and small API stubs (`lib/api`, `lib/utils`, `lib/types`). Server-side helpers and light business logic live here.
- `public/` – Static assets (images, svgs) served directly by Next.js.
- `styles/` or `app/globals.css` – Global styles and CSS variables (this project keeps global CSS in `app/globals.css`).
- `components/room/service/` – Example feature area with `service-card.tsx`, `service-search.tsx` (client), etc.

If you add a new feature area, create a folder under `components/` and keep atoms/primitives in `components/ui/`.

## Clean code & conventions

Follow these rules to keep the codebase consistent and maintainable:

1. Use English and `camelCase` for variable, function, and prop names.
2. Prefer small, focused components (one responsibility). Move shared logic to `lib/` or custom hooks.
3. Keep presentational components pure and prefer Server Components when they don't require browser APIs. Add `"use client"` only when you need interactivity or hooks that require the browser (event handlers, local state, router navigation).
4. Export components as named exports where practical (easier to refactor and test). Use `index.ts` barrels sparingly and only for public surface area.
5. Types: keep TypeScript interfaces in `lib/types.ts`, and import them across components for consistency.
6. Accessibility: use semantic elements, provide alt text for images, ensure interactive elements are keyboard accessible (role, tabIndex, onKeyDown handlers or native buttons/links).
7. Styling: prefer CSS variables from `app/globals.css` (e.g. `--primary`, `--gold`) and Tailwind utility classes for layout. Keep visual tokens centralized.
8. Tests & edge cases: validate empty states, error states, and loading states. Handle null/undefined data defensively.

## Formatting & linting

- Prettier is recommended as the formatter (see VS Code settings). Configure project-wide rules using a `.prettierrc` if you want stable team defaults.
- ESLint is configured in the project — run `npm run lint`.

Prettier is configured in the project via `.prettierrc`. Use these npm scripts:

- `npm run format` — format all source files with Prettier
- `npm run format:check` — check for files that are not formatted

If you use VS Code, enable format-on-save and set Prettier as your default formatter (the repository includes an `.editorconfig` and a recommended VS Code user setting snippet in the README earlier).

## Useful scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm start` — start production server
- `npm run lint` — run linting

## Adding a new component

1. Add the component to `components/<feature>/` or `components/ui/` depending on whether it's a primitive.
2. Add types to `lib/types.ts` when they are shared across features.
3. If the component needs browser APIs, add `"use client"` at the top and keep the component focused on interactivity only.
4. Add small Storybook story or a test page where useful.
