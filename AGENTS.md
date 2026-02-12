# AGENTS.md - Komikindo Project Guidelines

## Project Overview

This is a **Nuxt 4** application - a manga reading site built with Vue 3, TypeScript, Tailwind CSS, and Pinia for state management. The project uses custom UI components (prefixed with `U`) and follows Nuxt 4 conventions.

## Build, Lint, and Test Commands

### Core Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server on http://localhost:3000
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Run ESLint on entire codebase
pnpm lint

# Run TypeScript type checking
pnpm typecheck

# Generate Nuxt types and prepare project
pnpm postinstall
```

### CI/CD Pipeline

The project runs `pnpm lint` and `pnpm typecheck` on every push via GitHub Actions (see `.github/workflows/ci.yml`).

### Package Manager

- **pnpm** is required (version 10.28.2 specified in package.json)
- Always use `pnpm` instead of npm/yarn

## Code Style Guidelines

### General Conventions

- **EditorConfig** is enforced with 2-space indentation, LF line endings, UTF-8 charset
- No trailing commas (ESLint: `commaDangle: 'never'`)
- 1TBS brace style (ESLint: `braceStyle: '1tbs'`)
- Trim trailing whitespace, insert final newline

### TypeScript

- Use **TypeScript** for all new code
- Enable strict type checking via Nuxt's TypeScript integration
- Use proper type annotations for props, function parameters, and return types
- Prefer interfaces over type aliases for object types
- Use `import type` for type-only imports

### Vue Components

- Use **`<script setup lang="ts">`** syntax for all Vue components
- Components are auto-imported by Nuxt - do not manually import components from `~/components`
- Use Nuxt composables (`useHead`, `useRoute`, `useRouter`, `navigateTo`, etc.) for common functionality
- Follow Nuxt 3/4 conventions for file-based routing in `~/pages`
- Use custom UI components (prefixed with `U` like `UButton`, `UContainer`, `UBadge`, `UIcon`)

### Imports and Auto-imports

- **Nuxt auto-imports**: Composables, components, and utilities are auto-imported
- Do not manually import from `vue`, `nuxt`, or `@nuxt/*` unless explicitly required
- Explicitly import third-party libraries when needed (e.g., `pinia`, `h3` event handlers)
- Use `~/` alias for app imports (e.g., `~/components`, `~/pages`, `~/assets`, `~/composables`, `~/stores`)

### Naming Conventions

- **Components**: PascalCase (e.g., `AppLogo`, `MangaCard`, `TemplateMenu`)
- **Files**: kebab-case for pages/routes, PascalCase for components
- **Composables**: camelCase starting with `use` (e.g., `useMangaApi`, `useHistory`, `useBookmarks`)
- **Stores**: camelCase starting with `use` (e.g., `useSearchStore`)
- **Variables**: camelCase (e.g., `isVisible`, `userName`, `mangaList`)
- **Constants**: SCREAMING_SNAKE_CASE for global constants, camelCase otherwise
- **CSS classes**: kebab-case for custom classes, use Tailwind utilities primarily

### Formatting and Layout

- **Indentation**: 2 spaces (not tabs)
- **Line length**: Soft wrap at reasonable length; use proper line breaks for readability
- **Template attributes**: One per line for complex components; group related props
- **Component props**: Use Vue's `defineProps`/`defineEmits` with TypeScript interfaces

### Error Handling

- Use `try/catch` for async operations with proper error logging
- Let errors bubble up to appropriate handlers
- Use H3's `createError` for route-level and API errors (imported from 'h3')
- Validate inputs early with TypeScript types
- Store error state in refs (`error.value = e as Error`)

### CSS and Styling

- Use **Tailwind CSS** utility classes as the primary styling approach
- Follow Tailwind's responsive design conventions (mobile-first)
- Use custom design tokens via CSS variables in `main.css` (e.g., `--header-height`)
- Use `navy` color palette (navy-50 to navy-950) defined in `tailwind.config.ts`
- Use `amber-500` for accent colors
- Prefer Tailwind classes over custom CSS unless necessary
- Use `.glass` class for glassmorphism effect, `.hide-scrollbar` for hidden scrollbars

### Custom UI Components

- All `U*` components are custom and located in `~/components/`
- Common components: `UButton`, `UContainer`, `UBadge`, `UIcon`, `UInput`, `UModal`, `USlideover`, `UCheckbox`
- Icons use `i-lucide-*` format for Lucide icons (configured via `@iconify/vue`)
- Component variants are defined in prop interfaces (e.g., `variant?: 'solid' | 'outline' | 'ghost'`)

### State Management with Pinia

- Use Pinia stores defined in `~/stores/` (e.g., `search.ts`)
- Define stores using `defineStore` with Composition API style (`() => {}`)
- Use `ref` for state, `computed` for getters, and regular functions for actions
- Import types from composables using `import type { ... } from '~/composables/...'`

### API and Server Routes

- Server routes are in `~/server/api/`
- Use H3's `defineEventHandler`, `getQuery`, `createError` for handling requests
- Use `$fetch` for client-side API calls with proper typing
- Handle gzip responses with `gunzip` from Node.js `zlib` module

### File Structure

```
app/
├── assets/
│   └── css/main.css      # Global CSS, custom animations, design tokens
├── components/           # Auto-imported Vue components (U*, App*, etc.)
│   ├── layout/           # Layout components
│   └── [custom components]
├── composables/          # Auto-imported composables (use*)
├── pages/                # File-based routing
├── stores/               # Pinia stores (use*Store)
└── app.vue               # Root application component

server/
└── api/                  # Server API routes
```

### Working with This Repository

1. **Always use pnpm** for dependency management
2. **Run `pnpm lint` before committing** to catch style issues
3. **Run `pnpm typecheck`** to ensure type safety
4. **Do not commit generated files** in `.nuxt/` directory
5. **Follow existing patterns** when adding new components/pages/composables/stores

### Important Notes

- No test framework is currently configured; do not add tests without consulting the team
- The project uses **Nuxt 4** which has different conventions from Nuxt 3
- All dependencies are managed via `package.json` - do not modify `pnpm-lock.yaml` manually
- The project fetches manga data from `https://kmkindo.click` via server API proxy

