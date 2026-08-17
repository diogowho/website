default: build

build:
  npm run build

dev:
  npm run dev

format:
  prettier --write .

upgrade:
  npx @astrojs/upgrade

deploy:
  just build
  wrangler deploy
