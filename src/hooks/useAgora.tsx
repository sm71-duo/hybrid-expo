import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, Button } from "react-native";
import RtcEngine from "react-native-agora";

const useAgora = () => {
  const [appId] = useState("6e8c688be0734ab097c496f141dbc255");
  const [token, setToken] = useState(null);
  const [channelName, setChannelName] = useState("channel-x");
  const [openMicrophone, setOpenMicrophone] = useState(true);
  const [enableSpeakerphone, setEnableSpeakerphone] = useState(true);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState<[]>([]);

  let _engine: RtcEngine;

  useEffect(() => {
    if (Platform.OS === "android") {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log("requested!");
      });
    }
    init();
    return () => {
      _engine.destroy();
    };
  }, []);

  const requestCameraAndAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted["android.permission.RECORD_AUDIO"] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("You can use the mic");
      } else {
        console.log("Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const init = async () => {
    _engine = await RtcEngine.create(appId);
    await _engine.enableAudio();

    _engine.addListener("UserJoined", (uid, elapsed) => {
      console.log("UserJoined", uid, elapsed);
      if (peerIds.indexOf(uid) === -1) {
        setPeerIds({ ...peerIds, uid });
      }
    });

    _engine.addListener("UserOffline", (uid, reason) => {
      console.log("UserOffline", uid, reason);

      const oldPeerIds = peerIds;
      oldPeerIds.filter((id) => id !== uid);
      setPeerIds(oldPeerIds);
    });

    _engine.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
      console.log("JoinChannelSuccess", channel, uid, elapsed);
      setJoinSucceed(true);
    });
  };

  const joinChannel = async () => {
    await _engine?.joinChannel(token, channelName, null, 0).then(() => {
      console.log(token, channelName);
    });
  };

  const switchMicrophone = () => {
    _engine
      ?.enableLocalAudio(!openMicrophone)
      .then(() => {
        setOpenMicrophone(!openMicrophone);
      })
      .catch((err) => {
        console.warn("enableLocalAudio", err);
      });
  };

  const switchSpeakerphone = () => {
    _engine
      ?.setEnableSpeakerphone(!enableSpeakerphone)
      .then(() => {
        setEnableSpeakerphone(!enableSpeakerphone);
      })
      .catch((err) => {
        console.warn("setEnableSpeakerphone", err);
      });
  };

  const leaveChannel = async () => {
    await _engine?.leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
  };

  return {
    joinChannel,
    switchMicrophone,
    switchSpeakerphone,
    leaveChannel,
    joinSucceed,
    openMicrophone,
    enableSpeakerphone,
  };
};

export default useAgora;
