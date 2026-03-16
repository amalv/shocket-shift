# Deployment

## Hosting target
Socket Shift uses Vercel as the first hosting platform.

Why Vercel:
- preview deployments map cleanly to the issue and pull-request workflow
- production deployment from `main` is simple to reason about
- the current Vite app fits Vercel's static deployment model well

## Repository configuration
The repository includes `vercel.json` with explicit project settings:
- framework: `vite`
- install command: `bun install --frozen-lockfile`
- build command: `bun run build`
- output directory: `dist`

## Authentication and linking
The recommended flow is the Vercel dashboard with GitHub integration.

Typical setup:
1. Import `amalv/shocket-shift` into Vercel.
2. Confirm the project uses the checked-in `vercel.json` settings.
3. Set the production branch to `main`.
4. Enable preview deployments for pull requests.

Notes:
- preview URLs are created automatically by Vercel for pull requests and branch pushes once the repo is connected
- no Vercel credentials, tokens, or local metadata should be committed to the repository
- `.vercel/` is ignored for local project metadata
- `vercel login` is optional and only needed if you want to manage the project from the CLI locally

## Environment variables
No runtime environment variables are required at the moment.

## Notes
- The app is currently a single-page static game at the root path, so no custom rewrite rules are needed.
- GitHub Actions validates `lint`, `test`, `build`, and Playwright e2e coverage before changes land on `main`.
- Semantic-release remains responsible for versioning and changelog generation on the GitHub side.
