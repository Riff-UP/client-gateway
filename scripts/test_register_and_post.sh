#!/usr/bin/env bash
set -euo pipefail

# Test script: Register a user, login, upload local image to transfer.sh, then create a post using the uploaded URL.
# Usage: ./scripts/test_register_and_post.sh /path/to/image.jpg
# Requirements: curl, jq

IMAGE_PATH=${1:-}
BASE_URL=${BASE_URL:-http://localhost:3000/api}
EMAIL="243704@ids.upchiapas.edu.mx"
PASSWORD="TestPass123!"
NAME="Test User 243704"

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required" >&2
  exit 1
fi
JQ_BIN=""
PY_BIN=""
SED_FALLBACK=0
if command -v jq >/dev/null 2>&1; then
  JQ_BIN=jq
elif command -v python3 >/dev/null 2>&1; then
  PY_BIN=python3
else
  # fallback to sed-based naive parsing if no jq/python3 available
  SED_FALLBACK=1
fi

if [ -z "${IMAGE_URL:-}" ]; then
  if [ -z "$IMAGE_PATH" ]; then
    echo "Usage: $0 /path/to/image.jpg (or set IMAGE_URL env to skip upload)" >&2
    exit 1
  fi
  if [ ! -f "$IMAGE_PATH" ]; then
    echo "Image file not found: $IMAGE_PATH" >&2
    exit 1
  fi
else
  echo "IMAGE_URL provided via env, skipping local upload checks"
fi

echo "Base URL: $BASE_URL"

# Login
echo "\n1) Logging in"
LOGIN_RSP=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
if [ -n "$JQ_BIN" ]; then
  TOKEN=$(echo "$LOGIN_RSP" | jq -r '.token // empty')
elif [ -n "$PY_BIN" ]; then
  TOKEN=$(printf '%s' "$LOGIN_RSP" | $PY_BIN -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
else
  TOKEN=$(printf '%s' "$LOGIN_RSP" | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]\+\)".*/\1/p' | head -n1 || true)
fi
if [ -z "$TOKEN" ]; then
  echo "Login failed or token not found. Attempting to register the user..."
  # Try to register the user via /users
  REG_RSP=$(curl -s -X POST "$BASE_URL/users" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"$NAME\"}")
  echo "Register response: $REG_RSP"

  # Retry login
  LOGIN_RSP=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

  if [ -n "$JQ_BIN" ]; then
    TOKEN=$(echo "$LOGIN_RSP" | jq -r '.token // empty')
  elif [ -n "$PY_BIN" ]; then
    TOKEN=$(printf '%s' "$LOGIN_RSP" | $PY_BIN -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
  else
    TOKEN=$(printf '%s' "$LOGIN_RSP" | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]\+\)".*/\1/p' | head -n1 || true)
  fi

  if [ -z "$TOKEN" ]; then
    echo "Login failed after registration. Response:" >&2
    echo "$LOGIN_RSP" >&2
    exit 1
  fi
fi
echo "Token obtained. Length: ${#TOKEN} chars"

# if USER_ID empty, try to extract from login response user object
# try to extract user id from login response
if [ -z "${USER_ID:-}" ]; then
  if [ -n "$JQ_BIN" ]; then
    USER_ID=$(echo "$LOGIN_RSP" | jq -r '.user.id // .user._id // empty')
  elif [ -n "$PY_BIN" ]; then
    USER_ID=$(printf '%s' "$LOGIN_RSP" | $PY_BIN -c "import sys,json; d=json.load(sys.stdin); u=d.get('user') or {}; print(u.get('id') or u.get('_id') or '')")
  else
    USER_ID=$(printf '%s' "$LOGIN_RSP" | sed -n 's/.*"user"[^{]*{[^}]*"id"[[:space:]]*:[[:space:]]*"\([^"\]+\)".*/\1/p' | head -n1 || true)
  fi
fi

# allow providing sql_user_id as second arg or via SQL_USER_ID env; fallback to extracted USER_ID
SQL_USER_ID=${2:-${SQL_USER_ID:-}}
if [ -z "${SQL_USER_ID}" ] && [ -n "${USER_ID}" ]; then
  SQL_USER_ID="$USER_ID"
fi
if [ -z "${SQL_USER_ID}" ]; then
  echo "Warning: sql_user_id not found. Provide as second arg or set SQL_USER_ID env. Proceeding without it." >&2
fi

# 2) Upload image to transfer.sh (public). If you already have a URL, set IMAGE_URL env to skip upload.
FNAME=$(basename "$IMAGE_PATH")
echo "\n2) Uploading image $IMAGE_PATH to transfer.sh (or using IMAGE_URL env)"
if [ -n "${IMAGE_URL:-}" ]; then
  echo "Using provided IMAGE_URL: $IMAGE_URL"
else
  UPLOAD_RSP=$(curl -s --upload-file "$IMAGE_PATH" "https://transfer.sh/$FNAME")
  if [[ "$UPLOAD_RSP" =~ http ]]; then
    IMAGE_URL="$UPLOAD_RSP"
    echo "Uploaded -> $IMAGE_URL"
  else
    echo "Upload failed or no URL returned. Response: $UPLOAD_RSP" >&2
    exit 1
  fi
fi

# 3) Create post with url field pointing to uploaded image
echo "\n3) Creating post referencing uploaded image"
CREATE_POST_PAY=$(printf '%s' "{\"sql_user_id\":\"%s\",\"type\":\"%s\",\"title\":\"%s\",\"content\":\"%s\",\"description\":\"%s\"}" "${SQL_USER_ID:-}" "image" "Test Image Upload" "$IMAGE_URL" "Uploaded by automated test")

CREATE_RSP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$CREATE_POST_PAY")
HTTP=$(echo "$CREATE_RSP" | tail -n1)
BODY=$(echo "$CREATE_RSP" | sed '$d')

if [ "$HTTP" -ge 200 ] && [ "$HTTP" -lt 300 ]; then
  echo "Post created successfully. Response:"
  if [ -n "$JQ_BIN" ]; then
    echo "$BODY" | jq '.'
  elif [ -n "$PY_BIN" ]; then
    echo "$BODY" | $PY_BIN -m json.tool
  else
    echo "$BODY"
  fi
else
  echo "Create post returned HTTP $HTTP. Response:"
  if [ -n "$JQ_BIN" ]; then
    echo "$BODY" | jq '.'
  elif [ -n "$PY_BIN" ]; then
    echo "$BODY" | $PY_BIN -m json.tool
  else
    echo "$BODY"
  fi
  exit 1
fi

echo "\nTest flow completed successfully."
