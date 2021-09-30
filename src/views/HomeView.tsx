import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import styled from "styled-components/native";
import { palette, spacing, variables } from "../styles/styling";
import useAgora from "../hooks/useAgora";
import { useRequestAudio } from "../hooks/useRequestAudio";

const FmChannels = [
  { id: 1, name: "channel-1", fm: "100.0" },
  { id: 2, name: "channel-2", fm: "101.0" },
  { id: 3, name: "channel-0", fm: "99.0" },
];

const HomeView = () => {
  const {
    leaveChannel,
    joinChannel,
    joinSucceed,
    toggleIsSpeakerEnabled,
    isSpeakerEnabled,
    switchRole,
    muted,
    peerIds,
    changeChannel,
    error,
  } = useAgora();
  useRequestAudio();

  const [channel, setChannel] = useState<any>(FmChannels[0]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (joinSucceed) return setLoading(false);
  }, [joinSucceed]);

  // const channelUp = () => {
  //   setChannel(FmChannels[1]);
  //   changeChannel("channel-2");
  // };

  // const channelDown = () => {
  //   setChannel(FmChannels[2]);
  //   changeChannel("channel-0");
  // };

  const channelUp = () => {
    const channelsCount = FmChannels.length;
    if (channel.id === channelsCount) {
      setChannel(FmChannels[0]);
      changeChannel(channel.name);
      return;
    }
    setChannel(FmChannels[channel.id]);
    changeChannel(channel.name);
  };

  const channelDown = () => {
    const channelsCount = FmChannels.length;
    if (channel.id === 1) {
      setChannel(FmChannels[channelsCount - 1]);
      changeChannel(channel.name);
      return;
    }
    setChannel(FmChannels[channel.id - 2]);
    changeChannel(channel.name);
  };

  const toggleWalkie = () => {
    if (joinSucceed) return leaveChannel();
    setLoading(true);
    console.log("here");
    joinChannel();
  };

  const renderOnDisplay = () => {
    return (
      <Display>
        <Text>FM: {channel.fm}</Text>
        <UserInfo>
          <Text>Users</Text>
          <UserAmountText>{peerIds.length}</UserAmountText>
        </UserInfo>
      </Display>
    );
  };

  const renderOffDisplay = () => {
    if (error) return renderErrorMessage();

    return (
      <Display style={{ opacity: 0.6 }}>
        {loading ? renderLoading() : null}
      </Display>
    );
  };

  const renderLoading = () => {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color={palette.dark} />
      </LoadingView>
    );
  };

  const renderErrorMessage = () => {
    return (
      <Display style={{ opacity: 0.6 }}>
        <ErrorText>An error has occured.. {error}</ErrorText>
      </Display>
    );
  };

  return (
    <Wrapper>
      <TopWrapper>
        {joinSucceed ? renderOnDisplay() : renderOffDisplay()}
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
        <PushToTalkButton
          onPress={switchRole}
          isActive={!muted}
          disabled={!joinSucceed}
        >
          <TalkText>Talk</TalkText>
        </PushToTalkButton>
      </BottomWrapper>
      <OnOffBottom onPress={toggleWalkie} isActive={joinSucceed} hitSlop={20}>
        <XButton>{joinSucceed ? "off" : "on"}</XButton>
      </OnOffBottom>
    </Wrapper>
  );
};

const Wrapper = styled.View`
  flex: 1;
  background-color: #6d6d6d;
`;

const LoadingView = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const UserAmountText = styled.Text`
  color: #009206;
  font-size: 22px;
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

const PushToTalkButton = styled.Pressable.attrs({
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
  width: 75px;
  height: 75px;
  background-color: ${(props: { isActive: boolean }) =>
    props.isActive ? "#ff0000" : "#4e4e4e"};
  justify-content: center;
  align-items: center;
  margin-top: -45px;
`;

const TalkText = styled.Text`
  color: white;
`;

const Display = styled.View.attrs({
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 1,
  shadowRadius: 2,

  elevation: 8,
})`
  margin-top: 40px;
  padding: ${spacing.s4}px;
  height: 185px;
  border: 8px solid #4e4e4e;
  background-color: #a2bea0;
  border-radius: ${spacing.s6}px;
  flex-direction: row;
  justify-content: space-between;
`;

const UserInfo = styled.View`
  align-items: flex-end;
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

const ButtonDown = styled.Pressable.attrs({
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
`;

const BottomWrapper = styled.View`
  padding: ${spacing.s4}px;
  flex: 1;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: #ff0000;
  font-size: 18px;
`;

export default HomeView;
