#!/bin/bash
# Usage: .cursor/skills/playwright-e2e/scripts/check.sh apps/qa/tests/<name>.e2e.spec.ts
# Fails if the file breaks the house rules or its tests fail. Needs pnpm db:up and pnpm dev running.
set -u
file="${1:?give the test file, e.g. apps/qa/tests/loan-detail.e2e.spec.ts}"

case "$file" in
  *.e2e.spec.ts) ;;
  *) echo "FAIL: $file must end in .e2e.spec.ts"; exit 1 ;;
esac
if grep -n "waitForTimeout" "$file"; then
  echo "FAIL: waitForTimeout is not allowed. Wait for a locator or a response instead."; exit 1
fi
if ! grep -q "LoginPage" "$file"; then
  echo "FAIL: log in through the LoginPage page object."; exit 1
fi

cd "$(git rev-parse --show-toplevel)/apps/qa" || exit 1
pnpm exec playwright test --project=e2e "${file#apps/qa/}" || { echo "FAIL: tests failed."; exit 1; }
echo "PASS: $file"
