---
name: endpoint-from-contract
description: Implement one backend endpoint exactly as defined in contract/openapi.yaml.
disable-model-invocation: true
---
The user gives a method and path after the command.
1. Read that path in contract/openapi.yaml: request, responses, error codes, examples.
2. Read the PRD files in docs/prd/ that the path mentions.
3. Write Vitest table tests first (it.each, like apps/api/src/tests/money.test.ts), using the contract examples as cases.
4. Implement the logic in apps/api/src/<feature>/index.ts and the route in apps/api/src/<feature>/routes.ts; mount it in apps/api/src/app.ts.
5. Run pnpm --filter @kp/api test. If a test fails, stop and explain; don't change the tests to make them pass.
