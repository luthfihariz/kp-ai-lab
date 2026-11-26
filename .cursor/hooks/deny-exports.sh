#!/bin/bash
input=$(cat)
if echo "$input" | grep -Eq '"file_path"[^,}]*(data/exports/|\.dump")'; then
  echo '{"permission": "deny",
    "user_message": "Blocked: data exports and dumps stay out of AI context.",
    "agent_message": "This file is a data export. Do not read it; ask the user for a synthetic sample instead."}'
  exit 0
fi
echo '{"permission": "allow"}'
