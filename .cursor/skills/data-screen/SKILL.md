---
name: data-screen
description: Build a React page in apps/web that shows data from the API. Use when asked for a new page, screen or list. Not for forms that submit data.
paths: "apps/web/**"
---
1. Find the endpoint in contract/openapi.yaml and its type in src/api/client.ts.
2. Copy assets/screen-template.tsx to src/pages/<Name>Page.tsx and add the route in App.tsx.
3. Call the API only through api.GET. Handle three states: loading ("Memuat…"), error (role="alert"), empty (a Bahasa sentence).
4. Money with formatRupiah, dates with formatDate, labels from format.ts. Never show NIK, phone or a full account number.
5. Run pnpm --filter @kp/web typecheck.
