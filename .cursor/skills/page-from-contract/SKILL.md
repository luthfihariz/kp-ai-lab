---
name: page-from-contract
description: Build one page from a contract path, and its design notes when there are any.
disable-model-invocation: true
---
The user gives a contract path after the command, and optionally a design file.
1. Read the path in contract/openapi.yaml and its response schema and examples.
2. If a design file is given, read it and the mockups it links in docs/design/. If not, follow the layout of the existing pages and ask before inventing anything new.
3. List the states to build: loading, each error code in the contract, empty, success. Ask if a state has no design.
4. Build the page in apps/web/src/pages, calling the API only through `api` in apps/web/src/api/client.ts, with formatRupiah for money. Show masked fields as the API sends them; never unmask.
5. Run pnpm --filter @kp/web typecheck. Check it against pnpm mock and report what you saw for each state.
