default: build

build:
  npm run build

dev:
  npm run dev

nix: 
  nix build -L

format:
  nix run nixpkgs#prettier -- --write .

deploy token:
  nix run nixpkgs#git-pages-cli -- https://diogocastro.net --upload-dir dist/ --token {{ token }}
