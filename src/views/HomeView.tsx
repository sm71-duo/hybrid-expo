import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { spacing, variables } from "../styles/styling";
import useAgora from "../hooks/useAgora";
import { useRequestAudio } from "../hooks/useRequestAudio";
import DisplayScreen from "../components/DisplayScreen";
import { Animated, Pressable } from "react-native";
import { useButtonAnimation } from "../hooks/useButtonAnimation";
import { useWebsocket } from "../hooks/useWebsockets";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FmChannels = [
  { id: 1, name: "channel-1", fm: "100.0" },
  { id: 2, name: "channel-2", fm: "101.0" },
  { id: 3, name: "channel-3", fm: "102.0" },
];

const HomeView = () => {
  const buttonAnimation = useButtonAnimation();
  const { talking, websocketId, socket, currentChannel, joinRoom, leaveRoom } =
    useWebsocket();
  const {
    leaveChannel,
    joinChannel,
    joinSucceed,
    toggleMute,
    muted,
    peerIds,
    changeChannel,
    error,
    loading,
    setLoading,
  } = useAgora(socket);

  // Request audio
  useRequestAudio();

  const [channel, setChannel] = useState<any>(FmChannels[1]);
  const [isTurnedOn, setIsTurnedOn] = useState<boolean>(false);

  useEffect(() => {
    console.log(talking);
    if (muted) {
      Animated.timing(buttonAnimation.animatedButtonOpacity, {
        ...buttonAnimation.animationSettings,
        toValue: talking ? 1 : 0,
      }).start();
    }
  }, [talking]);

  const channelUp = () => {
    setLoading(true);
    const oldChannelName = channel.name;
    if (channel.id === FmChannels.length) {
      setChannel(FmChannels[0]);
      changeChannel(oldChannelName, FmChannels[0].name);
      return;
    }
    setChannel(FmChannels[channel.id]);
    changeChannel(oldChannelName, FmChannels[channel.id].name);
  };

  const channelDown = () => {
    setLoading(true);
    const oldChannelName = channel.name;
    if (channel.id === 1) {
      setChannel(FmChannels[FmChannels.length - 1]);
      changeChannel(oldChannelName, FmChannels[FmChannels.length - 1].name);
      return;
    }
    setChannel(FmChannels[channel.id - 2]);
    changeChannel(oldChannelName, FmChannels[channel.id - 2].name);
  };

  const toggleWalkie = async () => {
    setIsTurnedOn(!isTurnedOn);
    if (joinSucceed) {
      leaveChannel();
      leaveRoom(channel.name);
      return;
    }
    setLoading(true);
    await joinRoom(channel.name)
      .then(() => {
        joinChannel(channel.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const activateButton = () => {
    toggleMute(channel.name);
    Animated.timing(buttonAnimation.animatedButtonColor, {
      ...buttonAnimation.animationSettings,
      toValue: muted ? 1 : 0,
    }).start();
  };

  return (
    <Wrapper>
      <TopWrapper>
        <DisplayScreen
          connections={peerIds.length}
          hasError={error}
          loading={loading}
          channelName={channel.fm}
          turnedOn={isTurnedOn}
        />
        <TopButtonsWrapper>
          <ButtonToggle
            onPress={() => {
              console.log("up");
              channelUp();
            }}
            disabled={!joinSucceed}
          >
            <TriagleUp />
          </ButtonToggle>
          <ButtonToggle
            onPress={() => {
              console.log("down");
              channelDown();
            }}
            disabled={!joinSucceed}
          >
            <TriagleDown />
          </ButtonToggle>
        </TopButtonsWrapper>
      </TopWrapper>
      <BottomWrapper>
        <FakeShadows isTalking={talking && muted}>
          <PushToTalkButton
            style={[
              {
                backgroundColor: buttonAnimation.animatedButtonColorInterpolate,
                opacity: buttonAnimation.animatedButtonOpacityInterpolate,
              },
            ]}
            onPressIn={activateButton}
            onPressOut={activateButton}
            isActive={!muted}
            disabled={
              !joinSucceed ||
              (talking &&
                !(websocketId === socket.id) &&
                channel !== currentChannel)
            }
          >
            <TalkText>Talk</TalkText>
          </PushToTalkButton>
        </FakeShadows>
      </BottomWrapper>
      <OnOffBottom onPress={toggleWalkie} isActive={isTurnedOn} hitSlop={20}>
        <XButton>{isTurnedOn ? "off" : "on"}</XButton>
      </OnOffBottom>
    </Wrapper>
  );
};

const Wrapper = styled.View`
  flex: 1;
  background-color: #6d6d6d;
`;

const TriagleUp = styled.View.attrs({
  width: 0,
  height: 0,
  borderLeftWidth: spacing.s3,
  borderRightWidth: spacing.s3,
  borderBottomWidth: 18,
  borderStyle: "solid",
  backgroundColor: "transparent",
  borderLeftColor: "transparent",
  borderRightColor: "transparent",
  borderBottomColor: "#ffffff",
})`
  margin-top: -${spacing.s1}px;
`;

const TriagleDown = styled.View.attrs({
  width: 0,
  height: 0,
  borderLeftWidth: spacing.s3,
  borderRightWidth: spacing.s3,
  borderTopWidth: 18,
  borderStyle: "solid",
  backgroundColor: "transparent",
  borderLeftColor: "transparent",
  borderRightColor: "transparent",
  borderTopColor: "#ffffff",
})`
  margin-top: ${spacing.s2}px;
`;

const OnOffBottom = styled.Pressable`
  background-color: ${(props: { isActive: boolean }) =>
    props.isActive ? "#770202" : "#009206"};
  position: absolute;
  bottom: 0;
  right: 0;
  margin: ${spacing.s6}px;
  height: 48px;
  width: 48px;
  justify-content: center;
  align-items: center;
  border-radius: ${variables.borderRadius.round}px;
`;

const XButton = styled.Text`
color: white
font-size: 18px
font-weight: bold`;

const TopWrapper = styled.View`
  padding: ${spacing.s4}px;
  background-color: #595959;
`;

const PushToTalkButton = styled(AnimatedPressable)`
  border-radius: ${variables.borderRadius.round}px;
  width: 75px;
  height: 75px;
  background-color: ${(props: { isActive: boolean }) =>
    props.isActive ? "#ff0000" : "#4e4e4e"};
  justify-content: center;
  align-items: center;
`;

const FakeShadows = styled.View.attrs({
  shadowColor: "#ff0000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 1,
  shadowRadius: 2,

  elevation: 8,
})`
  border-radius: ${variables.borderRadius.round}px;
  width: 78px;
  height: 78px;
  background-color: ${(props: { isTalking: boolean }) =>
    props.isTalking ? "#77020220" : "#4e4e4e00"};
  justify-content: center;
  align-items: center;
  margin-top: -45px;
`;

const TalkText = styled.Text`
  color: white;
`;

const TopButtonsWrapper = styled.View`
  margin-horizontal: 75px;
  margin-vertical: ${spacing.s6}px;
  justify-content: space-between;
  flex-direction: row;
`;

const ButtonToggle = styled.Pressable.attrs({
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 1,
  shadowRadius: 2,

  elevation: 8,
})`
  border-radius: ${variables.borderRadius.round}px;
  background-color: #4e4e4e;
  width: 60px;
  height: 60px;
  justify-content: center
  align-items: center
`;

const BottomWrapper = styled.View`
  padding: ${spacing.s4}px;
  flex: 1;
  align-items: center;
`;

export default HomeView;
