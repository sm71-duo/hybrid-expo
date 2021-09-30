import React, { useCallback, useEffect, useRef, useState } from "react";
import RtcEngine, { ChannelProfile, ClientRole } from "react-native-agora";
import { Config } from "react-native-config";

const useAgora = () => {
  const [appId] = useState<string>(Config.AGORA_APP_ID);
  const [token, setToken] = useState<string>();
  const [channelName, setChannelName] = useState<string>("channel-x");
  const [rtcUid, setRtcUid] = useState<number>(
    parseInt((new Date().getTime() + "").slice(4, 13), 10)
  );
  // stupid workaround because Audience members don’t trigger the userJoined/userOffline event
  const [clientRole, setClientRole] = useState<ClientRole>(
    ClientRole.Broadcaster
  );
  const [muted, setMuted] = useState<boolean>(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState<boolean>(true);
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
    // Needs to be set to LiveBroadcasting to enable Broadcast/Audience roles
    await rtcEngine.current?.setChannelProfile(ChannelProfile.LiveBroadcasting);

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

        // enables speakerphone and sets clientrole to audience to automatically mute new users
        rtcEngine.current
          ?.setEnableSpeakerphone(isSpeakerEnabled)
          .catch((error) => {
            console.log("setEnableSpeakerphone", error);
          });
        rtcEngine.current?.setClientRole(clientRole).catch((error) => {
          console.log("setClientRole: ", error);
        });

        setJoinSucceed(true);
        setRtcUid(uid);
        setPeerIds((peerIdsLocal) => {
          const user = peerIdsLocal.find((user) => user === uid);
          if (!user) {
            return [...peerIdsLocal, uid];
          }

          return peerIdsLocal;
        });

        // // switch role back to audience so you can not immediately talk
        // switchRole();
      }
    );

    rtcEngine.current?.addListener("Error", (error) => {
      console.log("General error: ", error);
      setError(true);
    });
  }, []);

  const joinChannel = useCallback(async () => {
    await rtcEngine.current
      ?.joinChannel(token, channelName, null, rtcUid)
      .catch((error) => console.log("joinChannel: ", error));
  }, []);

  const switchRole = useCallback(async () => {
    if (clientRole === ClientRole.Audience) {
      await rtcEngine.current
        ?.setClientRole(ClientRole.Broadcaster)
        .then(() => {
          setMuted(false);
          setClientRole(ClientRole.Broadcaster);
        });
    } else {
      await rtcEngine.current?.setClientRole(ClientRole.Audience).then(() => {
        setMuted(true);
        setClientRole(ClientRole.Audience);
      });
    }
  }, []);

  const changeChannel = async (newChannelName: string) => {
    // the client needs to be of type Audience to change channels..
    await rtcEngine.current
      ?.setClientRole(ClientRole.Audience)
      .then(() => {
        setMuted(true);
        setClientRole(ClientRole.Audience);
      })
      .catch((error) => {
        console.log("setClientRole: ", error);
      });
    await rtcEngine.current
      ?.switchChannel(token, newChannelName)
      .catch((error) => console.log(error));
  };

  const leaveChannel = useCallback(async () => {
    await rtcEngine.current
      ?.leaveChannel()
      .catch((error) => console.log("leaveChannel: ", error));

    setPeerIds([]);
    setJoinSucceed(false);

    // set the state back to normal
    setClientRole(ClientRole.Broadcaster);
  }, []);

  const toggleIsSpeakerEnabled = useCallback(async () => {
    await rtcEngine.current
      ?.setEnableSpeakerphone(!isSpeakerEnabled)
      .catch((error) => console.log("toggleIsSpeakerEnabled: ", error));
    setIsSpeakerEnabled(!isSpeakerEnabled);
  }, []);

  return {
    joinChannel,
    leaveChannel,
    toggleIsSpeakerEnabled,
    joinSucceed,
    isSpeakerEnabled,
    peerIds,
    changeChannel,
    error,
    switchRole,
    muted,
  };
};

export default useAgora;
