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
