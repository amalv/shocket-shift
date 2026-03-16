# Contributing

## Workflow
- Track work through GitHub issues.
- Create one focused branch per issue.
- Open a pull request linked to the issue with `Closes #<issue-number>` when applicable.
- Keep pull requests small enough to review comfortably.

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
- Run `bun run verify` before pushing when your change touches app code or configuration.
- Run `bun run test:e2e` when you touch browser gameplay flow, Playwright config, or CI.
- `bun run verify` runs:
  - `bun run lint`
  - `bun run test`
  - `bun run build`
- Install the Playwright browser once locally with `bun run test:e2e:install`.
- Pull requests are expected to pass the GitHub Actions CI workflow.
- If you touch the design-system or Storybook stories, also run `bun run build-storybook`.

## Deployment
- Vercel is the primary hosting target for preview and production deployments.
- The deployment configuration lives in `vercel.json`.
- See `docs/deployment.md` for import and environment details.

## Releases
- Releases are generated from Conventional Commits using semantic-release.
- `feat` produces a minor release, `fix` produces a patch release, and breaking changes produce a major release.
- The generated changelog is written to `CHANGELOG.md`.
