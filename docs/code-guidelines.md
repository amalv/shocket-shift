# Code Guidelines

## Purpose
- Keep the codebase small, readable, and scalable as the prototype grows into a larger puzzle game.
- Use Biome-style defaults for formatting and linting, with a few project-specific rules where consistency matters.

## Formatting and linting
- Let Biome own formatting. Do not hand-tune whitespace or import ordering.
- Use 2-space indentation, double quotes, semicolons, and trailing commas where valid.
- Keep lines reasonably compact. Prefer clarity over squeezing expressions into one line.

## File and module structure
- Keep pure game rules in `src/game/`.
- Keep DOM rendering in `src/ui/`.
- Keep browser-only APIs such as audio in `src/audio/`.
- Use small focused modules. If a file starts owning multiple concerns, split it.
- Use `kebab-case` for file names and `camelCase` for functions and variables.
- Use `PascalCase` for types, interfaces, and factory return types when needed.

## TypeScript rules
- Keep strict typing on.
- Model domain concepts explicitly with types instead of relying on loose objects.
- Prefer narrow unions for state and events when the domain is small and known.
- Avoid `any`. If something is genuinely unknown, use `unknown` and narrow it.

## Functions
- Prefer `const` + arrow functions for exported factories, module-level helpers, and local utilities.
- Use `function` declarations only when hoisting or recursion makes the code clearly better.
- Biome enforces `useArrowFunction` for function expressions, not declarations, so this broader arrow-first style is a project convention we apply intentionally.
- Keep returned object APIs simple, and prefer `const render = () => {}` plus `return { render }` over mixing declaration styles inside the same module.

## State and architecture
- Keep the puzzle engine pure and deterministic.
- Prefer immutable state transitions for game logic.
- Keep rendering as an adapter over state, not the source of truth.
- Add browser features like sound, animation triggers, and persistence around the core engine rather than inside it.
- Lean functional without overcomplicating things:
- Prefer pure helpers, explicit inputs and outputs, and small data transforms.
- Avoid introducing heavy reducer stacks, monads, or abstraction layers unless the complexity is clearly paying for itself.
- A little shared mutable state at the app boundary is acceptable when it keeps the code simpler.

## Tests
- Write tests for game rules before UI behavior when possible.
- Use Arrange / Act / Assert structure.
- Keep each test focused on one behavior.
- Prefer deterministic inputs over broad snapshot tests.

## Comments
- Comment intent, tradeoffs, or non-obvious constraints.
- Do not add comments that only restate the code.

## Characters and assets
- Default to ASCII in source files unless non-ASCII is clearly justified.
- Prefer procedural effects and lightweight assets in the prototype stage.
