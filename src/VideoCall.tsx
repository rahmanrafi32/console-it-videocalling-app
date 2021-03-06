import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { ClientConfig, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import { Controls } from "./Controls";
import Videos from "./Videos";

const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

export const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const appId: string = "126c48d9a6154587a0ba05fa08a3d4ba";
const token: string | null =
  "006126c48d9a6154587a0ba05fa08a3d4baIABxlBRta69byInub0WJZXGami2bNR1HN38w1aBdG8fuwcEDrq4AAAAAEACu7KwLEAvTYQEAAQDxCdNh";

const VideoCall = (props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  channelName: string;
}) => {
  const { setInCall, channelName } = props;
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);

  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name: string) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      await client.join(appId, name, token, null);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      console.log("init ready");
      init(channelName);
    }
  }, [channelName, client, ready, tracks]);

  return (
    <div className="App">
      {ready && tracks && (
        <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
      )}
      {start && tracks && <Videos users={users} tracks={tracks} />}
    </div>
  );
};

export default VideoCall;
