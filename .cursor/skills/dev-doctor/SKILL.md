---
name: dev-doctor
description: Check why the practice app won't start on this machine (a laptop or a cloud VM) and say how to fix it.
disable-model-invocation: true
---
Run these checks in order on the machine the repo is on. For each, print one line: OK, or the problem and the fix.
1. Node version against "engines" in package.json (needs 20.19 or newer).
2. pnpm version against "packageManager" in package.json (10.6).
3. Docker is running (docker info).
4. Ports 5499, 8080, 5173 and 4010 are free, or used by this app itself (say which).
5. pnpm db:up succeeds and Postgres answers on 127.0.0.1:5499.
6. On a server or cloud VM: the database port is not reachable from outside the machine. Say how it's bound, and suggest binding it to 127.0.0.1 if it isn't.
Use the Troubleshooting table in README.md for fixes. Ask before running anything that changes the machine (install, kill a process, restart Docker).
Never print environment variables, .env files, tokens or passwords.
