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
      <Text>Eyoo</Text>
      <Button
        title={`${joinSucceed ? "Leave" : "Join"} channel`}
        onPress={joinSucceed ? leaveChannel : joinChannel}
      />
      <Button
        title={`Microphone ${openMicrophone ? "on" : "off"}`}
        onPress={switchMicrophone}
      />
      <Button
        title={`Speaker phone ${enableSpeakerphone ? "on" : "off"}`}
        onPress={switchSpeakerphone}
      />
    </Wrapper>
  );
};

const Wrapper = styled.View`
  margin: ${spacing.s4}px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default HomeView;
