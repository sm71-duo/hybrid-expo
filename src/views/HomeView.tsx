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
  } = useAgora();

  // Request audio
  useRequestAudio();

  return (
    <Wrapper>
      <Text>Eyoo</Text>
      <Button
        title={`${joinSucceed ? "Leave" : "Join"} channel`}
        onPress={joinSucceed ? leaveChannel : joinChannel}
      />
      <Button
        title={`Speaker phone ${isSpeakerEnabled ? "on" : "off"}`}
        onPress={toggleIsSpeakerEnabled}
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
