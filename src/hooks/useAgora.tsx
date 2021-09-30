import React, { useCallback, useEffect, useRef, useState } from "react";
import RtcEngine, { ChannelProfile, ClientRole } from "react-native-agora";
import { Config } from "react-native-config";

const useAgora = () => {
  const [appId] = useState<string>(Config.AGORA_APP_ID);
  const [token, setToken] = useState<string>();
  const [rtcUid, setRtcUid] = useState<number>(
    parseInt((new Date().getTime() + "").slice(4, 13), 10)
  );
  const [muted, setMuted] = useState<boolean>(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState<boolean>(true);
  const [joinSucceed, setJoinSucceed] = useState<boolean>(false);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
    // Needs to be set to LiveBroadcasting to enable Broadcast/Audience roles
    await rtcEngine.current?.setChannelProfile(ChannelProfile.Communication);

    // Fires when a remote user joins
    rtcEngine.current?.addListener("UserJoined", (uid) => {
      // Add peer ID to array if it is a new user
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

    // Fires when local user joins RTC channel
    rtcEngine.current?.addListener(
      "JoinChannelSuccess",
      (channel, uid, elapsed) => {
        console.log("JoinChannelSuccess", channel, uid, elapsed);

        // enables speakerphone and automatically mute when joining room
        rtcEngine.current
          ?.setEnableSpeakerphone(isSpeakerEnabled)
          .catch((error) => {
            console.log("setEnableSpeakerphone", error);
          });
        rtcEngine.current?.muteLocalAudioStream(true);

        setRtcUid(uid);
        setPeerIds((peerIdsLocal) => {
          const user = peerIdsLocal.find((user) => user === uid);
          if (!user) {
            return [...peerIdsLocal, uid];
          }

          return peerIdsLocal;
        });

        setJoinSucceed(true);
        setLoading(false);
      }
    );

    rtcEngine.current?.addListener("Error", (error) => {
      console.log("General error: ", error);
      setError(true);
    });
  }, []);

  // METHODS
  const joinChannel = async (channelName: string) => {
    try {
      await rtcEngine.current?.joinChannel(token, channelName, null, rtcUid);
    } catch (error) {
      setError(true);
      console.log("joinChannel: ", error);
    }
  };

  const leaveChannel = async () => {
    await rtcEngine.current
      ?.leaveChannel()
      .catch((error) => console.log("leaveChannel: ", error));

    // Clear up the state
    setPeerIds([]);
    setMuted(true);
    setJoinSucceed(false);
  };

  const changeChannel = async (newChannelName: string) => {
    try {
      await leaveChannel();
      await joinChannel(newChannelName);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log("changeChannel: ", error);
    }
  };

  // TOGGLES
  const toggleMute = async () => {
    console.log("toggle");
    await rtcEngine.current?.muteLocalAudioStream(!muted).then(() => {
      setMuted(!muted);
    });
  };

  const toggleIsSpeakerEnabled = async () => {
    await rtcEngine.current
      ?.setEnableSpeakerphone(!isSpeakerEnabled)
      .catch((error) => console.log("toggleIsSpeakerEnabled: ", error));
    setIsSpeakerEnabled(!isSpeakerEnabled);
  };

  return {
    joinChannel,
    leaveChannel,
    toggleIsSpeakerEnabled,
    joinSucceed,
    isSpeakerEnabled,
    peerIds,
    changeChannel,
    error,
    toggleMute,
    muted,
    loading,
    setLoading,
  };
};

export default useAgora;
