default: build

build:
  pnpm run build

dev:
  pnpm run dev

nix:
  nix build -L

format:
  pnpm exec prettier . --write
