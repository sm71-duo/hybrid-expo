import React, { Component } from "react";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Button,
  TextInput,
} from "react-native";
import RtcEngine from "react-native-agora";

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

interface Props {}

// Define a State interface.
interface State {
  appId: string;
  token: any;
  channelName: string;
  joinSucceed: boolean;
  openMicrophone: boolean;
  enableSpeakerphone: boolean;
  peerIds: number[];
}

class AgoraView extends Component<Props, State> {
  _engine?: RtcEngine;
  // Add a constructor，and initialize this.state. You need:
  // Replace yourAppId with the App ID of your Agora project.
  // Replace yourChannel with the channel name that you want to join.
  // Replace yourToken with the token that you generated using the App ID and channel name above.
  constructor(props) {
    super(props);
    this.state = {
      appId: `6e8c688be0734ab097c496f141dbc255`,
      token: null,
      channelName: "channel-x",
      openMicrophone: true,
      enableSpeakerphone: true,
      joinSucceed: false,
      peerIds: [],
    };
    if (Platform.OS === "android") {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log("requested!");
      });
    }
  }
  // Mount the App component into the DOM.
  componentDidMount() {
    this.init();
  }
  init = async () => {
    const { appId } = this.state;
    this._engine = await RtcEngine.create(appId);
    // Enable the audio module.
    await this._engine.enableAudio();

    this._engine.addListener("UserJoined", (uid, elapsed) => {
      console.log("UserJoined", uid, elapsed);
      const { peerIds } = this.state;
      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._engine.addListener("UserOffline", (uid, reason) => {
      console.log("UserOffline", uid, reason);
      const { peerIds } = this.state;
      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter((id) => id !== uid),
      });
    });

    this._engine.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
      console.log("JoinChannelSuccess", channel, uid, elapsed);
      this.setState({
        joinSucceed: true,
      });
    });
  };

  _joinChannel = async () => {
    await this._engine?.joinChannel(
      this.state.token,
      this.state.channelName,
      null,
      0
    );
    console.log(this.state.channelName);
  };

  _switchMicrophone = () => {
    const { openMicrophone } = this.state;
    this._engine
      ?.enableLocalAudio(!openMicrophone)
      .then(() => {
        this.setState({ openMicrophone: !openMicrophone });
      })
      .catch((err) => {
        console.warn("enableLocalAudio", err);
      });
  };

  _switchSpeakerphone = () => {
    const { enableSpeakerphone } = this.state;
    this._engine
      ?.setEnableSpeakerphone(!enableSpeakerphone)
      .then(() => {
        this.setState({ enableSpeakerphone: !enableSpeakerphone });
      })
      .catch((err) => {
        console.warn("setEnableSpeakerphone", err);
      });
  };

  _leaveChannel = async () => {
    await this._engine?.leaveChannel();
    this.setState({ peerIds: [], joinSucceed: false });
  };

  render() {
    const { channelName, joinSucceed, openMicrophone, enableSpeakerphone } =
      this.state;
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({ channelName: text })}
            placeholder={"Channel Name"}
            value={channelName}
          />
          <Button
            onPress={joinSucceed ? this._leaveChannel : this._joinChannel}
            title={`${joinSucceed ? "Leave" : "Join"} channel`}
          />
        </View>
        <View style={styles.float}>
          <Button
            onPress={this._switchMicrophone}
            title={`Microphone ${openMicrophone ? "on" : "off"}`}
          />
          <Button
            onPress={this._switchSpeakerphone}
            title={enableSpeakerphone ? "Speakerphone" : "Earpiece"}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  float: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  top: {
    width: "100%",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
  },
});

export default AgoraView;
