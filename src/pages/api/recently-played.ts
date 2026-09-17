import type { APIRoute } from "astro";
import { getEnv } from "astro/env/runtime";
import { createDeveloperToken } from "../../lib/musickit";

export const prerender = false;

const MAX_TRACKS = 1;
const ARTWORK_SIZE = 160;
const RECENT_TRACKS_URL =
  "https://api.music.apple.com/v1/me/recent/played/tracks";
const SONG_TYPES = "songs,library-songs";
const SONG_LINK_URL = "https://song.link/i";

interface AppleMusicAttributes {
  name?: string;
  artistName?: string;
  albumName?: string;
  url?: string;
  artwork?: { url?: string };
  playParams?: { id?: string; catalogId?: string };
}

interface AppleMusicResource {
  id: string;
  type?: string;
  attributes?: AppleMusicAttributes;
}

function artworkUrl(url: string | undefined): string | null {
  if (!url) return null;
  return url
    .replace(/\{w\}/g, String(ARTWORK_SIZE))
    .replace(/\{h\}/g, String(ARTWORK_SIZE));
}

function toTrack(resource: AppleMusicResource) {
  const attributes = resource.attributes ?? {};
  const title = attributes.name;
  if (!title) return null;

  const appleId =
    attributes.playParams?.catalogId ??
    (resource.type === "songs" ? resource.id : null);

  return {
    id: resource.id,
    title,
    artist: attributes.artistName ?? "",
    album:
      attributes.albumName && attributes.albumName !== title
        ? attributes.albumName
        : "",
    artwork: artworkUrl(attributes.artwork?.url),
    url: appleId ? `${SONG_LINK_URL}/${appleId}` : (attributes.url ?? null),
  };
}

function json(body: unknown, status: number, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export const GET: APIRoute = async () => {
  const userToken = getEnv("MUSICKIT_USER_TOKEN");
  if (!userToken) {
    return json({ error: "MusicKit is not configured." }, 503);
  }

  try {
    const developerToken = await createDeveloperToken();
    const params = new URLSearchParams({
      limit: String(MAX_TRACKS),
      types: SONG_TYPES,
    });
    const response = await fetch(`${RECENT_TRACKS_URL}?${params}`, {
      headers: {
        Authorization: `Bearer ${developerToken}`,
        "Music-User-Token": userToken,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return json(
        { error: `Apple Music responded with ${response.status}.` },
        response.status === 401 ? 401 : 502,
      );
    }

    const data = (await response.json()) as { data?: AppleMusicResource[] };
    const tracks = (data.data ?? [])
      .filter(
        (resource) =>
          resource.type === "songs" || resource.type === "library-songs",
      )
      .slice(0, MAX_TRACKS)
      .map(toTrack)
      .filter((track) => track !== null);

    return json({ tracks }, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    });
  } catch {
    return json({ error: "Couldn't reach Apple Music." }, 500);
  }
};
