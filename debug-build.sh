#!/usr/bin/env bash
# Debug script to investigate build issues on EC2

echo "🔍 Debugging TanStack Start Build"
echo "=================================="
echo ""

echo "📁 Current directory:"
pwd
echo ""

echo "📦 Node version:"
node --version
echo ""

echo "📦 pnpm version:"
pnpm --version
echo ""

echo "📦 Package.json scripts:"
cat package.json | grep -A 10 '"scripts"'
echo ""

echo "🏗️  Running build with verbose output..."
echo "=================================="
pnpm build
BUILD_EXIT_CODE=$?
echo ""
echo "Build exit code: $BUILD_EXIT_CODE"
echo ""

if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "📁 Checking .output directory:"
if [ -d ".output" ]; then
  echo "✅ .output directory exists"
  echo ""
  echo "Contents of .output/:"
  ls -la .output/
  echo ""
  if [ -d ".output/server" ]; then
    echo "Contents of .output/server/:"
    ls -la .output/server/
  else
    echo "❌ .output/server directory not found!"
  fi
else
  echo "❌ .output directory not found!"
fi
echo ""

echo "🔍 Checking vite.config.ts:"
cat vite.config.ts
echo ""

echo "✅ Debug complete!"
