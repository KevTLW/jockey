import { NextApiRequest, NextApiResponse } from "next";
import { searchSpotify } from "../../utils/spotify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { tracks } = (await searchSpotify(req.query.query as string)) || {};

    const results = tracks?.items.map((track) => {
      return {
        artists: track.artists.map((artist) => artist.name),
        id: track.id,
        image: track.album.images[0].url,
        name: track.name,
        explicit: track.explicit,
      };
    });

    return res.json(results);
  } catch (err) {
    console.error(err);

    return res.send(500);
  }
};

export default handler;
