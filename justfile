default: build

build:
  npm run build

dev:
  npm run dev

nix: 
  nix build -L

format:
  nix run nixpkgs#prettier -- --write .
