# Contributing

## Branch naming
- Use `feat/<short-name>` for features.
- Use `fix/<short-name>` for bug fixes.
- Use `docs/<short-name>` for documentation work.
- Use `chore/<short-name>` for tooling, config, or maintenance.
- Use `refactor/<short-name>` for internal restructuring without user-facing behavior changes.
- Keep names short, lowercase, and hyphenated.

Examples:
- `feat/socket-pulse-vfx`
- `fix/push-collision`
- `docs/release-process`

## Commit messages
- Use Conventional Commit style so the history stays compatible with semantic-release later.
- Format: `<type>: <short summary>`

Common types:
- `feat`: new user-facing functionality
- `fix`: bug fixes
- `docs`: docs-only changes
- `refactor`: internal restructuring without behavior changes
- `test`: test additions or updates
- `chore`: tooling, repo setup, or maintenance
- `style`: formatting-only changes

Examples:
- `feat: add goal surge particles`
- `fix: prevent board flicker on movement`
- `docs: add branch and commit conventions`

## Quality bar
- Run `bun run lint`
- Run `bun run test`
- Run `bun run build`
