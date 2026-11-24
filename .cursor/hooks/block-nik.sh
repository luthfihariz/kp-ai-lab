#!/bin/bash
input=$(cat)
if echo "$input" | grep -Eq '[0-9]{16}'; then
  echo '{"continue": false,
  "user_message":
  "Looks like a NIK. Use synthetic data."}'
  exit 0
fi
echo '{"continue": true}'
