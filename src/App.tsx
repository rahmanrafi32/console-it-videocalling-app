import { useState } from "react";
import ChannelForm from "./ChannelForm";
import VideoCall from "./VideoCall";

const App = () => {
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");

  return (
    <div>
      <h1 className="heading">Console IT BD Video chat app</h1>
      {inCall ? (
        <VideoCall setInCall={setInCall} channelName={channelName} />
      ) : (
        <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
      )}
    </div>
  );
};

export default App;
