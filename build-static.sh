#!/usr/bin/env bash
set -euo pipefail
rm -rf public
mkdir -p public
cp index.html manifest.webmanifest manus-routes.json public/
cp -R css js assets public/
