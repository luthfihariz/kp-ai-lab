---
name: extract-component
description: Pull repeated markup out of pages into one typed React component.
disable-model-invocation: true
---
The user names a file and the piece of markup after the command, for example "LoanListPage.tsx loan status badge".
1. Find every copy of that markup in apps/web/src (the named file and any other page with the same pattern).
2. Create apps/web/src/components/<Name>.tsx with typed props. Use labels and formatters from format.ts.
3. Replace each copy with the component. The screens must look exactly the same: same text, same classes.
4. Run pnpm --filter @kp/web typecheck and list every file you changed.
Change nothing else.
