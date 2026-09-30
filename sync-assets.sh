#!/usr/bin/env bash
set -e

DEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/android/app/src/main/assets/www"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Syncing web assets to Android assets directory..."
mkdir -p "$DEST_DIR"

cp "$SRC_DIR/index.html" "$DEST_DIR/"
cp "$SRC_DIR/styles.css" "$DEST_DIR/"
cp "$SRC_DIR/scripts.js" "$DEST_DIR/"
cp "$SRC_DIR/logo.png" "$DEST_DIR/"
cp "$SRC_DIR/txt.jpg" "$DEST_DIR/"
cp "$SRC_DIR/adiyath.jpg" "$DEST_DIR/"
cp "$SRC_DIR/icon-192.png" "$DEST_DIR/"
cp "$SRC_DIR/icon-512.png" "$DEST_DIR/"
cp "$SRC_DIR/manifest.webmanifest" "$DEST_DIR/"
cp "$SRC_DIR/sw.js" "$DEST_DIR/"

echo "==> Synchronization complete: $DEST_DIR is up to date."
