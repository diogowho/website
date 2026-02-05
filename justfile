default: build

build:
  pnpm run build

dev:
  pnpm run dev

format:
  pnpm exec prettier . --write
