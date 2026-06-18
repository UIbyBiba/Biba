#!/usr/bin/env bash
# Assembles the static "Studio Jeju" site into _studio_site/ for deployment.
set -e
cd "$(dirname "$0")"
OUT="_studio_site"
rm -rf "$OUT"; mkdir -p "$OUT"
cp index.html about.html services.html contact.html work.html styles.css "$OUT"/
# Copy images but exclude the unused high-res source/ folder (~89M)
rsync -a --exclude 'source' --exclude '*.psd' images/ "$OUT"/images/
echo "Built $OUT/ ($(du -sh "$OUT" | cut -f1))  — drag to Netlify, or: netlify deploy --prod --dir=$OUT"
