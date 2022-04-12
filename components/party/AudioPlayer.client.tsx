import { VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";
import { useAtom } from "jotai";
import { useAudioPlayer } from "react-use-audio-player";
import { Request } from "../../queries/useRequests";
import { songs_currentlyPlaying } from "../../state/atoms";
import Button from "../ui/Button.client";

export const AudioPlayer = ({ request }: { request: Request }) => {
  const [songPlaying, setSongPlaying] = useAtom(songs_currentlyPlaying);
  const { playing, play, pause } = useAudioPlayer({
    src: songPlaying,
    format: "mp3",
    autoplay: false,
  });

  const handleClick = () => {
    if (playing && request.preview_url === songPlaying) {
      pause();
    } else {
      setSongPlaying(request.preview_url);
      play();
    }
  };

  return (
    <Button theme="special-inverse" className="mt-2 !p-2">
      {playing && songPlaying === request.preview_url ? (
        <VolumeOffIcon className="h-5 w-5" onClick={handleClick} />
      ) : (
        <VolumeUpIcon className="h-5 w-5" onClick={handleClick} />
      )}
    </Button>
  );
};

export default AudioPlayer;
