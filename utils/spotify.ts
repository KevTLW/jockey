interface Track {
  items: TrackItem[];
}

interface TrackItem {
  album: Album;
  artists: Artist[];
  explicit: boolean;
  id: string;
  name: string;
}

interface Artist {
  name: string;
}

interface Album {
  images: Image[];
}

interface Image {
  url: string;
}

interface SpotifySearchResult {
  tracks: Track;
}

const getSpotifyAccessToken = async () => {
  const spotifyClientPair = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  const spotifyApiKey = Buffer.from(spotifyClientPair).toString("base64");

  try {
    const { access_token: accessToken } = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${spotifyApiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
        }).toString(),
      }
    ).then((res) => res.json());

    return accessToken;
  } catch (error) {
    console.error(error);
  }
};

export const searchSpotify = async (query: string) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const accessToken = await getSpotifyAccessToken();

    const data: SpotifySearchResult = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodedQuery}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());

    return data;
  } catch (error) {
    console.error(error);
  }
};
