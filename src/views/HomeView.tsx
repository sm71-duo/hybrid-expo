import React, { useEffect, useState } from "react";
import { Text, Button } from "react-native";
import styled from "styled-components/native";
import { spacing } from "../styles/styling";
import useAgora from "../hooks/useAgora";

const HomeView = () => {
  const {
    switchMicrophone,
    switchSpeakerphone,
    leaveChannel,
    joinChannel,
    joinSucceed,
    openMicrophone,
    enableSpeakerphone,
  } = useAgora();

  return (
    <Wrapper>
      <TopWrapper>
        <Display>
          <Text>FM: 106.2</Text>
          <UserInfo>
            <Text>Users</Text>
            <Text>0</Text>
          </UserInfo>
        </Display>
        <TopButtonsWrapper>
          <ButtonUp
            onPress={() => {
              console.log("up");
            }}
          ></ButtonUp>
          <ButtonDown
            onPress={() => {
              console.log("down");
            }}
          ></ButtonDown>
        </TopButtonsWrapper>
      </TopWrapper>
      <BottomWrapper>
        <PushToTalkButton>
          <TalkText>Talk</TalkText>
        </PushToTalkButton>
        <BigCircle></BigCircle>
      </BottomWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.View`
  flex: 1;
  background-color: #6d6d6d;
`;

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
  background-color: #4e4e4e;
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

const ButtonUp = styled.Pressable.attrs({
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
