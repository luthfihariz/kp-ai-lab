---
name: ci-pipeline
description: Write or change the CI pipeline for this repo. Use when asked about CI, a pipeline, GitHub Actions or a build workflow.
---
1. Read the scripts in package.json and apps/*/package.json. Every job runs a script that exists; never invent a command.
2. Copy assets/ci-template.yml to the CI path for our tool.
3. Order: install with the pinned pnpm version, typecheck, unit tests, then Playwright with a Postgres service.
4. Secrets come from the CI secret store by name. Never write a secret value, never echo one.
5. Least permissions: read-only by default; pin action versions.
6. List what you couldn't verify locally.
