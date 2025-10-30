#!/usr/bin/env bash
set -euo pipefail

SOURCE_REPO=""
SECRETS_FILE=".secrets"
TEMP_DIR=""
ACT_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -s|--source)
      SOURCE_REPO="$2"
      shift 2
      ;;
    -f|--secrets)
      SECRETS_FILE="$2"
      shift 2
      ;;
    -t|--temp)
      TEMP_DIR="$2"
      shift 2
      ;;
    --)
      shift
      ACT_ARGS=("$@")
      break
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$SOURCE_REPO" ]]; then
  if ! SOURCE_REPO=$(git rev-parse --show-toplevel 2>/dev/null); then
    echo "Unable to resolve repository root automatically. Provide --source." >&2
    exit 1
  fi
fi

if [[ -z "$TEMP_DIR" ]]; then
  UNAME=$(uname -s 2>/dev/null || echo "")
  if [[ "$UNAME" =~ (MINGW|MSYS|CYGWIN) ]]; then
    DEFAULT_BASE="D:/Code/Temp"
    mkdir -p "$DEFAULT_BASE"
    TEMP_DIR="$DEFAULT_BASE/one-portal-act-$(date +%s%N)"
  else
    if TEMP_DIR=$(mktemp -d 2>/dev/null); then
      :
    else
      TEMP_DIR=$(mktemp -d -t one-portal-act)
    fi
    rmdir "$TEMP_DIR"
  fi
fi

if [[ -e "$TEMP_DIR" ]]; then
  echo "Temporary clone directory '$TEMP_DIR' already exists. Choose a different path." >&2
  exit 1
fi

mkdir -p "$(dirname "$TEMP_DIR")"
SOURCE_REPO=$(cd "$SOURCE_REPO" && pwd)

echo "Cloning repository to temporary directory..."
git clone --quiet "$SOURCE_REPO" "$TEMP_DIR"

TEMP_DIR=$(cd "$TEMP_DIR" && pwd)

if [[ -f "$SOURCE_REPO/$SECRETS_FILE" ]]; then
  cp "$SOURCE_REPO/$SECRETS_FILE" "$TEMP_DIR/$SECRETS_FILE"
  echo "Copied secrets file to temporary clone."
else
  echo "Warning: secrets file '$SECRETS_FILE' not found in source repository." >&2
fi

pushd "$TEMP_DIR" >/dev/null

PREV_ACT=${ACT:-}
PREV_PNPM_STORE_PATH=${PNPM_STORE_PATH:-}
export ACT=true
CREATED_STORE=0

if [[ -z "${PNPM_STORE_PATH:-}" ]]; then
  PNPM_STORE_PATH="$TEMP_DIR/pnpm-store"
  export PNPM_STORE_PATH
  CREATED_STORE=1
fi

mkdir -p "$PNPM_STORE_PATH"
PNPM_STORE_FOR_RUN="$PNPM_STORE_PATH"

if [[ ${#ACT_ARGS[@]} -eq 0 ]]; then
  ACT_ARGS=(--container-architecture linux/amd64)
fi

SECRETS_PATH="$TEMP_DIR/$SECRETS_FILE"
HAS_SECRET_ARG=0
for arg in "${ACT_ARGS[@]}"; do
  if [[ "$arg" == --secret-file* ]]; then
    HAS_SECRET_ARG=1
    break
  fi
done
if [[ $HAS_SECRET_ARG -eq 0 && -f "$SECRETS_PATH" ]]; then
  ACT_ARGS+=(--secret-file "$SECRETS_PATH")
fi

act "${ACT_ARGS[@]}"

echo "act execution completed."

popd >/dev/null

if [[ -n "$PREV_ACT" ]]; then
  export ACT="$PREV_ACT"
else
  unset ACT || true
fi

if [[ -n "$PREV_PNPM_STORE_PATH" ]]; then
  export PNPM_STORE_PATH="$PREV_PNPM_STORE_PATH"
else
  unset PNPM_STORE_PATH || true
fi

echo "Temporary clone at: $TEMP_DIR"
if [[ "$CREATED_STORE" -eq 1 && -n "${PNPM_STORE_FOR_RUN:-}" ]]; then
  echo "Temporary pnpm store at: $PNPM_STORE_FOR_RUN"
fi
