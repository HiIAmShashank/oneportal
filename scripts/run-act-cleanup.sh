#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 [-a|--all] [PATH]" >&2
  echo "  -a, --all    Remove all one-portal-act-* directories under D:/Code/Temp" >&2
  echo "  PATH        Remove a specific directory (absolute or relative)" >&2
}

ALL=0
TARGET=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -a|--all)
      ALL=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      TARGET="$1"
      shift
      ;;
  esac
done

BASE_DIR="D:/Code/Temp"

if [[ ! -d "$BASE_DIR" ]]; then
  echo "Nothing to clean. Base directory '$BASE_DIR' does not exist." >&2
  exit 0
fi

normalize_path() {
  node - "$1" <<'NODE'
const path = require('path');
const input = process.argv[2];
process.stdout.write(path.resolve(input));
NODE
}

BASE_RESOLVED=$(normalize_path "$BASE_DIR")
BASE_RESOLVED=${BASE_RESOLVED//\\//}
case "$BASE_RESOLVED" in
  */) : ;;
  *) BASE_RESOLVED="$BASE_RESOLVED/" ;;
 esac
BASE_LOWER=$(printf '%s' "$BASE_RESOLVED" | tr '[:upper:]' '[:lower:]')

remove_target() {
  local raw="$1"
  local resolved
  resolved=$(normalize_path "$raw")
  resolved=${resolved//\\//}
  local resolved_lower
  resolved_lower=$(printf '%s' "$resolved" | tr '[:upper:]' '[:lower:]')
  if [[ "$resolved_lower" != "$BASE_LOWER"* ]]; then
    echo "Refusing to delete '$resolved' because it is outside '$BASE_DIR'." >&2
    exit 1
  fi
  if [[ ! -d "$resolved" ]]; then
    echo "Skip: '$resolved' not found." >&2
    return
  fi
  rm -rf "$resolved"
  echo "Removed: $resolved"
}

if [[ "$ALL" -eq 1 ]]; then
  shopt -s nullglob
  for dir in "$BASE_DIR"/one-portal-act-*; do
    remove_target "$dir"
  done
  shopt -u nullglob
  exit 0
fi

if [[ -z "$TARGET" ]]; then
  usage
  exit 1
fi

remove_target "$TARGET"
