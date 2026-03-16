# Socket Shift Copilot Instructions

## Project intent
- This is a small puzzle game prototype written in TypeScript and built with Vite.
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

## Coding style
- Use strict TypeScript.
- Prefer small focused modules.
- Default to ASCII in source files unless there is a strong reason not to.
- Do not add React unless stateful UI complexity genuinely demands it.
- Follow the project conventions in `docs/code-guidelines.md`, especially the `function` declarations vs arrow function rule.
