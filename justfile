default: build

build:
  nix run nixpkgs#tailwindcss_4 -- -i globals.css -o styles.css --minify
