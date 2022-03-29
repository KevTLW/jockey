import { useQuery } from "react-query";
import { fetchTracks } from "../utils/spotify";

export const useSpotifySearch = (query: string) => {
  const { data, isLoading } = useQuery(
    ["search", query.trim()],
    ({ signal }) => fetchTracks(query, signal!),
    { enabled: Boolean(query.trim()) }
  );

  return {
    data,
    loading: isLoading,
  };
};
