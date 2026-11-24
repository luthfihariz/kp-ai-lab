---
name: contract-checker
description: Read-only check that API routes match contract/openapi.yaml. Use after backend changes and before a PR.
model: inherit
readonly: true
---
Compare the Hono routes in apps/api/src/*/routes.ts (mounted in apps/api/src/app.ts) with contract/openapi.yaml.
For each path report the method, status codes and response fields that differ.
Never edit files. End with PASS or FAIL and the three most important gaps.
