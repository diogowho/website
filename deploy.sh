#!/usr/bin/env sh
set -eu
find "$DIST_DIR" -type f | while read -r file; do
  remote_path="${file#$DIST_DIR/}"
  curl -s -X PUT \
    "https://storage.bunnycdn.com/${STORAGE_ZONE}/${remote_path}" \
    -H "AccessKey: $STORAGE_KEY" \
    -H "Content-Type: application/octet-stream" \
    --data-binary "@$file"
done

curl -X POST \
  "https://api.bunny.net/pullzone/${PULL_ZONE_ID}/purgeCache" \
  -H "AccessKey: $API_KEY"

echo "deployed!"
