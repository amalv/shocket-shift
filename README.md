# Socket Shift

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Bun](https://img.shields.io/badge/Bun-282A36?style=flat-square&logo=bun&logoColor=white)](https://bun.sh/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat-square)](https://biomejs.dev/)
[![CI](https://github.com/amalv/shocket-shift/actions/workflows/ci.yml/badge.svg)](https://github.com/amalv/shocket-shift/actions/workflows/ci.yml)
[![Release](https://github.com/amalv/shocket-shift/actions/workflows/release.yml/badge.svg)](https://github.com/amalv/shocket-shift/actions/workflows/release.yml)
[![Semantic Release](https://img.shields.io/badge/Semantic_Release-494949?style=flat-square&logo=semanticrelease&logoColor=white)](https://semantic-release.gitbook.io/)

Socket Shift is an original TypeScript puzzle game about guiding a maintenance drone and routing power cells into live sockets. It is intentionally small right now: one handcrafted level, sharp game feel, and a repo set up to scale cleanly instead of collapsing into prototype chaos.

## ✨ Available Now
- A playable browser prototype built with TypeScript and Vite
- A pure puzzle engine separated from DOM rendering and audio adapters
- One handcrafted level focused on readable movement and satisfying interactions
- Procedural sound effects with layered charge-up feedback
- Microinteractions for movement, pushes, socket surges, and power-on effects
- Unit tests with Vitest using Arrange / Act / Assert structure
- Formatting and linting with Biome
- Conventional commits, commitlint, and lefthook quality gates
- Semantic-release configuration with changelog generation
- Issue and pull request templates for a clean GitHub workflow
- GitHub Actions CI and Vercel-ready deployment configuration
- Storybook-backed design-system foundation for current shell components

## 🧭 Project Milestones
### Milestone 01: Playable Prototype
- Single-level gameplay loop
- Stable board rendering
- First-pass visual polish and sound design
- Core unit-test coverage

### Milestone 02: Repository Foundation
- README, roadmap, and public project positioning
- Documented engineering conventions and contribution flow
- Clear showcase of architecture and quality practices

### Milestone 03: Production Pipeline
- Pull request CI for lint, test, and build
- Preview and production deployment
- Release flow aligned with semantic-release

### Milestone 04: Game Growth
- Undo and move history
- Multiple levels and progression
- Better game-state transitions and HUD feedback

### Milestone 05: Delight and Accessibility
- Deeper sound design and visual feedback
- Better onboarding and controls guidance
- Accessibility and input polish

See [ROADMAP.md](./ROADMAP.md) for the longer path to production.

## 🧱 Architecture
The codebase stays intentionally modular:

- `src/game/`: puzzle rules, state transitions, level parsing, and domain types
- `src/ui/`: DOM rendering and board-view effects
- `src/audio/`: procedural sound planning and playback
- `tests/`: focused unit coverage around engine, parsing, board projection, and audio planning

Current architecture goals:
- keep the engine deterministic and easy to test
- keep UI and audio as adapters around the game state
- favor small modules over oversized files
- lean functional without adding unnecessary abstraction

## 🛠️ Engineering Practices
This repository is meant to showcase both the game and the way it is built.

- `Biome` owns formatting and linting
- `Vitest` covers the most important puzzle and presentation helpers
- `Playwright` covers the shipped browser game flow end to end
- `lefthook` runs checks before commits
- `commitlint` enforces Conventional Commits
- `semantic-release` is configured to generate releases and update `CHANGELOG.md`
- Work is tracked through issues, focused branches, and linked pull requests
- The code style leans arrow-first for module helpers and exported factories
- GitHub Actions validates pull requests with `bun run verify` plus Playwright e2e coverage

Useful docs:
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [docs/code-guidelines.md](./docs/code-guidelines.md)
- [docs/deployment.md](./docs/deployment.md)
- [docs/design-system.md](./docs/design-system.md)
- [CHANGELOG.md](./CHANGELOG.md)

## 🚀 Quick Start
### Requirements
- Bun
- Node.js

### Run locally
```bash
bun install
bun run dev
```

### Quality checks
```bash
bun run verify
bun run test:e2e
bun run build-storybook
```

Install the Playwright browser once before the first e2e run:

```bash
bun run test:e2e:install
```

## ☁️ Deployment
Vercel is the primary hosting target.

The repository includes:
- GitHub Actions CI for `lint`, `test`, and `build`
- Playwright browser installation and e2e coverage in GitHub Actions
- `vercel.json` with explicit Vite + Bun deployment settings
- automatic Vercel preview deployments through GitHub integration
- deployment notes in [docs/deployment.md](./docs/deployment.md)

Preview and production deployments are handled through Vercel's GitHub integration. The remaining setup is project import and any future custom domain configuration.

## 🧪 Current Toolchain
- TypeScript
- Vite
- Bun
- Vitest
- Playwright
- Biome
- GitHub Actions
- Vercel
- Storybook
- commitlint
- lefthook
- semantic-release

## 🎯 Current Product Direction
Socket Shift is heading toward a production-ready web game in small, reviewable steps. The near-term focus is to strengthen the public-facing docs, add CI and deployment, and then continue expanding the game with progression, undo, and richer polish.

## 🤝 Workflow
- Track work through GitHub issues
- Create one focused branch per issue
- Open one focused pull request per branch
- Use Conventional Commits so semantic-release can do its job

That workflow is documented in more detail in [CONTRIBUTING.md](./CONTRIBUTING.md).
