import React, { useCallback, useEffect, useRef, useState } from "react";
import RtcEngine from "react-native-agora";

const useAgora = () => {
  const [appId] = useState<string>("6e8c688be0734ab097c496f141dbc255");
  const [token, setToken] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("channel-x");
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState<boolean>(true);
  const [joinSucceed, setJoinSucceed] = useState<boolean>(false);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const rtcEngine = useRef<RtcEngine>();

  useEffect(() => {
    initAgora();
    return () => {
      rtcEngine.current?.destroy();
    };
  }, []);

  const initAgora = useCallback(async () => {
    rtcEngine.current = await RtcEngine.create(appId);
    await rtcEngine.current?.enableAudio();
    await rtcEngine.current?.setEnableSpeakerphone(true);

    rtcEngine.current?.addListener("UserJoined", (uid, elapsed) => {
      console.log("UserJoined", uid, elapsed);

      setPeerIds((peerIdsLocal) => {
        const user = peerIdsLocal.find((user) => user === uid);
        if (!user) {
          return [...peerIdsLocal, uid];
        }

        return peerIdsLocal;
      });
    });

    rtcEngine.current?.addListener("UserOffline", (uid, reason) => {
      console.log("UserOffline", uid, reason);

      setPeerIds((peerIdsLocal) => {
        return peerIdsLocal.filter((id) => id !== uid);
      });
    });

    rtcEngine.current?.addListener(
      "JoinChannelSuccess",
      (channel, uid, elapsed) => {
        console.log("JoinChannelSuccess", channel, uid, elapsed);

        setJoinSucceed(true);

        setPeerIds((peerIdsLocal) => {
          return [...peerIdsLocal, uid];
        });
      }
    );

    rtcEngine.current?.addListener("Error", (error) => {
      console.log("Error", error);
    });
  }, []);

  const joinChannel = useCallback(async () => {
    await rtcEngine.current?.joinChannel(token, channelName, null, 0);
  }, [channelName]);

  const leaveChannel = useCallback(async () => {
    await rtcEngine.current?.leaveChannel();

    setPeerIds([]);
    setJoinSucceed(false);
  }, []);

  const toggleIsSpeakerEnabled = useCallback(async () => {
    await rtcEngine.current?.setEnableSpeakerphone(!isSpeakerEnabled);
    setIsSpeakerEnabled(!isSpeakerEnabled);
  }, [isSpeakerEnabled]);

  return {
    joinChannel,
    leaveChannel,
    toggleIsSpeakerEnabled,
    joinSucceed,
    isSpeakerEnabled,
  };
};

export default useAgora;
