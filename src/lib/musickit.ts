import { getEnv } from "astro/env/runtime";

const PEM_HEADER = "-----BEGIN PRIVATE KEY-----";
const PEM_FOOTER = "-----END PRIVATE KEY-----";
const MAX_EXPIRES_IN_SECONDS = 15_777_000;

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64.replace(/\s/g, ""));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function decodePrivateKey(value: string): Uint8Array {
  let contents = value.trim();

  if (contents.includes(PEM_HEADER)) {
    contents = contents.replaceAll("\\n", "\n");
    return base64ToBytes(
      contents.replace(PEM_HEADER, "").replace(PEM_FOOTER, ""),
    );
  }

  let decoded = base64ToBytes(contents);
  let decodedText = new TextDecoder().decode(decoded);

  if (decodedText.includes(PEM_HEADER)) {
    decoded = base64ToBytes(
      decodedText.replace(PEM_HEADER, "").replace(PEM_FOOTER, ""),
    );
  }

  return decoded;
}

export async function createDeveloperToken(): Promise<string> {
  const teamId = getEnv("MUSICKIT_TEAM_ID");
  const keyId = getEnv("MUSICKIT_KEY_ID");
  const privateKey = getEnv("MUSICKIT_PRIVATE_KEY");

  if (!teamId || !keyId || !privateKey) {
    throw new Error("MusicKit is not configured");
  }

  const der = decodePrivateKey(privateKey);

  const key = await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "ES256", kid: keyId };
  const payload = { iss: teamId, iat: now, exp: now + MAX_EXPIRES_IN_SECONDS };

  const signingInput = `${base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)))}.${base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)))}`;

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
}
