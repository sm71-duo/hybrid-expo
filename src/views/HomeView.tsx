import React, { useEffect, useState } from "react";
import { Text, Button } from "react-native";
import styled from "styled-components/native";
import { spacing } from "../styles/styling";
import useAgora from "../hooks/useAgora";
import { useRequestAudio } from "../hooks/useRequestAudio";

const HomeView = () => {
  const {
    leaveChannel,
    joinChannel,
    joinSucceed,
    toggleIsSpeakerEnabled,
    isSpeakerEnabled,
    isMuted,
    toggleIsMuted,
    peerIds,
  } = useAgora();

  // Request audio
  useRequestAudio();

  const toggleWalkie = () => {
    if (joinSucceed) return leaveChannel();
    joinChannel();
  };

  const renderOnDisplay = () => {
    return (
      <Display>
        <Text>FM: 106.2</Text>
        <UserInfo>
          <Text>Users</Text>
          <UserAmountText>{peerIds.length}</UserAmountText>
        </UserInfo>
      </Display>
    );
  };

  const renderOffDisplay = () => {
    return <Display style={{ opacity: 0.6 }}></Display>;
  };

  return (
    <Wrapper>
      <TopWrapper>
        {joinSucceed ? renderOnDisplay() : renderOffDisplay()}
        <TopButtonsWrapper>
          <ButtonToggle onPress={joinChannel}>
            <TriagleUp />
          </ButtonToggle>
          <ButtonToggle
            onPress={() => {
              leaveChannel();
              console.log("down");
            }}
          >
            <TriagleDown />
          </ButtonToggle>
        </TopButtonsWrapper>
      </TopWrapper>
      <BottomWrapper>
        <PushToTalkButton onPress={toggleIsMuted} isActive={!isMuted}>
          <TalkText>Talk</TalkText>
        </PushToTalkButton>
      </BottomWrapper>
      <OnOffBottom onPress={toggleWalkie}>
        <XButton>X</XButton>
      </OnOffBottom>
    </Wrapper>
  );
};

const Wrapper = styled.View`
  flex: 1;
  background-color: #6d6d6d;
`;

const UserAmountText = styled.Text`
  color: #009206;
  font-size: 22px;
`;

const TriagleUp = styled.View.attrs({
  width: 0,
  height: 0,
  borderLeftWidth: 12,
  borderRightWidth: 12,
  borderBottomWidth: 18,
  borderStyle: "solid",
  backgroundColor: "transparent",
  borderLeftColor: "transparent",
  borderRightColor: "transparent",
  borderBottomColor: "#ffffff",
})`
  margin-top: -4px;
`;

const TriagleDown = styled.View.attrs({
  width: 0,
  height: 0,
  borderLeftWidth: 12,
  borderRightWidth: 12,
  borderTopWidth: 18,
  borderStyle: "solid",
  backgroundColor: "transparent",
  borderLeftColor: "transparent",
  borderRightColor: "transparent",
  borderTopColor: "#ffffff",
})`
  margin-top: 8px;
`;

const OnOffBottom = styled.Pressable`
  background-color: #ff0000;
  position: absolute;
  bottom: 0
  right: 0
  margin: 24px
  height: 18px
  width: 18px
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
`;

const XButton = styled.Text`
color: white
font-size: 12px
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
  border-radius: 9999px;
  width: 75px;
  height: 75px;
  background-color: ${(props: { isActive: boolean }) =>
    props.isActive ? "#ff0000" : "#4e4e4e"};
  justify-content: center;
  align-items: center;
  margin-top: -45px;
`;

const BigCircle = styled.View`
  margin-top: 16px;
  border-radius: 9999px;
  width: 200px;
  height: 200px;
  background-color: #4e4e4e;
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
  padding: 16px;
  height: 185px;
  border: 8px solid #4e4e4e;
  background-color: #a2bea0;
  border-radius: 24px;
  flex-direction: row;
  justify-content: space-between;
`;

const UserInfo = styled.View`
  align-items: flex-end;
`;

const TopButtonsWrapper = styled.View`
  margin-horizontal: 75px;
  margin-vertical: 24px;
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
  border-radius: 99999px;
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
  border-radius: 99999px;
  background-color: #4e4e4e;
  width: 60px;
  height: 60px;
`;

const BottomWrapper = styled.View`
  padding: ${spacing.s4}px;
  flex: 1;
  align-items: center;
`;

export default HomeView;
