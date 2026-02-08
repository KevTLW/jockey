import { action } from "./_generated/server";
import { v } from "convex/values";

interface SpotifyTrack {
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
  explicit: boolean;
  id: string;
  name: string;
  preview_url: string | null;
}

interface SpotifySearchResult {
  tracks: {
    items: SpotifyTrack[];
  };
}

async function getSpotifyAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Spotify credentials not configured");
  }

  const auth = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to get Spotify access token");
  }

  const data = await response.json();
  return data.access_token;
}

export const search = action({
  args: { query: v.string() },
  handler: async (_, args) => {
    if (!args.query.trim()) {
      return [];
    }

    try {
      const accessToken = await getSpotifyAccessToken();
      const encodedQuery = encodeURIComponent(args.query);

      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodedQuery}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search Spotify");
      }

      const data: SpotifySearchResult = await response.json();

      return data.tracks.items.map((track) => ({
        spotifyId: track.id,
        name: track.name,
        artists: track.artists.map((a) => a.name),
        image: track.album.images[0]?.url || "",
        explicit: track.explicit,
        previewUrl: track.preview_url,
      }));
    } catch {
      return [];
    }
  },
});
