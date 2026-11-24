---
name: onboard-me
description: Explain the codebase, a feature or an area in plain language for a new joiner. Use when someone asks how something works or where to start.
disable-model-invocation: true
---
# Onboard me

The user may name a feature, a folder or a file after the command, for example `/onboard-me early repayment`, `/onboard-me apps/web` or `/onboard-me money.ts`. If they name nothing, explain the whole repository.

1. Read before you explain. Start with README.md and the files in docs/, then the code for the area: apps/, packages/, contract/openapi.yaml and db/. Don't guess; if you can't find something, say so.
2. Write for a teammate in their first week. Use short sentences and everyday words. Define every domain or technical term the first time you use it (for example tenor, pelunasan dipercepat, quote, monorepo, contract).
3. Use these sections, in this order:
   - What it is: two or three sentences on what it does for the borrower or the business.
   - Where it lives: a table of the key files and folders, one line each.
   - How it works: the main flow in 3 to 6 numbered steps, from the screen or request to the database and back.
   - Rules to know: the conventions that are easy to break, with the file or doc each one comes from.
   - Try it yourself: one or two commands to run, and what you should see.
   - Ask a teammate: what the code and docs don't explain.
4. Cite a file path for every claim.
5. Answer in the language the user writes in.

Do not edit any file. All data in this repo is synthetic; never add real customer data to an example.