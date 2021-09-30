import React, { useCallback, useEffect, useRef, useState } from "react";
import RtcEngine from "react-native-agora";
import { Config } from "react-native-config";

const useAgora = () => {
  const [appId] = useState<string>(Config.AGORA_APP_ID);
  const [token, setToken] = useState<string>(
    "0065d711c9369b54983a7cd5c824ccad0adIABGz9PTCLLM8Kr1KkBQOv4rvK1OzkEct/rvYDJM3t/OcQJkFYoAAAAAEADy5cWPpsJWYQEAAQCmwlZh"
  );
  const [channelName, setChannelName] = useState<string>("channel-x");
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState(true);
  const [joinSucceed, setJoinSucceed] = useState<boolean>(false);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [error, setError] = useState<boolean>(false);
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
        rtcEngine.current?.muteLocalAudioStream(true).then(() => {
          setIsMuted(true);
        });
        rtcEngine.current?.setEnableSpeakerphone(isSpeakerEnabled);

        setPeerIds((peerIdsLocal) => {
          return [...peerIdsLocal, uid];
        });
      }
    );

    rtcEngine.current?.addListener("Error", (error) => {
      console.log(error);
      setError(true);
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

  const toggleIsMuted = useCallback(async () => {
    await rtcEngine.current?.muteLocalAudioStream(!isMuted);
    setIsMuted(!isMuted);
  }, [isMuted]);

  return {
    joinChannel,
    leaveChannel,
    toggleIsSpeakerEnabled,
    joinSucceed,
    isSpeakerEnabled,
    isMuted,
    toggleIsMuted,
    peerIds,
    setChannelName,
    error,
  };
};

export default useAgora;
