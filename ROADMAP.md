# Roadmap

This roadmap keeps Socket Shift moving from a tight prototype to a production-ready web game without losing the clarity of the codebase.

## 🟢 Milestone 01: Playable Prototype
Status: complete

Goals:
- Establish the core puzzle loop
- Ship one handcrafted level
- Prove the visual and audio direction
- Lock down the first layer of tests and repository conventions

Delivered:
- Pure puzzle engine in `src/game/`
- DOM renderer in `src/ui/`
- Procedural audio in `src/audio/`
- Unit tests with Vitest
- Biome, commitlint, lefthook, and semantic-release setup

## 🟡 Milestone 02: Repository Foundation
Status: complete

Goals:
- Add a polished README that explains the game and the engineering approach
- Add a roadmap that makes the production path legible
- Make the repository look intentional to contributors and reviewers

Delivered:
- `README.md`
- `ROADMAP.md`
- Better public-facing project positioning

## 🟠 Milestone 03: Production Pipeline
Status: complete

Goals:
- Add pull request CI for `lint`, `test`, and `build`
- Add preview and production deployment
- Make release automation part of the normal branch-to-main flow

Delivered:
- GitHub Actions workflow for validation
- Vercel configuration for preview and production deployments
- Shared `bun run verify` command for local and CI validation
- Semantic-release flow verified on `main`

## 🔵 Milestone 04: Core Game Growth
Status: planned

Goals:
- Add undo and move history
- Add more levels and simple progression
- Establish the first Storybook-backed design-system layer
- Improve win/reset flow and in-game status feedback

Deliverables:
- Undo support
- Level registry and progression system
- Better state transitions around reset and completion
- Documented shell components and design tokens

## 🟣 Milestone 05: Delight and Accessibility
Status: planned

Goals:
- Deepen the feel of motion and sound
- Improve onboarding clarity and input discoverability
- Strengthen accessibility and readability

Deliverables:
- More polished sound layering and visual cues
- Better instructional UI
- Accessibility pass for contrast, motion sensitivity, and controls

## 🔴 Milestone 06: Production Readiness
Status: planned

Goals:
- Make the project dependable to deploy and maintain
- Ensure the repository communicates quality clearly
- Prepare the game for public sharing

Deliverables:
- Stable deployment flow
- Verified release notes and changelog output
- Final pass on documentation, testing, and presentation

## 📌 Guiding Principles
- Keep the engine deterministic and easy to test
- Prefer small, focused pull requests tied to issues
- Favor clarity over unnecessary framework or abstraction overhead
- Treat game feel and engineering quality as equally important parts of the product
