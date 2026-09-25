#!/bin/bash
set -e

echo "========================================"
echo "SKYRA PLATFORM QUALITY GATES"
echo "========================================"

echo "[1/6] Installing dependencies..."
pnpm install --frozen-lockfile

echo "[2/6] Running typecheck..."
pnpm typecheck

echo "[3/6] Running lint..."
pnpm lint

echo "[4/6] Running regression tests..."
pnpm test

echo "[5/6] Building packages..."
pnpm build

echo "[6/6] Packing artifacts and validating boundaries..."
mkdir -p .tmp/platform-consumer-validation/tarballs
rm -rf .tmp/platform-consumer-validation/tarballs/*

cd packages
for pkg in $(ls -d */); do
  echo "Packing $pkg"
  cd $pkg
  pnpm pack --pack-destination ../../.tmp/platform-consumer-validation/tarballs > /dev/null
  cd ..
done
cd ..

echo "Artifacts packed successfully."

echo "Validating artifacts do not leak source or config..."
for tarball in .tmp/platform-consumer-validation/tarballs/*.tgz; do
  echo "Inspecting $tarball"
  
  # Check for src leaking (except design tokens which uses src/tokens.css etc.)
  # Or simply verify internal TS is excluded.
  if tar -tf "$tarball" | grep -q "src/.*\.ts$"; then
    echo "FAIL: $tarball leaks TypeScript source."
    exit 1
  fi
  
  if tar -tf "$tarball" | grep -q "tests/"; then
    echo "FAIL: $tarball leaks tests."
    exit 1
  fi

  if tar -tf "$tarball" | grep -q "tsconfig.json"; then
    echo "FAIL: $tarball leaks tsconfig.json."
    exit 1
  fi
done

echo "========================================"
echo "PLATFORM VALIDATION PASSED"
echo "========================================"
