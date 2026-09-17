#!/usr/bin/env node
import { createServer } from "node:http";
import { createPrivateKey, sign as cryptoSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 4322);
const DEV_VARS_PATH = fileURLToPath(new URL("../.dev.vars", import.meta.url));
const MAX_EXPIRES_IN_SECONDS = 15_777_000;

function parseDevVars(path) {
  if (!existsSync(path)) return;

  const raw = readFileSync(path, "utf8");
  const pattern =
    /(?:^|\n)\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:"((?:[^"\\]|\\.|\n)*)"|'([^']*)'|([^\n\r]*))/g;

  for (const [, key, doubleQuoted, singleQuoted, bare] of raw.matchAll(
    pattern,
  )) {
    if (process.env[key] !== undefined) continue;

    let value = doubleQuoted ?? singleQuoted ?? bare ?? "";
    if (doubleQuoted !== undefined) {
      value = value.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
    }
    process.env[key] = value.trim();
  }
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodePrivateKey(value) {
  const contents = value.trim();

  if (contents.includes("BEGIN PRIVATE KEY")) {
    return contents.replaceAll("\\n", "\n");
  }

  const decoded = Buffer.from(contents, "base64").toString("utf8");
  if (decoded.includes("BEGIN PRIVATE KEY")) {
    return decoded.replaceAll("\\n", "\n");
  }

  return {
    key: Buffer.from(contents, "base64"),
    format: "der",
    type: "pkcs8",
  };
}

function createDeveloperToken(privateKey, teamId, keyId) {
  const key = createPrivateKey(decodePrivateKey(privateKey));
  const now = Math.floor(Date.now() / 1000);

  const header = base64Url(JSON.stringify({ alg: "ES256", kid: keyId }));
  const payload = base64Url(
    JSON.stringify({
      iss: teamId,
      iat: now,
      exp: now + MAX_EXPIRES_IN_SECONDS,
    }),
  );
  const signingInput = `${header}.${payload}`;

  const signature = cryptoSign("sha256", Buffer.from(signingInput), {
    key,
    dsaEncoding: "ieee-p1363",
  });

  return `${signingInput}.${base64Url(signature)}`;
}

parseDevVars(DEV_VARS_PATH);

const teamId = process.env.MUSICKIT_TEAM_ID;
const keyId = process.env.MUSICKIT_KEY_ID;
const privateKey = process.env.MUSICKIT_PRIVATE_KEY;

if (!teamId || !keyId || !privateKey) {
  console.error(
    "Missing MUSICKIT_TEAM_ID, MUSICKIT_KEY_ID or MUSICKIT_PRIVATE_KEY in .dev.vars.",
  );
  process.exit(1);
}

let developerToken;
try {
  developerToken = createDeveloperToken(privateKey, teamId, keyId);
} catch (error) {
  console.error(`Failed to sign developer token: ${error.message}`);
  process.exit(1);
}

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Apple Music authorization</title>
  </head>
  <body style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.5">
    <h1>Apple Music authorization</h1>
    <p>Sign in to generate a Music-User-Token, then set it as the <code>MUSICKIT_USER_TOKEN</code> secret.</p>
    <button id="authorize" style="padding: 0.5rem 1rem; font-size: 1rem">Authorize with Apple Music</button>
    <p id="status"></p>
    <div id="result" hidden>
      <textarea id="token" readonly rows="6" style="width: 100%; font-family: monospace"></textarea>
      <button id="copy" style="margin-top: 0.5rem">Copy</button>
    </div>
    <script src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"></script>
    <script>
      const developerToken = ${JSON.stringify(developerToken)};
      const button = document.getElementById("authorize");
      const status = document.getElementById("status");
      const result = document.getElementById("result");
      const token = document.getElementById("token");

      button.addEventListener("click", async () => {
        button.disabled = true;
        status.textContent = "Waiting for Apple Music…";
        try {
          await MusicKit.configure({ developerToken });
          const music = MusicKit.getInstance();
          await music.authorize();
          token.value = music.musicUserToken;
          result.hidden = false;
          status.textContent = "Authorized. Copy the token below.";
          await fetch("/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token.value }),
          });
        } catch (error) {
          console.error(error);
          status.textContent = "Authorization failed: " + error;
          button.disabled = false;
        }
      });

      document.getElementById("copy").addEventListener("click", async (event) => {
        await navigator.clipboard.writeText(token.value);
        event.target.textContent = "Copied!";
      });
    </script>
  </body>
</html>`;

const server = createServer((request, response) => {
  if (request.method === "POST" && request.url === "/token") {
    let body = "";
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => {
      let token = "";
      try {
        token = JSON.parse(body).token ?? "";
      } catch {}

      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("ok");

      console.log("\nMUSICKIT_USER_TOKEN:\n");
      console.log(token);
      server.close();
    });
    return;
  }

  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(page);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Open http://localhost:${PORT} in your browser to authorize.`);
});
