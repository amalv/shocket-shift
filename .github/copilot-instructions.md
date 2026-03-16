# Socket Shift Copilot Instructions

## Project intent
- This is a small original puzzle game prototype written in TypeScript and built with Vite.
- The project should stay lightweight and scalable: prefer plain TypeScript modules over framework-heavy abstractions unless the UI complexity clearly justifies a framework.

## Architecture rules
- Keep puzzle logic pure and testable under `src/game/`.
- Keep DOM rendering and browser-only behavior under `src/ui/` and `src/audio/`.
- Avoid putting level parsing, game rules, rendering, input, and sound in the same file.
- Prefer immutable updates for game state transitions.

## Testing rules
- Add tests for puzzle logic before adding broad UI tests.
- Use Arrange / Act / Assert structure in tests, with those comments present when helpful.
- Favor small deterministic tests over snapshot-heavy tests.

## UX rules
- Preserve the existing `Socket Shift` visual direction: industrial, electric, compact, and readable.
- Add motion intentionally. Prefer meaningful feedback such as move pulses, goal charge effects, and win emphasis over decorative noise.
- Keep sound effects lightweight and procedural when possible.
- Treat the game feel as part of the product, not as optional polish layered on at the end.

## Workflow rules
- Track work through GitHub issues and prefer one focused pull request per issue.
- PRs should link the relevant issue with `Closes #<issue-number>` when applicable.
- Use Conventional Commit style for commit messages.
- Prefer commit types such as `feat`, `fix`, `docs`, `refactor`, `test`, `style`, and `chore`.
- Use branch names like `feat/<short-name>`, `fix/<short-name>`, `docs/<short-name>`, `chore/<short-name>`, or `refactor/<short-name>`.
- Keep branch names short, lowercase, and hyphenated.
- Keep commits focused so the history stays useful for semantic-release later.

## Coding style
- Use strict TypeScript.
- Prefer small focused modules.
- Default to ASCII in source files unless there is a strong reason not to.
- Do not add React unless stateful UI complexity genuinely demands it.
- Follow the project conventions in `docs/code-guidelines.md`, especially the `function` declarations vs arrow function rule.
- Biome enforces `useArrowFunction` for function expressions; keep declarations and expressions consistent with that rule.
