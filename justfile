default: build

build:
  npm run build

dev:
  npm run dev

format:
  prettier --write .

deploy token:
  just build
  git-pages-cli https://diogocastro.net --upload-dir dist/ --token {{ token }}

upgrade:
  npx @astrojs/upgrade
