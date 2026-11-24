#!/bin/bash
cat > /dev/null
echo '{"permission": "ask",
  "user_message": "Database command. Make sure this is not production.",
  "agent_message": "The user must approve database commands."}'
