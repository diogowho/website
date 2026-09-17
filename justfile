default: build

build:
  npm run build

dev:
  npm run dev

authorize:
  node scripts/authorize.mjs

format:
  prettier --write .

upgrade:
  npx @astrojs/upgrade

deploy:
  just build
  wrangler deploy
